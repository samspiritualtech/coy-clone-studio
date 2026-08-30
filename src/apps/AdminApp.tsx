import { Routes, Route } from "react-router-dom";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboardHome from "@/pages/admin/AdminDashboardHome";
import AdminApprovals from "@/pages/admin/AdminApprovals";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSellers from "@/pages/admin/AdminSellers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCollections from "@/pages/admin/AdminCollections";

const WrappedRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
    <AdminDashboardLayout>{children}</AdminDashboardLayout>
  </RoleProtectedRoute>
);

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<WrappedRoute><AdminDashboardHome /></WrappedRoute>} />
      <Route path="/admin/approvals" element={<WrappedRoute><AdminApprovals /></WrappedRoute>} />
      <Route path="/admin/products" element={<WrappedRoute><AdminProducts /></WrappedRoute>} />
      <Route path="/admin/collections" element={<WrappedRoute><AdminCollections /></WrappedRoute>} />
      <Route path="/admin/sellers" element={<WrappedRoute><AdminSellers /></WrappedRoute>} />
      <Route path="/admin/settings" element={<WrappedRoute><AdminSettings /></WrappedRoute>} />
      <Route path="/admin/*" element={<AdminLogin />} />
    </Routes>
  );
};

export default AdminApp;
