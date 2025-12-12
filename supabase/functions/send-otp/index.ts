import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory OTP storage (for demo purposes)
// In production, use Redis or database with TTL
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    // Validate phone number (Indian format: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid mobile number. Please enter a valid 10-digit Indian mobile number.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(phone, { otp, expiresAt });

    // Log OTP for development (in production, send via SMS provider)
    console.log(`OTP for +91${phone}: ${otp}`);

    // In production, integrate with SMS provider here:
    // await sendSMS(phone, `Your Ogura OTP is: ${otp}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // For demo only - remove in production
        demoOtp: otp 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send OTP. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
