import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Role {
  name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Optional: fetch user role(s) from the database
      const { data: rolesData } = await supabase.from("roles").select("name");
      setRoles(rolesData ?? []);
    };

    fetchData();
  }, []);

  const roleName = roles?.[0]?.name ?? "Guest";

  return (
    <nav className="w-full bg-gradient-to-r from-choppies-red to-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded p-1">
            <img src="/brand/choppies-logo.png" alt="Choppies" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Choppies Namibia</h1>
            <p className="text-xs text-red-100 italic">Great value for your money!</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-sm">
            <span className="font-semibold">{user?.email ?? "Not logged in"}</span>
            <span className="text-xs text-red-100">{roleName}</span>
          </div>
          <img src="/brand/namibian-flag.svg" alt="Namibia" className="h-6 w-9 rounded shadow-md" />
        </div>
      </div>
    </nav>
  );
}
