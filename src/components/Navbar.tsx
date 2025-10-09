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
    <nav className="w-full bg-red-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <h1 className="text-xl font-bold tracking-wide">Choppies Namibia</h1>
        <div className="flex flex-col items-end text-sm">
          <span>{user?.email ?? "Not logged in"}</span>
          <span className="italic text-gray-200">{roleName}</span>
        </div>
      </div>
    </nav>
  );
}
