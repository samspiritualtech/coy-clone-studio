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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LocationPermissionModal } from "@/components/LocationPermissionModal";
import { ManualLocationSelector } from "@/components/ManualLocationSelector";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
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
                    {/* Public route */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                    <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
                    <Route path="/collections/:category" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                    <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
                    <Route path="/brands/:brandId" element={<ProtectedRoute><BrandDetail /></ProtectedRoute>} />
                    <Route path="/designers" element={<ProtectedRoute><Designers /></ProtectedRoute>} />
                    <Route path="/designers/:designerId" element={<ProtectedRoute><DesignerDetail /></ProtectedRoute>} />
                    <Route path="/designer/:slug" element={<ProtectedRoute><DesignerProfilePage /></ProtectedRoute>} />
                    <Route path="/occasions" element={<ProtectedRoute><Occasions /></ProtectedRoute>} />
                    <Route path="/occasions/:occasionId" element={<ProtectedRoute><OccasionDetail /></ProtectedRoute>} />
                    <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                    <Route path="/category/:slug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
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
