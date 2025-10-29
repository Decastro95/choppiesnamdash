import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Sign in with email & password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || "Login failed");
      setLoading(false);
      return;
    }

    // Fetch user role from 'users' table with role name
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role_id, roles(name)")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setErrorMsg("Failed to fetch user role");
      setLoading(false);
      return;
    }

    const roleName = (profile as any).roles?.name;

    // Redirect based on role
    switch (roleName) {
      case "admin":
        navigate("/admin");
        break;
      case "manager":
        navigate("/manager");
        break;
      case "cashier":
        navigate("/cashier");
        break;
      case "ceo":
        navigate("/ceo");
        break;
      case "supplier":
        navigate("/supplier");
        break;
      default:
        navigate("/unauthorized");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {errorMsg && (
          <p className="text-red-600 mb-4 text-center">{errorMsg}</p>
        )}

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
