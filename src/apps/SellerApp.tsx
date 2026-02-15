import { Routes, Route } from "react-router-dom";
import { SellerPublicLayout } from "@/layouts/SellerPublicLayout";
import { SellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import SellerLanding from "@/pages/seller/SellerLanding";
import SellerLogin from "@/pages/seller/SellerLogin";
import SellerDashboardHome from "@/pages/seller/SellerDashboardHome";

const SellerApp = () => {
  return (
    <Routes>
      {/* Public seller pages */}
      <Route
        path="/seller"
        element={
          <SellerPublicLayout>
            <SellerLanding />
          </SellerPublicLayout>
        }
      />
      <Route path="/seller/login" element={<SellerLogin />} />

      {/* Protected seller dashboard */}
      <Route
        path="/seller/dashboard"
        element={
          <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
            <SellerDashboardLayout>
              <SellerDashboardHome />
            </SellerDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
            <SellerDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Products management — coming in Phase 2</div>
            </SellerDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
            <SellerDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Add Product — coming in Phase 2</div>
            </SellerDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
            <SellerDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Orders management — coming in Phase 2</div>
            </SellerDashboardLayout>
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/seller/settings"
        element={
          <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
            <SellerDashboardLayout>
              <div className="text-center py-12 text-muted-foreground">Settings — coming in Phase 2</div>
            </SellerDashboardLayout>
          </RoleProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="/seller/*"
        element={
          <SellerPublicLayout>
            <SellerLanding />
          </SellerPublicLayout>
        }
      />
    </Routes>
  );
};

export default SellerApp;
