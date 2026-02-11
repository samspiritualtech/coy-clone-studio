import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { LocationPermissionModal } from "@/components/LocationPermissionModal";
import { ManualLocationSelector } from "@/components/ManualLocationSelector";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import Designers from "./pages/Designers";
import DesignerDetail from "./pages/DesignerDetail";
import DesignerProfilePage from "./pages/DesignerProfilePage";
import Occasions from "./pages/Occasions";
import OccasionDetail from "./pages/OccasionDetail";
import Stores from "./pages/Stores";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import JoinUs from "./pages/JoinUs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import ProductShowcase from "./pages/ProductShowcase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <FilterProvider>
              <WishlistProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/collections/:category" element={<Collections />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/brands" element={<Brands />} />
                    <Route path="/brands/:brandId" element={<BrandDetail />} />
                    <Route path="/designers" element={<Designers />} />
                    <Route path="/designers/:designerId" element={<DesignerDetail />} />
                    <Route path="/designer/:slug" element={<DesignerProfilePage />} />
                    <Route path="/occasions" element={<Occasions />} />
                    <Route path="/occasions/:occasionId" element={<OccasionDetail />} />
                    <Route path="/stores" element={<Stores />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/join" element={<JoinUs />} />
                    <Route path="/product-showcase" element={<ProductShowcase />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                <LocationPermissionModal />
                <ManualLocationSelector />
              </WishlistProvider>
            </FilterProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
