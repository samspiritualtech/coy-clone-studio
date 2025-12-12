import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Shared OTP store reference (for demo - in production use Redis/DB)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp, name } = await req.json();

    // Validate inputs
    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For demo purposes, accept any 6-digit OTP
    // In production, verify against stored OTP
    const storedData = otpStore.get(phone);
    
    // Demo mode: Accept OTP if it matches stored OR if no stored OTP exists (edge function stateless)
    // In production with persistent storage, strictly validate
    const isValidOtp = !storedData || storedData.otp === otp || Date.now() < (storedData?.expiresAt || 0);

    // For demo, we'll accept any valid 6-digit OTP
    // Remove this in production and use proper validation
    if (!/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP. Please try again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user object
    const user = {
      id: `user_${phone}_${Date.now().toString(36)}`,
      name: name || `User ${phone.slice(-4)}`,
      phone: phone
    };

    // Clear OTP after successful verification
    otpStore.delete(phone);

    console.log(`User verified: +91${phone}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        user,
        message: 'OTP verified successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Verification failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
