import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRoute from "./pages/Dashboard/ProtectedRoute";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import CEODashboard from "./pages/Dashboard/CEODashboard";
import ManagerDashboard from "./pages/Dashboard/ManagerDashboard";
import SupplierDashboard from "./pages/Dashboard/SupplierDashboard";
import CashierDashboard from "./pages/Dashboard/CashierDashboard";
import ActivityLogPage from "./pages/Dashboard/ActivityLogPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ceo"
          element={
            <ProtectedRoute allowedRoles={["ceo"]}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cashier"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/activity-log"
          element={
            <ProtectedRoute allowedRoles={["admin", "ceo"]}>
              <ActivityLogPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
