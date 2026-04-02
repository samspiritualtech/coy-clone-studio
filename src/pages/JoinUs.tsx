import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store, ArrowDown, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JourneyTimeline } from "@/components/join-us/JourneyTimeline";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { ImageUploadZone } from "@/components/ImageUploadZone";

type Step = "hero" | "auth" | "apply" | "success";

const categories = [
  "Bridal Wear", "Casual Wear", "Ethnic Wear", "Fusion Wear",
  "Luxury / Couture", "Menswear", "Kidswear", "Accessories", "Other"
];

const JoinUs = () => {
  const { isAuthenticated, isLoading, signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("hero");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Application form state
  const [form, setForm] = useState({
    full_name: "",
    brand_name: "",
    email: "",
    phone: "",
    city: "",
    category: "",
    portfolio_link: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const authRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  // When user becomes authenticated while on auth step, move to apply
  useEffect(() => {
    if (!isLoading && isAuthenticated && step === "auth") {
      setStep("apply");
      setTimeout(() => applyRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [isAuthenticated, isLoading, step]);

  // Pre-fill email from auth
  useEffect(() => {
    if (isAuthenticated && user?.email && !form.email) {
      setForm(f => ({ ...f, email: user.email, full_name: user.name || "" }));
    }
  }, [isAuthenticated, user]);

  const handleApplyClick = () => {
    if (isAuthenticated) {
      setStep("apply");
      setTimeout(() => applyRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      setStep("auth");
      setTimeout(() => authRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    setSubmitting(true);
    const { success, error } = await signInWithEmail(email, password);
    setSubmitting(false);
    if (success) {
      toast.success("Logged in!");
    } else {
      toast.error(error || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setSubmitting(true);
    const { success, error } = await signUpWithEmail(email, password);
    setSubmitting(false);
    if (success) {
      toast.success("Account created!");
    } else {
      toast.error(error || "Signup failed");
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const path = `applications/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.brand_name || !form.email || !form.phone || !form.city || !form.category) {
      return toast.error("Please fill in all required fields");
    }
    setFormSubmitting(true);
    try {
      const sampleImages = imageFiles.length > 0 ? await uploadImages() : [];
      const { error } = await supabase.from("seller_applications" as any).insert({
        full_name: form.full_name,
        brand_name: form.brand_name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        category: form.category,
        portfolio_link: form.portfolio_link || null,
        sample_images: sampleImages.length > 0 ? sampleImages : null,
        status: "pending",
      });
      if (error) throw error;
      setStep("success");
      toast.success("Application submitted!");
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setFormSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LuxuryHeader />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary))_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            For Independent Fashion Designers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Join Ogura as an Independent Fashion Designer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Showcase your craft. Connect with customers who value handmade, made-to-order fashion.
            Build your brand on a platform designed for creators like you.
          </p>
          <Button
            size="lg"
            className="mt-4 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleApplyClick}
          >
            <Store className="w-5 h-5 mr-2" />
            Apply to Join Ogura
          </Button>
          {step === "hero" && (
            <div className="pt-8 animate-bounce text-muted-foreground/50">
              <ArrowDown className="w-6 h-6 mx-auto" />
            </div>
          )}
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <JourneyTimeline />

      {/* AUTH SECTION */}
      {step === "auth" && !isAuthenticated && (
        <section ref={authRef} className="py-16 px-4 bg-muted/30">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-0">
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to continue</h2>
                  <p className="text-sm text-muted-foreground">Log in or create an account to submit your application</p>
                </div>

                <GoogleSignInButton />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Log In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Log In
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* APPLICATION FORM SECTION */}
      {step === "apply" && isAuthenticated && (
        <section ref={applyRef} className="py-16 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardContent className="pt-8 pb-8 px-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Seller Application</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your brand and craft</p>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand Name *</Label>
                      <Input value={form.brand_name} onChange={e => setForm(f => ({ ...f, brand_name: e.target.value }))} placeholder="Your brand" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Mumbai" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Portfolio / Instagram Link</Label>
                    <Input value={form.portfolio_link} onChange={e => setForm(f => ({ ...f, portfolio_link: e.target.value }))} placeholder="https://instagram.com/yourbrand" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sample Work Images</Label>
                    <ImageUploadZone onFilesSelected={setImageFiles} maxFiles={5} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={formSubmitting}>
                    {formSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* SUCCESS */}
      {step === "success" && (
        <section className="py-20 px-4 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-muted-foreground">We'll review your application and get back to you soon.</p>
            <Button size="lg" onClick={() => { window.location.href = "/seller/dashboard"; }}>
              Go to Dashboard
            </Button>
          </div>
        </section>
      )}

      <div className="mt-auto">
        <LuxuryFooter />
      </div>
    </div>
  );
};

export default JoinUs;
