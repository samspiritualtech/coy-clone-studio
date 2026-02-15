import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Loader2, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SellerLogin = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    if (error) {
      toast.error(errorDescription || 'Sign-in failed. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !roleLoading && isAuthenticated) {
      if (hasRole('seller') || hasRole('admin')) {
        navigate("/seller/dashboard", { replace: true });
      } else {
        // Authenticated but not a seller — could be new applicant
        navigate("/seller/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, roleLoading, hasRole, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/seller" className="mb-8 flex items-center gap-2">
            <h1 className="text-4xl font-light tracking-[0.3em] text-foreground">OGURA</h1>
            <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              Partners
            </span>
          </Link>
          <h2 className="text-3xl lg:text-4xl font-light text-foreground leading-tight mb-6">
            Your Fashion Business
            <br />
            <span className="text-primary">Starts Here</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Manage your products, track orders, and grow your brand — all from one powerful dashboard.
          </p>
          <div className="mt-12 flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">48h</p>
              <p className="text-sm text-muted-foreground mt-1">Go Live</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">0%</p>
              <p className="text-sm text-muted-foreground mt-1">Upfront Cost</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">Weekly</p>
              <p className="text-sm text-muted-foreground mt-1">Payouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/seller" className="lg:hidden flex justify-center mb-8 items-center gap-2">
            <h1 className="text-3xl font-light tracking-[0.3em] text-foreground">OGURA</h1>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Partners
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-2">Seller Portal</h2>
            <p className="text-muted-foreground">
              Sign in to manage your store and products
            </p>
          </div>

          <div className="space-y-6">
            <GoogleSignInButton />

            <div className="text-center text-sm text-muted-foreground">
              <p>New to Ogura? Sign in to apply as a seller partner.</p>
            </div>

            <div className="pt-4 text-center">
              <Link
                to="/seller"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Seller Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
