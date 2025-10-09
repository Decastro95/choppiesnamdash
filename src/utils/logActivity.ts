// src/utils/logActivity.ts
import { supabase } from "../supabaseClient";
import type { Database } from "../types/supabase";

type ActivityInsert = Database["public"]["Tables"]["activity_log"]["Insert"];

export async function logActivitySimple(userId: string | null, action: string) {
  try {
    const payload: ActivityInsert = {
      user_id: userId ?? null,
      user_email: null,
      action,
      timestamp: new Date().toISOString(),
    };
    const { error } = await supabase.from("activity_log").insert([payload]);
    if (error) console.error("logActivitySimple error:", error);
  } catch (err) {
    console.error(err);
  }
}
