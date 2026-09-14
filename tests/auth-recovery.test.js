"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.join(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const deploymentConfigSource = fs.readFileSync(path.join(root, "js/deployment-config.js"), "utf8");
const supabaseSource = fs.readFileSync(path.join(root, "js/supabase.js"), "utf8");
const initializeAuthSource = app.slice(app.indexOf("async function initializeAuth()"), app.indexOf("\ndocument.addEventListener", app.indexOf("async function initializeAuth()")));

function loadDeploymentConfig(location) {
  const context = { window: { location } };
  vm.runInNewContext(deploymentConfigSource, context);
  return context.window.REVLOG_CONFIG || null;
}

function loadSupabase(location = { origin: "https://revlog.example", hostname: "revlog.example", pathname: "/app/", search: "", hash: "" }, config = {}, options = {}) {
  const storage = new Map();
  const calls = [];
  const auth = {
    onAuthStateChange(callback) { this.callback = callback; return { data: { subscription: { unsubscribe() {} } } }; },
    async resetPasswordForEmail(email, options) { calls.push({ method: "resetPasswordForEmail", email, options }); return { error: null }; },
    async updateUser(payload) { calls.push({ method: "updateUser", payload }); return { data: { user: { id: "same-user" } }, error: options.updateError || null }; },
    async getSession() { return { data: { session: { user: { id: options.sessionUserId || "same-user" } } }, error: null }; }
  };
  const context = {
    URLSearchParams,
    URL,
    window: { location, REVLOG_CONFIG: config, supabase: { createClient: () => ({ auth }) } },
    sessionStorage: { setItem(key, value) { storage.set(key, value); }, removeItem(key) { storage.delete(key); }, getItem(key) { return storage.get(key) || null; } },
    console
  };
  vm.runInNewContext(supabaseSource, context);
  return { window: context.window, auth, calls };
}

function loadInitializeAuth({ recoveryState, session, authReady = Promise.resolve(), updatePending = () => {}, onApplication = () => {}, onRecovery = () => {}, onLogin = () => {} }) {
  let sessionCalls = 0;
  const context = {
    window: {
      supabaseAuthReady: authReady,
      getPasswordRecoveryState: () => recoveryState,
      setPasswordRecoveryPending: updatePending,
      getCurrentSession: async () => { sessionCalls += 1; return session; }
    },
    showPasswordRecovery: onRecovery,
    showApplication: onApplication,
    showLoginMode: onLogin,
    VFRApp: { async init() {} }
  };
  vm.runInNewContext(`${initializeAuthSource}; this.initializeAuth = initializeAuth;`, context);
  return { context, getSessionCalls: () => sessionCalls };
}

test("recovery request uses the explicit production redirect and supports local fallback", async () => {
  const loaded = loadSupabase(undefined, { environment: "production", recoveryRedirectUrl: "https://revlog.example/app/" });
  await loaded.window.requestPasswordReset("rider@example.com");
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.calls[0])), {
    method: "resetPasswordForEmail",
    email: "rider@example.com",
    options: { redirectTo: "https://revlog.example/app/" }
  });
  assert.equal(loaded.window.getRecoveryRedirectUrl({ origin: "http://localhost:3000", hostname: "localhost", pathname: "/" }, {}), "http://localhost:3000/");
  assert.equal(loaded.window.getRecoveryRedirectUrl({ origin: "https://revlog.example", hostname: "revlog.example", pathname: "/app/" }, {}), null);
  assert.equal(loaded.window.getRecoveryRedirectUrl(undefined, { recoveryRedirectUrl: "http://revlog.example/app/" }), null);
  assert.equal(loaded.window.getRecoveryRedirectUrl(undefined, { recoveryRedirectUrl: "javascript:alert(1)" }), null);
  await assert.rejects(() => loadSupabase().window.requestPasswordReset("rider@example.com"), /bezpiecznie skonfigurowanego/);
});

test("production deployment config fixes the GitHub Pages recovery path and preserves local fallback", () => {
  const productionLocation = {
    origin: "https://przemyslawchmura-coder.github.io/VFR-Master/",
    hostname: "przemyslawchmura-coder.github.io",
    pathname: "/VFR-Master/",
    search: "",
    hash: ""
  };
  const productionConfig = loadDeploymentConfig(productionLocation);
  assert.deepEqual(JSON.parse(JSON.stringify(productionConfig)), {
    environment: "production",
    recoveryRedirectUrl: "https://przemyslawchmura-coder.github.io/VFR-Master/"
  });
  const production = loadSupabase({ ...productionLocation, origin: "https://unexpected.example/" }, productionConfig);
  assert.equal(production.window.getRecoveryRedirectUrl(), "https://przemyslawchmura-coder.github.io/VFR-Master/");
  assert.match(index, /<script src="js\/deployment-config\.js"><\/script>\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.116\.0"><\/script>/);

  const localConfig = loadDeploymentConfig({ hostname: "localhost", pathname: "/" });
  assert.equal(localConfig, null);
  const local = loadSupabase({ origin: "http://localhost:3000", hostname: "localhost", pathname: "/" }, localConfig || {});
  assert.equal(local.window.getRecoveryRedirectUrl(), "http://localhost:3000/");

  const wrongPathConfig = loadDeploymentConfig({ hostname: "przemyslawchmura-coder.github.io", pathname: "/other/" });
  assert.equal(wrongPathConfig, null);
  const wrongPath = loadSupabase({ origin: "https://przemyslawchmura-coder.github.io/other/", hostname: "przemyslawchmura-coder.github.io", pathname: "/other/" }, wrongPathConfig || {});
  assert.equal(wrongPath.window.getRecoveryRedirectUrl(), null);
});

test("startup waits for PASSWORD_RECOVERY before treating an authenticated recovery session as ordinary", async () => {
  let resolveReady;
  const authReady = new Promise(resolve => { resolveReady = resolve; });
  const recoveryState = { active: false, error: null };
  let recoveryShown = 0;
  let applicationShown = 0;
  const loaded = loadInitializeAuth({
    authReady,
    recoveryState,
    session: { user: { id: "same-user" } },
    onRecovery: () => { recoveryShown += 1; },
    onApplication: () => { applicationShown += 1; }
  });

  const initialization = loaded.context.initializeAuth();
  await Promise.resolve();
  assert.equal(loaded.getSessionCalls(), 0);
  recoveryState.active = true;
  resolveReady({ event: "PASSWORD_RECOVERY", session: { user: { id: "same-user" } } });
  await initialization;
  assert.equal(recoveryShown, 1);
  assert.equal(applicationShown, 0);
});

test("Supabase auth readiness stays pending until the recovery lifecycle event persists state", async () => {
  const loaded = loadSupabase({ origin: "https://revlog.example/app/", hostname: "revlog.example", pathname: "/app/", search: "", hash: "#type=recovery&access_token=callback-token" });
  let ready = false;
  loaded.window.supabaseAuthReady.then(() => { ready = true; });
  loaded.auth.callback("INITIAL_SESSION", { user: { id: "same-user" } });
  await Promise.resolve();
  assert.equal(ready, false);
  assert.equal(loaded.window.getPasswordRecoveryState().active, false);
  loaded.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  await loaded.window.supabaseAuthReady;
  assert.equal(loaded.window.getPasswordRecoveryState().active, true);
});

test("a recovery marker without callback material cannot deadlock ordinary startup", async () => {
  const loaded = loadSupabase({ origin: "https://revlog.example/app/", hostname: "revlog.example", pathname: "/app/", search: "", hash: "#type=recovery" });
  let settled = false;
  loaded.window.supabaseAuthReady.then(() => { settled = true; });
  loaded.auth.callback("INITIAL_SESSION", { user: { id: "same-user" } });
  await Promise.resolve();
  assert.equal(settled, true);
  assert.equal(loaded.window.getPasswordRecoveryState().active, false);
});

test("ordinary startup events still restore normal authenticated sessions", async () => {
  let applicationShown = 0;
  const loaded = loadInitializeAuth({
    authReady: Promise.resolve({ event: "INITIAL_SESSION", session: { user: { id: "same-user" } } }),
    recoveryState: { active: false, error: null },
    session: { user: { id: "same-user" } },
    onApplication: () => { applicationShown += 1; }
  });
  await loaded.context.initializeAuth();
  assert.equal(loaded.getSessionCalls(), 1);
  assert.equal(applicationShown, 1);
});

test("startup recovery errors remain fail-closed instead of opening the application", async () => {
  let loginMessage = null;
  let applicationShown = 0;
  const loaded = loadInitializeAuth({
    authReady: Promise.resolve({ event: "INITIAL_SESSION", session: { user: { id: "same-user" } } }),
    recoveryState: { active: false, error: "access_denied" },
    session: { user: { id: "same-user" } },
    onApplication: () => { applicationShown += 1; },
    onLogin: message => { loginMessage = message; }
  });
  await loaded.context.initializeAuth();
  assert.equal(applicationShown, 0);
  assert.equal(loginMessage, "Link do zmiany hasła jest nieprawidłowy lub wygasł.");
});

test("valid pending recovery survives reload until the pending state is cleared", async () => {
  const recoveryState = { active: true, error: null };
  let recoveryShown = 0;
  let applicationShown = 0;
  const firstLoad = loadInitializeAuth({ recoveryState, session: { user: { id: "same-user" } }, onRecovery: () => { recoveryShown += 1; }, onApplication: () => { applicationShown += 1; } });
  await firstLoad.context.initializeAuth();
  const reloaded = loadInitializeAuth({ recoveryState, session: { user: { id: "same-user" } }, onRecovery: () => { recoveryShown += 1; }, onApplication: () => { applicationShown += 1; } });
  await reloaded.context.initializeAuth();
  assert.equal(recoveryShown, 2);
  assert.equal(applicationShown, 0);
  recoveryState.active = false;
  const afterUpdate = loadInitializeAuth({ recoveryState, session: { user: { id: "same-user" } }, onApplication: () => { applicationShown += 1; } });
  await afterUpdate.context.initializeAuth();
  assert.equal(applicationShown, 1);
});

test("successful password update clears pending state before opening the application", () => {
  assert.match(app, /await window\.updateRecoveryPassword\(password\);[\s\S]*window\.setPasswordRecoveryPending\(false\);[\s\S]*showApplication\(\);/);
});

test("recovery callback is distinct from an ordinary session and enters reset state", () => {
  const recovery = loadSupabase({ origin: "https://revlog.example", hostname: "revlog.example", pathname: "/app/", search: "", hash: "#type=recovery&access_token=test" });
  assert.deepEqual(JSON.parse(JSON.stringify(recovery.window.getPasswordRecoveryState())), { active: false, error: null });
  const ordinary = loadSupabase({ origin: "https://revlog.example", pathname: "/app/", search: "", hash: "" });
  assert.deepEqual(JSON.parse(JSON.stringify(ordinary.window.getPasswordRecoveryState())), { active: false, error: null });
  ordinary.auth.callback("SIGNED_IN", { user: { id: "same-user" } });
  assert.equal(ordinary.window.getPasswordRecoveryState().active, false);
  recovery.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  assert.equal(recovery.window.getPasswordRecoveryState().active, true);
});

test("recovery password update uses the existing recovery session and identity", async () => {
  const loaded = loadSupabase({ origin: "https://revlog.example", hostname: "revlog.example", pathname: "/app/", search: "", hash: "#type=recovery" });
  loaded.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  await loaded.window.updateRecoveryPassword("new-password");
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.calls[0])), { method: "updateUser", payload: { password: "new-password" } });
});

test("expired recovery callbacks and missing recovery sessions fail closed", async () => {
  const expired = loadSupabase({ origin: "https://revlog.example", hostname: "revlog.example", pathname: "/app/", search: "", hash: "#error=access_denied&type=recovery" });
  assert.deepEqual(JSON.parse(JSON.stringify(expired.window.getPasswordRecoveryState())), { active: false, error: "access_denied" });
  const ordinary = loadSupabase();
  await assert.rejects(() => ordinary.window.updateRecoveryPassword("new-password"), /Brak aktywnej sesji/);
  assert.equal(ordinary.calls.length, 0);
});

test("recovery identity mismatch and update failure remain fail-closed", async () => {
  const mismatch = loadSupabase(undefined, {}, { sessionUserId: "different-user" });
  mismatch.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  await assert.rejects(() => mismatch.window.updateRecoveryPassword("new-password"), /nieprawidłowa lub wygasła/);
  assert.equal(mismatch.calls.length, 0);

  const failed = loadSupabase(undefined, {}, { updateError: new Error("provider detail") });
  failed.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  await assert.rejects(() => failed.window.updateRecoveryPassword("new-password"), /provider detail/);
  assert.equal(failed.window.getPasswordRecoveryState().active, true);
  assert.equal(failed.calls.length, 1);
});

test("login UI exposes recovery and app guards recovery callbacks", () => {
  assert.match(index, /Nie pamiętasz hasła\?/);
  assert.match(index, /id="passwordRecoveryRequest"/);
  assert.match(index, /id="passwordRecoveryForm"/);
  assert.match(app, /window\.getPasswordRecoveryState\(\)/);
  assert.match(app, /showPasswordRecovery\(\)/);
  assert.match(app, /return;[\s\S]+const session = await window\.getCurrentSession\(\)/);
  assert.match(app, /passwordRecoveryUpdateInFlight/);
});

test("password validation is local and fail-closed", () => {
  assert.match(app, /password\.length < 8/);
  assert.match(app, /password !== confirmation/);
  assert.match(app, /window\.updateRecoveryPassword\(password\)/);
  assert.doesNotMatch(app, /signUp\([^\n]*recovery/);
  assert.match(app, /disabled = true/);
});

test("all authentication password fields have independent visibility controls", () => {
  assert.equal((index.match(/data-password-toggle/g) || []).length, 3);
  for (const id of ["authPassword", "recoveryPassword", "recoveryPasswordConfirmation"]) {
    assert.match(index, new RegExp(`data-target="${id}"[\\s\\S]+togglePasswordVisibility\\('${id}'`));
  }
  assert.match(app, /input\.type = visible \? "text" : "password"/);
  assert.match(app, /button\.setAttribute\("aria-label", visible \? "Ukryj hasło" : "Pokaż hasło"\)/);
  assert.match(app, /button\.setAttribute\("aria-pressed", String\(visible\)\)/);
});
