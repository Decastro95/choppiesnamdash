// src/utils/ActivityLogger.ts
import { supabase } from "../supabaseClient";
import type { Database } from "../types/supabase";

type ActivityInsert = Database["public"]["Tables"]["activity_log"]["Insert"];

export async function logActivityBatch(entries: ActivityInsert[]) {
  try {
    const { error } = await supabase.from("activity_log").insert(entries);
    if (error) console.error("ActivityLogger insert error:", error);
  } catch (err) {
    console.error(err);
  }
}
