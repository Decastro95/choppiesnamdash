// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";
import CashierDashboard from "../pages/Dashboard/CashierDashboard";
import CEODashboard from "../pages/Dashboard/CEODashboard";
import SupplierDashboard from "../pages/Dashboard/SupplierDashboard";
import LoginPage from "../pages/Auth/LoginPage";
import UnauthorizedPage from "../pages/Auth/UnauthorizedPage"; // create a simple component if missing

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ceo"
          element={
            <ProtectedRoute allowedRoles={["ceo"]}>
              <CEODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
