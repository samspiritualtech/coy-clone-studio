import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
      navigate('/');
    } else {
      toast({
        title: "Verification Failed",
        description: result.error,
        variant: "destructive"
      });
    }
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
