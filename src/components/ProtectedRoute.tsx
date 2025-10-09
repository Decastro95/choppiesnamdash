// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import type { Database } from "../types/supabase";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // e.g. ['admin','manager']
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const email = authData.user.email ?? null;
      if (!email) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      const userData = data as UserRow | null;
      if (userData?.role) setUserRole(userData.role.toLowerCase());
      else setUserRole(null);

      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
