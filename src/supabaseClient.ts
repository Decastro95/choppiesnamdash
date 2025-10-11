import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/supabase";

// ✅ Use your actual project URL and anon/public key from the Supabase dashboard
const SUPABASE_URL = "https://prgotskquzwnsphqowdu.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZ290c2txdXp3bnNwaHFvd2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzMzODcsImV4cCI6MjA3MzYwOTM4N30.-c4D1Hd2iqbovDyNJbxe2Oknr3h0AkxU8YtEIahb0C0";

// ✅ Fully typed Supabase client for the entire project
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
