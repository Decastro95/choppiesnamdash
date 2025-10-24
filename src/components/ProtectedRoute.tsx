// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g. ["Admin","Manager"]
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      const session = supabase.auth.getSession ? await supabase.auth.getSession() : null;
      // supabase v2 uses auth.getUser/getSession patterns; keep defensive
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // read profile table matching auth_user_id (if you store auth id in users.auth_user_id)
      const { data: profile } = await supabase
        .from("users")
        .select("role_id, email")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      // if role mapping exists in your users table as role_id, fetch roles table name
      if (profile?.role_id) {
        const { data: role } = await supabase.from("roles").select("name").eq("id", profile.role_id).maybeSingle();
        const roleName = (role?.name || "").toString();
        setAllowed(!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(roleName));
      } else if (!allowedRoles || allowedRoles.length === 0) {
        setAllowed(true);
      } else {
        // fallback: deny
        setAllowed(false);
      }
      setLoading(false);
    };
    check();
  }, [allowedRoles]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!allowed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
