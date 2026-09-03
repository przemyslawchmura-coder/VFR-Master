const SUPABASE_URL =
  "https://espwnhiwflsklkphxitb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_f2_tgYA-n86jxqlHldXpmg_ivcqkr94";

if (window.supabase && window.supabase.createClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );
}

const PASSWORD_RECOVERY_STORAGE_KEY = "revlog.password-recovery-pending";

function getRecoveryRedirectUrl(locationLike = window.location) {
  if (!locationLike || !locationLike.origin || !locationLike.pathname) return null;
  return `${locationLike.origin}${locationLike.pathname}`;
}

function getRecoveryCallbackStatus(locationLike = window.location) {
  const hash = new URLSearchParams(String(locationLike && locationLike.hash || "").replace(/^#/, ""));
  const query = new URLSearchParams(String(locationLike && locationLike.search || "").replace(/^\?/, ""));
  const isRecovery = hash.get("type") === "recovery" || query.get("type") === "recovery";
  const error = hash.get("error_description") || query.get("error_description") || hash.get("error") || query.get("error");
  return Object.freeze({ isRecovery, error: isRecovery && error ? error : null });
}

function setPasswordRecoveryPending(pending) {
  try {
    if (pending) sessionStorage.setItem(PASSWORD_RECOVERY_STORAGE_KEY, "true");
    else sessionStorage.removeItem(PASSWORD_RECOVERY_STORAGE_KEY);
  } catch (_) {}
}

function isPasswordRecoveryPending() {
  try { return sessionStorage.getItem(PASSWORD_RECOVERY_STORAGE_KEY) === "true"; } catch (_) { return false; }
}

function getPasswordRecoveryState() {
  const callback = getRecoveryCallbackStatus();
  return Object.freeze({ active: callback.isRecovery || isPasswordRecoveryPending(), error: callback.error });
}

function getSupabaseClient() {
  if (!window.supabaseClient) {
    throw new Error(
      "Nie udało się załadować klienta Supabase."
    );
  }

  return window.supabaseClient;
}

async function signIn(email, password) {
  const { data, error } =
    await getSupabaseClient().auth.signInWithPassword({
      email,
      password
    });

  if (error) throw error;

  return data.session;
}

async function signUp(email, password) {
  const { data, error } =
    await getSupabaseClient().auth.signUp({
      email,
      password
    });

  if (error) throw error;

  return data;
}

async function requestPasswordReset(email) {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
    redirectTo: getRecoveryRedirectUrl()
  });
  if (error) throw error;
}

async function updateRecoveryPassword(password) {
  if (!isPasswordRecoveryPending() && !getRecoveryCallbackStatus().isRecovery) {
    throw new Error("Brak aktywnej sesji odzyskiwania hasła.");
  }
  const { data, error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw error;
  return data.user;
}

async function signOut() {
  const { error } =
    await getSupabaseClient().auth.signOut();

  if (error) throw error;
}

async function getCurrentSession() {
  const { data, error } =
    await getSupabaseClient().auth.getSession();

  if (error) throw error;

  return data.session;
}

window.signIn = signIn;
window.signUp = signUp;
window.requestPasswordReset = requestPasswordReset;
window.updateRecoveryPassword = updateRecoveryPassword;
window.signOut = signOut;
window.getCurrentSession = getCurrentSession;
window.getRecoveryRedirectUrl = getRecoveryRedirectUrl;
window.getRecoveryCallbackStatus = getRecoveryCallbackStatus;
window.getPasswordRecoveryState = getPasswordRecoveryState;
window.setPasswordRecoveryPending = setPasswordRecoveryPending;

if (window.supabaseClient && window.supabaseClient.auth && window.supabaseClient.auth.onAuthStateChange) {
  window.supabaseClient.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") setPasswordRecoveryPending(true);
  });
}
