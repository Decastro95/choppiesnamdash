import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "./supabaseClient";
import type { Database } from "./types/supabase";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        setCurrentUser({ email: data.user.email });
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", currentUser.email);
      if (error) console.error(error);
      else console.log("Fetched user:", data);
    };
    fetchUserData();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppRoutes />
    </div>
  );
}
