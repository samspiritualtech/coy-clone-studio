import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSeller } from '@/contexts/SellerContext';
import { SellerLayout } from './SellerLayout';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface SellerProtectedRouteProps {
  children: ReactNode;
  requireApproved?: boolean;
}

export const SellerProtectedRoute = ({ 
  children, 
  requireApproved = true 
}: SellerProtectedRouteProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { seller, isSellerLoading, isApprovedSeller } = useSeller();
  const location = useLocation();

  // Show loading while checking auth/seller status
  if (authLoading || isSellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading seller portal...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // No seller profile → redirect to join page
  if (!seller) {
    return <Navigate to="/join" replace />;
  }

  // Application pending or rejected → show appropriate message
  if (requireApproved) {
    if (seller.application_status === 'pending') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Under Review</h1>
            <p className="text-muted-foreground mb-6">
              Your seller application for <strong>{seller.brand_name}</strong> is being reviewed. 
              We typically respond within 5 working days.
            </p>
            <a href="/" className="text-primary hover:underline">
              Return to Ogura
            </a>
          </div>
        </div>
      );
    }

    if (seller.application_status === 'rejected') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Not Approved</h1>
            <p className="text-muted-foreground mb-6">
              Unfortunately, your seller application was not approved at this time. 
              You may contact our support team for more information.
            </p>
            <a href="/" className="text-primary hover:underline">
              Return to Ogura
            </a>
          </div>
        </div>
      );
    }

    if (!isApprovedSeller) {
      return <Navigate to="/join" replace />;
    }
  }

  return <SellerLayout>{children}</SellerLayout>;
};
