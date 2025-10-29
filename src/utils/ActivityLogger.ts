// src/utils/ActivityLogger.ts
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function logBatch(entries: Array<{ user_id?: string | null; user_email?: string | null; action: string }>) {
  const rows = entries.map((e) => ({
    user_id: e.user_id ?? null,
    action: e.action,
    details: e.user_email ? `Email: ${e.user_email}` : null,
  }));

  const { error } = await supabase.from("activity_log").insert(rows);
  if (error) console.error("logBatch error:", error);
  return { error };
}
