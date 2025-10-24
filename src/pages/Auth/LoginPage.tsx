// src/pages/Auth/LoginPage.tsx
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../../utils/logActivity";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    // log login action (if you keep auth_user_id in users table, log with uuid)
    await logActivity({
      user_id: data.user?.id ?? null,
      action: "login",
      details: `Login by ${email}`,
    });
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="app-header card mb-4">
        <div className="text-xl font-bold">Choppies Namibia</div>
      </div>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-sm">Email</label>
            <input className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full border rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary w-full py-2 rounded text-white" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
