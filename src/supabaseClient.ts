import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/supabase"; // ✅ type-only import for verbatimModuleSyntax

// Environment variables (make sure they are correctly set in .env.local / .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create a single Supabase client for your app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
