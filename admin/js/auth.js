import { supabase, cmsEnabled } from '../../js/supabase-client.js';

export { supabase, cmsEnabled };

export async function getSession() {
  if (!cmsEnabled) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signIn(email, password) {
  if (!cmsEnabled) throw new Error('Supabase is not configured yet (js/cms-config.js is empty).');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  if (cmsEnabled) await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// Call at the top of every protected admin page.
export async function requireAuth() {
  if (!cmsEnabled) {
    document.body.innerHTML = `
      <div class="setup-notice">
        <h1>Dashboard not configured yet</h1>
        <p>Add your Supabase project URL and anon key to <code>js/cms-config.js</code>, run the SQL in
        <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code>, then create your admin user in the
        Supabase dashboard under Authentication → Users. See <code>ADMIN-SETUP.md</code> for the full walkthrough.</p>
      </div>`;
    throw new Error('CMS not configured');
  }
  const session = await getSession();
  if (!session) {
    window.location.href = 'index.html';
    throw new Error('Not authenticated');
  }
  supabase.auth.onAuthStateChange((_event, s) => {
    if (!s) window.location.href = 'index.html';
  });
  return session;
}
