import { Routes, Route } from "react-router-dom";
import { SellerPublicLayout } from "@/layouts/SellerPublicLayout";
import { SellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import SellerLanding from "@/pages/seller/SellerLanding";
import SellerLogin from "@/pages/seller/SellerLogin";
import SellerDashboardHome from "@/pages/seller/SellerDashboardHome";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerAddProduct from "@/pages/seller/SellerAddProduct";
import SellerOrders from "@/pages/seller/SellerOrders";
import SellerSettings from "@/pages/seller/SellerSettings";

const WrappedRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleProtectedRoute requiredRole="seller" loginPath="/seller/login" unauthorizedRedirect="/seller">
    <SellerDashboardLayout>{children}</SellerDashboardLayout>
  </RoleProtectedRoute>
);

const SellerApp = () => {
  return (
    <Routes>
      <Route path="/seller" element={<SellerPublicLayout><SellerLanding /></SellerPublicLayout>} />
      <Route path="/seller/join" element={<SellerPublicLayout><SellerLanding /></SellerPublicLayout>} />
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/dashboard" element={<WrappedRoute><SellerDashboardHome /></WrappedRoute>} />
      <Route path="/seller/products" element={<WrappedRoute><SellerProducts /></WrappedRoute>} />
      <Route path="/seller/products/new" element={<WrappedRoute><SellerAddProduct /></WrappedRoute>} />
      <Route path="/seller/orders" element={<WrappedRoute><SellerOrders /></WrappedRoute>} />
      <Route path="/seller/settings" element={<WrappedRoute><SellerSettings /></WrappedRoute>} />
      <Route path="/seller/*" element={<SellerPublicLayout><SellerLanding /></SellerPublicLayout>} />
    </Routes>
  );
};

export default SellerApp;
