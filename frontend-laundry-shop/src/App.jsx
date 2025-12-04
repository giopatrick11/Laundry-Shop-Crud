import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder.tsx";
import Orders from "./pages/Orders.tsx";
import Customers from "./pages/Customers";

import Login from "./auth/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import CustomerDetails from "./pages/CustomerDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* SECRETARY + ADMIN ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-order"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <NewOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* ADMIN-ONLY ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCustomers />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT REDIRECT */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/:phone"
          element={
            <ProtectedRoute allowedRoles={["secretary", "admin"]}>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
