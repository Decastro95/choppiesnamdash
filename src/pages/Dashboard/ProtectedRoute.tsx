import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthorized(false);
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .single();

      if (userData && allowedRoles.includes(userData.role.toLowerCase())) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };

    checkSession();
  }, [allowedRoles]);

  if (authorized === null) return <p>Checking permissions...</p>;
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
}
