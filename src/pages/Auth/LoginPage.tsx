// src/pages/Auth/LoginPage.tsx
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // NOTE: if using supabase auth (recommended) use supabase.auth.signInWithPassword
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    // fetch app user row from users table (if you keep a separate users table)
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.warn("users row not found", error);
      }

      const userData = data as UserRow | null;

      if (userData?.role) {
        const role = (userData.role || "").toLowerCase();
        // redirect / set role-based state here
        console.log("role:", role);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        <button className="px-4 py-2 bg-red-700 text-white rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
