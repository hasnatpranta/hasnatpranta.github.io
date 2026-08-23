// Copy this file to cms-config.js and fill in your own Supabase project's values.
// Both are found at: Supabase Dashboard -> Project Settings -> API.
//
// The anon key is a PUBLIC key by design (Supabase's own docs say it's safe to
// ship in client-side code) — actual write access is enforced by Row Level
// Security policies in the database (see supabase/schema.sql), not by hiding
// this key. There is no separate secret to keep out of the repository in this
// architecture. NEVER put the "service_role" key here or anywhere in this project.
export const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
