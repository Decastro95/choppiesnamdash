import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Props {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = supabase.auth.user();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch user role
      const { data, error } = await supabase
        .from("users")
        .select("role_id, roles(name)")
        .eq("id", user.id)
        .single();

      if (error || !data || !allowedRoles.includes(data.roles.name)) {
        navigate("/login");
        return;
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [allowedRoles, navigate]);

  if (!authorized) return <p>Loading...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;
