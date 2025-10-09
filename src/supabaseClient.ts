// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/supabase";

// ensure your env vars are set in your Codespace / Vercel / .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing SUPABASE env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
