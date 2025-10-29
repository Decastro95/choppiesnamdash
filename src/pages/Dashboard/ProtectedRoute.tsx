import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role_id, roles(name)")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          console.error("Role fetch error:", profileError);
          setUserRole(null);
        } else {
          const roleName = (profile as any).roles?.name;
          setUserRole(roleName || null);
        }
      } catch (err) {
        console.error("Unexpected Supabase error:", err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    getRole();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  if (!userRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
