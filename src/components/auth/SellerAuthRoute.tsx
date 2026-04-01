import { Navigate } from "react-router-dom";
import { useSellerAuth } from "@/contexts/SellerAuthContext";
import { Loader2 } from "lucide-react";

export const SellerAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSellerAuthenticated, isSellerLoading } = useSellerAuth();

  if (isSellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSellerAuthenticated) {
    return <Navigate to="/join" replace />;
  }

  return <>{children}</>;
};
