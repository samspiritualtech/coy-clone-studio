import { Routes, Route } from "react-router-dom";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboardHome from "@/pages/admin/AdminDashboardHome";

const AdminApp = () => {
  return (
    <Routes>
      {/* Admin login */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
            <AdminDashboardLayout>
              <AdminDashboardHome />
            </AdminDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
            <AdminDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Approval queue — coming in Phase 3</div>
            </AdminDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
            <AdminDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">All products — coming in Phase 3</div>
            </AdminDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
            <AdminDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Seller management — coming in Phase 3</div>
            </AdminDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/">
            <AdminDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Admin settings — coming in Phase 3</div>
            </AdminDashboardLayout>
          </RoleProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/admin/*" element={<AdminLogin />} />
    </Routes>
  );
};

export default AdminApp;
