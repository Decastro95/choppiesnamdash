// src/utils/logActivity.ts
import { supabase } from "../supabaseClient";

export async function logActivity(entry: {
  user_id: string | null;
  action: string;
  details: string;
}) {
  try {
    await supabase.from("activity_log").insert([
      {
        user_id: entry.user_id,
        action: entry.action,
        details: entry.details,
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("logActivity error:", error);
  }
}
