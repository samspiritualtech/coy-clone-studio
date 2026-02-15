import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      toast.error('Sign-in failed. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !roleLoading && isAuthenticated) {
      if (hasRole('admin')) {
        navigate("/admin/dashboard", { replace: true });
      }
      // Non-admins stay on this page and see the access denied state
    }
  }, [isAuthenticated, authLoading, roleLoading, hasRole, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Authenticated but not admin
  if (isAuthenticated && !hasRole('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            This area is restricted to authorized administrators only.
          </p>
          <a href="/" className="text-sm text-primary hover:underline">
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold tracking-tight">OGURA</span>
            <span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Internal administration portal
          </p>
        </div>

        <div className="space-y-6">
          <GoogleSignInButton />
          <p className="text-center text-xs text-muted-foreground">
            Authorized personnel only. Access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
