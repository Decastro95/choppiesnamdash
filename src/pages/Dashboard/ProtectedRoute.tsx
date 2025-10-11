// src/pages/Dashboard/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Attempt to read role from user_metadata or your users table
      const metadataRole = (data.user.user_metadata as any)?.role;
      if (typeof metadataRole === "string") {
        setUserRole(metadataRole.toLowerCase());
        setLoading(false);
        return;
      }

      // fallback: query our "users" table (if you maintain it)
      const { data: userRow } = await supabase
        .from("users")
        .select("role")
        .eq("email", data.user.email ?? "")
        .maybeSingle();

      const roleFromRow = (userRow as any)?.role;
      setUserRole(typeof roleFromRow === "string" ? roleFromRow.toLowerCase() : null);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (allowedRoles && !allowedRoles.includes(userRole ?? "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
