import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Phone } from "lucide-react";

interface MobileOTPFormProps {
  onSuccess: () => void;
}

export const MobileOTPForm = ({ onSuccess }: MobileOTPFormProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const { sendOTP, signInWithOTP } = useAuth();
  const { toast } = useToast();

  const validatePhone = (phone: string): boolean => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(phone);
      
      if (result.success) {
        setStep('otp');
        if (result.demoOtp) {
          setDemoOtp(result.demoOtp);
        }
        toast({
          title: "OTP Sent",
          description: "Please enter the OTP sent to your phone",
        });
      } else {
        toast({
          title: "Failed to send OTP",
          description: result.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithOTP(phone, otp, isNewUser ? name : undefined);
      
      if (result.success) {
        toast({
          title: "Welcome!",
          description: result.isNewUser ? "Your account has been created" : "You're now logged in",
        });
        onSuccess();
      } else if (result.needsName) {
        setIsNewUser(true);
        setStep('name');
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Invalid OTP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitName = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    await handleVerifyOTP();
  };

  if (step === 'name') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-semibold text-lg">Almost there!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your name to complete signup
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            autoFocus
          />
        </div>

        <Button
          onClick={handleSubmitName}
          disabled={isLoading || !name.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Complete Signup"
          )}
        </Button>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setStep('phone');
            setOtp("");
            setDemoOtp(null);
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Change number
        </button>

        <div className="text-center">
          <h3 className="font-semibold text-lg">Enter OTP</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We've sent a 6-digit code to +91 {phone}
          </p>
        </div>

        {demoOtp && (
          <div className="bg-muted/50 border border-dashed border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Demo OTP:</p>
            <p className="text-lg font-mono font-bold tracking-widest">{demoOtp}</p>
          </div>
        )}

        <div className="flex justify-center">
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
          >
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

        <Button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        <button
          onClick={handleSendOTP}
          disabled={isLoading}
          className="w-full text-sm text-primary hover:underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    );
  }

  // Phone input step
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Login with Mobile</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We'll send you a one-time password
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-3 bg-muted rounded-md border border-input text-sm">
            +91
          </div>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter 10-digit number"
            className="flex-1"
            maxLength={10}
          />
        </div>
      </div>

      <Button
        onClick={handleSendOTP}
        disabled={isLoading || phone.length !== 10}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </Button>
    </div>
  );
};
