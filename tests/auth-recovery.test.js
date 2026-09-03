"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.join(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const supabaseSource = fs.readFileSync(path.join(root, "js/supabase.js"), "utf8");

function loadSupabase(location = { origin: "https://revlog.example", pathname: "/app/", search: "", hash: "" }) {
  const storage = new Map();
  const calls = [];
  const auth = {
    onAuthStateChange(callback) { this.callback = callback; return { data: { subscription: { unsubscribe() {} } } }; },
    async resetPasswordForEmail(email, options) { calls.push({ method: "resetPasswordForEmail", email, options }); return { error: null }; },
    async updateUser(payload) { calls.push({ method: "updateUser", payload }); return { data: { user: { id: "same-user" } }, error: null }; },
    async getSession() { return { data: { session: { user: { id: "same-user" } } }, error: null }; }
  };
  const context = {
    URLSearchParams,
    window: { location, supabase: { createClient: () => ({ auth }) } },
    sessionStorage: { setItem(key, value) { storage.set(key, value); }, removeItem(key) { storage.delete(key); }, getItem(key) { return storage.get(key) || null; } },
    console
  };
  vm.runInNewContext(supabaseSource, context);
  return { window: context.window, auth, calls };
}

test("recovery request uses Supabase reset API and runtime-derived redirect", async () => {
  const loaded = loadSupabase();
  await loaded.window.requestPasswordReset("rider@example.com");
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.calls[0])), {
    method: "resetPasswordForEmail",
    email: "rider@example.com",
    options: { redirectTo: "https://revlog.example/app/" }
  });
  assert.equal(loaded.window.getRecoveryRedirectUrl({ origin: "http://localhost:3000", pathname: "/" }), "http://localhost:3000/");
});

test("recovery callback is distinct from an ordinary session and enters reset state", () => {
  const recovery = loadSupabase({ origin: "https://revlog.example", pathname: "/app/", search: "", hash: "#type=recovery&access_token=test" });
  assert.deepEqual(JSON.parse(JSON.stringify(recovery.window.getPasswordRecoveryState())), { active: true, error: null });
  const ordinary = loadSupabase({ origin: "https://revlog.example", pathname: "/app/", search: "", hash: "" });
  assert.deepEqual(JSON.parse(JSON.stringify(ordinary.window.getPasswordRecoveryState())), { active: false, error: null });
  ordinary.auth.callback("SIGNED_IN", { user: { id: "same-user" } });
  assert.equal(ordinary.window.getPasswordRecoveryState().active, false);
  recovery.auth.callback("PASSWORD_RECOVERY", { user: { id: "same-user" } });
  assert.equal(recovery.window.getPasswordRecoveryState().active, true);
});

test("recovery password update uses the existing recovery session and identity", async () => {
  const loaded = loadSupabase({ origin: "https://revlog.example", pathname: "/app/", search: "", hash: "#type=recovery" });
  await loaded.window.updateRecoveryPassword("new-password");
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.calls[0])), { method: "updateUser", payload: { password: "new-password" } });
});

test("expired recovery callbacks and missing recovery sessions fail closed", async () => {
  const expired = loadSupabase({ origin: "https://revlog.example", pathname: "/app/", search: "", hash: "#error=access_denied&type=recovery" });
  assert.deepEqual(JSON.parse(JSON.stringify(expired.window.getPasswordRecoveryState())), { active: true, error: "access_denied" });
  const ordinary = loadSupabase();
  await assert.rejects(() => ordinary.window.updateRecoveryPassword("new-password"), /Brak aktywnej sesji/);
  assert.equal(ordinary.calls.length, 0);
});

test("login UI exposes recovery and app guards recovery callbacks", () => {
  assert.match(index, /Nie pamiętasz hasła\?/);
  assert.match(index, /id="passwordRecoveryRequest"/);
  assert.match(index, /id="passwordRecoveryForm"/);
  assert.match(app, /window\.getPasswordRecoveryState\(\)/);
  assert.match(app, /showPasswordRecovery\(\)/);
  assert.match(app, /return;[\s\S]+const session = await window\.getCurrentSession\(\)/);
});

test("password validation is local and fail-closed", () => {
  assert.match(app, /password\.length < 8/);
  assert.match(app, /password !== confirmation/);
  assert.match(app, /window\.updateRecoveryPassword\(password\)/);
  assert.doesNotMatch(app, /signUp\([^\n]*recovery/);
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
