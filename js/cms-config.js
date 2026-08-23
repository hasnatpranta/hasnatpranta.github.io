// Supabase project connection — the anon key is a PUBLIC key by design
// (Supabase's own docs: safe to ship in client code). Write access is
// enforced by Row Level Security in the database, not by hiding this key.
// Get these two values from: Supabase Dashboard -> Project Settings -> API.
export const SUPABASE_URL = "https://fcyrhduqnqalvshxvvnx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeXJoZHVxbnFhbHZzaHh2dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NDYwNjIsImV4cCI6MjEwMzAyMjA2Mn0.ZGiHGxt98_Xz1D_fqkENE7k-ap9ba2kJ7ESFJAwmnQ4";
