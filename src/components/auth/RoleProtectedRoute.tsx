import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { Loader2, ShieldAlert } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: AppRole;
  loginPath?: string;
  unauthorizedRedirect?: string;
}

export const RoleProtectedRoute = ({
  children,
  requiredRole,
  loginPath = "/login",
  unauthorizedRedirect = "/",
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  if (!hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          <div className="p-4 rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this area.
          </p>
          <a
            href={unauthorizedRedirect}
            className="text-sm text-primary hover:underline mt-2"
          >
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
