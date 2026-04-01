import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const JoinUs = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/seller/dashboard", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const openAuth = () => {
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setAuthOpen(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      setOtpSent(true);
      toast.success("OTP sent! Check your email.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) { toast.error("Please enter the 6-digit code"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed in!");
      setAuthOpen(false);
      navigate("/seller/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-muted/30 to-background" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            Limited Onboarding • Quality First
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Join Ogura as an Independent Fashion Designer or Fashion Studio Owner
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Ogura is a marketplace for custom fashion where designers can manage their store and sell custom outfits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/join/apply">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold group hover:scale-105 transition-transform duration-300">
                Apply to Join Ogura
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg" onClick={openAuth}>
              Login / Signup
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4 animate-fade-in">
            We review each application individually. Not all applications are accepted.
          </p>
        </div>
      </section>

      {/* Auth Modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to Ogura</DialogTitle>
          </DialogHeader>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <Input id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send OTP
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div>
              </div>
              <GoogleSignInButton />
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
              <div className="space-y-2">
                <Label htmlFor="auth-otp">Enter OTP</Label>
                <Input id="auth-otp" type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="123456" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verify OTP
              </Button>
              <button type="button" className="text-sm text-primary underline w-full text-center" onClick={() => { setOtpSent(false); setOtp(""); }}>
                Change email
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinUs;
