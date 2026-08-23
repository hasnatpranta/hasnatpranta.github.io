// Supabase project connection — the anon key is a PUBLIC key by design
// (Supabase's own docs: safe to ship in client code). Write access is
// enforced by Row Level Security in the database, not by hiding this key.
// Get these two values from: Supabase Dashboard -> Project Settings -> API.
export const SUPABASE_URL = "";
export const SUPABASE_ANON_KEY = "";
