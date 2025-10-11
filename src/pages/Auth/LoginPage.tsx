// src/pages/Auth/LoginPage.tsx
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return;
    }

    // Optional: If you maintain a `users` table with roles, you can fetch role and route.
    const userEmail = data.user?.email ?? "";
    const { data: userRow } = await supabase.from("users").select("role").eq("email", userEmail).maybeSingle();
    const role = (userRow as any)?.role ?? (data.user?.user_metadata as any)?.role ?? "guest";

    // redirect by role (example)
    if (role.toLowerCase() === "cashier") navigate("/cashier");
    else if (role.toLowerCase() === "manager") navigate("/manager");
    else if (role.toLowerCase() === "admin") navigate("/admin");
    else if (role.toLowerCase() === "supplier") navigate("/supplier");
    else navigate("/");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Sign in</h1>
      <form onSubmit={signIn} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
