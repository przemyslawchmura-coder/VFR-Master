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
        detectSessionInUrl: false
      }
    }
  );
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
window.signOut = signOut;
window.getCurrentSession = getCurrentSession;
