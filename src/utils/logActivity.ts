import { supabase } from "../supabaseClient";

export async function logActivity(
  username: string,
  role: string,
  action: string,
  details?: string
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("activity_log").insert([
      {
        user_id: user?.id || null,
        username,
        role,
        action,
        details,
      },
    ]);

    if (error) console.error("Failed to log activity:", error.message);
  } catch (err) {
    console.error("Unexpected logging error:", err);
  }
}
