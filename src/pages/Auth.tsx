import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp, verifyOtp, signInWithGoogle, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [activeTab, setActiveTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'signup' && !name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to create an account.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await sendOtp(phone);
    setIsLoading(false);

    if (result.success) {
      setOtpSent(true);
      setCountdown(60);
      setDemoOtp(result.demoOtp || null);
      toast({
        title: "OTP Sent",
        description: `A 6-digit code has been sent to +91 ${phone}`,
      });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } else {
      toast({
        title: "Failed to Send OTP",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(phone, otpString, activeTab === 'signup' ? name : undefined);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: activeTab === 'signup' ? "Account Created" : "Login Successful",
        description: "Welcome to Ogura!",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Verification Failed",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    
    if (!result.success) {
      setIsGoogleLoading(false);
      toast({
        title: "Google Sign-In Failed",
        description: result.error,
        variant: "destructive"
      });
    }
    // If successful, the page will redirect to Google OAuth
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setDemoOtp(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Ogura</CardTitle>
            <CardDescription>
              {otpSent 
                ? `Enter the OTP sent to +91 ${phone}`
                : 'Sign in with your mobile number'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Google Sign-In Button */}
            <div className="space-y-4 mb-6">
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with phone
                  </span>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-20"
                        maxLength={10}
                      />
                    </div>
                    <Button 
                      onClick={handleSendOtp} 
                      disabled={isLoading || phone.length !== 10}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <OtpVerificationForm
                    otp={otp}
                    otpRefs={otpRefs}
                    demoOtp={demoOtp}
                    countdown={countdown}
                    isLoading={isLoading}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onOtpPaste={handleOtpPaste}
                    onVerify={handleVerifyOtp}
                    onResend={handleSendOtp}
                    onBack={resetForm}
                  />
                )}
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {!otpSent ? (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                    />
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-20"
                        maxLength={10}
                      />
                    </div>
                    <Button 
                      onClick={handleSendOtp} 
                      disabled={isLoading || phone.length !== 10 || !name.trim()}
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <OtpVerificationForm
                    otp={otp}
                    otpRefs={otpRefs}
                    demoOtp={demoOtp}
                    countdown={countdown}
                    isLoading={isLoading}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onOtpPaste={handleOtpPaste}
                    onVerify={handleVerifyOtp}
                    onResend={handleSendOtp}
                    onBack={resetForm}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

interface OtpVerificationFormProps {
  otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  demoOtp: string | null;
  countdown: number;
  isLoading: boolean;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  otp,
  otpRefs,
  demoOtp,
  countdown,
  isLoading,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onVerify,
  onResend,
  onBack
}) => {
  return (
    <div className="space-y-4">
      {demoOtp && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">Demo OTP (remove in production)</p>
          <p className="text-lg font-mono font-bold text-primary tracking-widest">{demoOtp}</p>
        </div>
      )}

      <div className="flex justify-center gap-2" onPaste={onOtpPaste}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => onOtpChange(index, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold"
            maxLength={1}
          />
        ))}
      </div>

      <Button 
        onClick={onVerify} 
        disabled={isLoading || otp.join('').length !== 6}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ShieldCheck className="h-4 w-4 mr-2" />
        )}
        Verify OTP
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button 
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Change number
        </button>
        
        {countdown > 0 ? (
          <span className="text-muted-foreground">
            Resend in {countdown}s
          </span>
        ) : (
          <button 
            onClick={onResend}
            className="text-primary hover:underline font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
