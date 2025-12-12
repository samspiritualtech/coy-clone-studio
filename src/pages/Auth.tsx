import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Spline3DBackground } from "@/components/Spline3DBackground";
import { ArrowLeft, Phone } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { user, sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  
  // Signup state
  const [signupStep, setSignupStep] = useState<"phone" | "otp">("phone");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  
  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async (phone: string, isSignup: boolean) => {
    if (!validatePhone(phone)) {
      toast({ 
        title: "Invalid mobile number", 
        description: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9",
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    const result = await sendOtp(phone);

    if (result.success) {
      toast({ 
        title: "OTP Sent", 
        description: `OTP sent to +91 ${phone}`
      });
      if (isSignup) {
        setSignupStep("otp");
      } else {
        setLoginStep("otp");
      }
      setResendTimer(30);
    } else {
      toast({ title: "Failed to send OTP", description: result.error, variant: "destructive" });
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async (otp: string, name?: string) => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a 6-digit OTP", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(otp, name);

    if (result.success) {
      toast({ title: name ? "Account created!" : "Welcome back!", description: "You've successfully logged in" });
      navigate('/');
    } else {
      toast({ title: "Verification failed", description: result.error, variant: "destructive" });
    }

    setIsLoading(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStep === "phone") {
      handleSendOtp(loginPhone, false);
    } else {
      handleVerifyOtp(loginOtp);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === "phone") {
      if (!signupName.trim()) {
        toast({ title: "Name required", description: "Please enter your name", variant: "destructive" });
        return;
      }
      handleSendOtp(signupPhone, true);
    } else {
      handleVerifyOtp(signupOtp, signupName);
    }
  };

  const resetLoginFlow = () => {
    setLoginStep("phone");
    setLoginOtp("");
  };

  const resetSignupFlow = () => {
    setSignupStep("phone");
    setSignupOtp("");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Spline3DBackground />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center relative z-10">
        <Card className="w-full max-w-md backdrop-blur-md bg-card/80 shadow-2xl border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Ogura</CardTitle>
            <CardDescription>Sign in with your mobile number</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={resetLoginFlow}>Login</TabsTrigger>
                <TabsTrigger value="signup" onClick={resetSignupFlow}>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {loginStep === "phone" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-phone">Mobile Number</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 bg-muted rounded-md border border-input">
                            <span className="text-sm text-muted-foreground font-medium">+91</span>
                          </div>
                          <Input
                            id="login-phone"
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                            className="flex-1"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || loginPhone.length !== 10}>
                        <Phone className="w-4 h-4 mr-2" />
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Enter OTP</Label>
                          <span className="text-xs text-muted-foreground">Sent to +91 {loginPhone}</span>
                        </div>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={loginOtp} onChange={setLoginOtp}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <p className="text-sm text-muted-foreground">Resend OTP in {resendTimer}s</p>
                          ) : (
                            <Button 
                              type="button" 
                              variant="link" 
                              className="text-sm p-0 h-auto"
                              onClick={() => handleSendOtp(loginPhone, false)}
                              disabled={isLoading}
                            >
                              Resend OTP
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || loginOtp.length !== 6}>
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full" 
                        onClick={resetLoginFlow}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Change Number
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  {signupStep === "phone" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Mobile Number</Label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-3 bg-muted rounded-md border border-input">
                            <span className="text-sm text-muted-foreground font-medium">+91</span>
                          </div>
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                            className="flex-1"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Enter 10-digit mobile number</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || signupPhone.length !== 10 || !signupName.trim()}>
                        <Phone className="w-4 h-4 mr-2" />
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Enter OTP</Label>
                          <span className="text-xs text-muted-foreground">Sent to +91 {signupPhone}</span>
                        </div>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={signupOtp} onChange={setSignupOtp}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="text-center">
                          {resendTimer > 0 ? (
                            <p className="text-sm text-muted-foreground">Resend OTP in {resendTimer}s</p>
                          ) : (
                            <Button 
                              type="button" 
                              variant="link" 
                              className="text-sm p-0 h-auto"
                              onClick={() => handleSendOtp(signupPhone, true)}
                              disabled={isLoading}
                            >
                              Resend OTP
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || signupOtp.length !== 6}>
                        {isLoading ? "Creating Account..." : "Verify & Create Account"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full" 
                        onClick={resetSignupFlow}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Change Number
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
