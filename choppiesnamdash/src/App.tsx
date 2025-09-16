import { useEffect, useState, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { Database } from "./types/supabase";

// Dashboards
import CashierDashboard from "./pages/CashierDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CEODashboard from "./pages/CEODashboard";
import SupplierDashboard from "./pages/SupplierDashboard";

// Components
import Navbar from "./components/Navbar";

// Types
type User = Database["public"]["Tables"]["users"]["Row"];

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const session = supabase.auth.getSession();
    const currentUser = (await session).data.session?.user;
    if (!currentUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", currentUser.email)
      .single();

    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  const ProtectedRoute = ({ children, roles }: { children: ReactNode; roles: string[] }) => {
    if (!user) return <Navigate to="/login" replace />;
    // Assuming user.role_id corresponds to roles array
    const allowedRoles = roles;
    const roleNameMap: Record<number, string> = {
      1: "Admin",
      2: "Manager",
      3: "Cashier",
      4: "CEO",
      5: "Supplier",
    };
    const currentRole = roleNameMap[user.role_id];
    if (!allowedRoles.includes(currentRole)) return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/cashier"
          element={
            <ProtectedRoute roles={["Cashier"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ceo"
          element={
            <ProtectedRoute roles={["CEO"]}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute roles={["Supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<p>Login Page here</p>} />
        <Route path="/unauthorized" element={<p>Unauthorized Access</p>} />
      </Routes>
    </Router>
  );
};

export default App;
