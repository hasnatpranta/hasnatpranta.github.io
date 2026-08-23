import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./cms-config.js";

export const cmsEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = cmsEnabled
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
