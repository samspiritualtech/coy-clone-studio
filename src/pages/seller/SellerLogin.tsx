import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSellerAuth } from "@/contexts/SellerAuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";

const SellerLogin = () => {
  const { isSellerAuthenticated, isSellerLoading, sellerSignInWithEmail } = useSellerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    if (error) {
      toast.error(errorDescription || "Sign-in failed. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!isSellerLoading && isSellerAuthenticated) {
      navigate("/seller/dashboard", { replace: true });
    }
  }, [isSellerAuthenticated, isSellerLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    setSubmitting(true);
    const { success, error } = await sellerSignInWithEmail(email, password);
    setSubmitting(false);

    if (success) {
      navigate("/seller/dashboard", { replace: true });
    } else {
      toast.error(error || "Login failed");
    }
  };

  if (isSellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h1 className="text-2xl font-light tracking-[0.3em] text-foreground">OGURA</h1>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Seller
              </span>
            </div>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Sign in to your seller dashboard</p>
          </div>

          {/* Google */}
          <GoogleSignInButton />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Log In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/seller-signup" className="text-primary hover:underline font-medium">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerLogin;
