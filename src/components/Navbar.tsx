// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Role = "Admin" | "Manager" | "Cashier" | "CEO" | "Supplier";

export default function Navbar() {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      const user = supabase.auth.user();
      if (!user) return navigate("/login");

      const { data, error } = await supabase
        .from("users")
        .select("role_id, roles(name)")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      if (data?.roles?.name) setRole(data.roles.name as Role);
    };

    getUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/" className="font-bold">
          Choppies POS
        </Link>

        {role === "Admin" && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/manager">Manager Dashboard</Link>
            <Link to="/ceo">CEO Dashboard</Link>
            <Link to="/supplier">Supplier Dashboard</Link>
            <Link to="/cashier">Cashier POS</Link>
          </>
        )}

        {role === "Manager" && <Link to="/manager">Manager Dashboard</Link>}
        {role === "Cashier" && <Link to="/cashier">Cashier POS</Link>}
        {role === "CEO" && <Link to="/ceo">CEO Dashboard</Link>}
        {role === "Supplier" && <Link to="/supplier">Supplier Dashboard</Link>}
      </div>

      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}
