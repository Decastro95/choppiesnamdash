import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import CEODashboard from "../pages/Dashboard/CEODashboard";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";
import CashierDashboard from "../pages/Dashboard/CashierDashboard";
import SupplierDashboard from "../pages/Dashboard/SupplierDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ceo"
          element={
            <ProtectedRoute allowedRoles={["CEO"]}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["Manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={["Cashier"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRoles={["Supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
