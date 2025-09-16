// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface NavbarProps {
  role: string | null;
}

export default function Navbar({ role }: NavbarProps) {
  const [userRole, setUserRole] = useState<string | null>(role);

  useEffect(() => {
    setUserRole(role);
  }, [role]);

  const linksByRole: Record<string, { name: string; path: string }[]> = {
    Admin: [
      { name: "Admin Dashboard", path: "/dashboard/admin" },
      { name: "Manager Dashboard", path: "/dashboard/manager" },
      { name: "Cashier Dashboard", path: "/dashboard/cashier" },
      { name: "CEO Dashboard", path: "/dashboard/ceo" },
      { name: "Supplier Dashboard", path: "/dashboard/supplier" },
    ],
    Manager: [
      { name: "Manager Dashboard", path: "/dashboard/manager" },
      { name: "Cashier Dashboard", path: "/dashboard/cashier" },
    ],
    Cashier: [{ name: "Cashier Dashboard", path: "/dashboard/cashier" }],
    CEO: [{ name: "CEO Dashboard", path: "/dashboard/ceo" }],
    Supplier: [{ name: "Supplier Dashboard", path: "/dashboard/supplier" }],
  };

  const links = userRole ? linksByRole[userRole] || [] : [];

  return (
    <nav className="bg-gray-800 text-white p-4 flex space-x-4">
      {links.map((link) => (
        <a
          key={link.path}
          href={link.path}
          className="hover:bg-gray-700 px-3 py-2 rounded"
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
}
