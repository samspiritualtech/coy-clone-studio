import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { isAuthenticated, isLoading, isNewUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

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
    if (!isLoading && isAuthenticated) {
      if (isNewUser) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isNewUser, navigate, from]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/" className="mb-8">
            <h1 className="text-4xl font-light tracking-[0.3em] text-foreground">OGURA</h1>
          </Link>
          <h2 className="text-3xl lg:text-4xl font-light text-foreground leading-tight mb-6">
            India's Premier
            <br />
            <span className="text-primary">Fashion Marketplace</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Discover curated collections from India's finest designers. 
            Luxury fashion, artisanal craftsmanship, and timeless elegance—all in one place.
          </p>
          <div className="mt-12 flex items-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Designers</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">10K+</p>
              <p className="text-sm text-muted-foreground mt-1">Products</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-light text-foreground">50+</p>
              <p className="text-sm text-muted-foreground mt-1">Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex justify-center mb-8">
            <h1 className="text-3xl font-light tracking-[0.3em] text-foreground">OGURA</h1>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your account, wishlist, and orders
            </p>
          </div>

          <div className="space-y-6">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">
                  Secure Sign In
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="pt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
