// src/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/supabase"; // auto-generated types

// ✅ use your project URL and anon key from the Supabase dashboard
const supabaseUrl = "https://prgotskquzwnsphqowdu.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
