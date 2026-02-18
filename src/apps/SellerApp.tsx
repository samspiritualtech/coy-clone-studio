import { Routes, Route } from "react-router-dom";
import { SellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { isSubdomain } from "@/lib/domainDetection";
import JoinUs from "@/pages/JoinUs";
import SellerLogin from "@/pages/seller/SellerLogin";
import SellerDashboardHome from "@/pages/seller/SellerDashboardHome";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerAddProduct from "@/pages/seller/SellerAddProduct";
import SellerOrders from "@/pages/seller/SellerOrders";
import SellerSettings from "@/pages/seller/SellerSettings";

const sub = isSubdomain();
const loginPath = sub ? "/login" : "/seller/login";
const homeRedirect = sub ? "/" : "/seller";

const WrappedRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleProtectedRoute requiredRole="seller" loginPath={loginPath} unauthorizedRedirect={homeRedirect}>
    <SellerDashboardLayout>{children}</SellerDashboardLayout>
  </RoleProtectedRoute>
);

const SellerApp = () => {
  return (
    <Routes>
      {/* Support both /seller/* (path-based dev) and /* (subdomain prod) */}
      <Route path="/" element={<JoinUs />} />
      <Route path="/join" element={<JoinUs />} />
      <Route path="/seller" element={<JoinUs />} />
      <Route path="/login" element={<SellerLogin />} />
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/dashboard" element={<WrappedRoute><SellerDashboardHome /></WrappedRoute>} />
      <Route path="/seller/dashboard" element={<WrappedRoute><SellerDashboardHome /></WrappedRoute>} />
      <Route path="/products" element={<WrappedRoute><SellerProducts /></WrappedRoute>} />
      <Route path="/seller/products" element={<WrappedRoute><SellerProducts /></WrappedRoute>} />
      <Route path="/products/new" element={<WrappedRoute><SellerAddProduct /></WrappedRoute>} />
      <Route path="/seller/products/new" element={<WrappedRoute><SellerAddProduct /></WrappedRoute>} />
      <Route path="/orders" element={<WrappedRoute><SellerOrders /></WrappedRoute>} />
      <Route path="/seller/orders" element={<WrappedRoute><SellerOrders /></WrappedRoute>} />
      <Route path="/settings" element={<WrappedRoute><SellerSettings /></WrappedRoute>} />
      <Route path="/seller/settings" element={<WrappedRoute><SellerSettings /></WrappedRoute>} />
      <Route path="*" element={<JoinUs />} />
    </Routes>
  );
};

export default SellerApp;
