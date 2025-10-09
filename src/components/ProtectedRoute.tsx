import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setUserRole(null);
      } else {
        // Example: fetch role from metadata
        const role = data.user.user_metadata?.role || "Guest";
        setUserRole(role);
      }
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
