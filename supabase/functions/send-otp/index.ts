import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting: Check if OTP was sent in last 60 seconds
    const { data: existingOtp } = await supabase
      .from('otp_verifications')
      .select('created_at')
      .eq('phone', phone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingOtp) {
      const createdAt = new Date(existingOtp.created_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;
      
      if (diffSeconds < 60) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting a new OTP.` 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP for secure storage (simple hash for demo - use bcrypt in production)
    const encoder = new TextEncoder();
    const data = encoder.encode(otp + phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const otpHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Delete old unverified OTPs for this phone
    await supabase
      .from('otp_verifications')
      .delete()
      .eq('phone', phone)
      .eq('verified', false);

    // Store new OTP with 5-minute expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    const { error: insertError } = await supabase
      .from('otp_verifications')
      .insert({
        phone,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempts: 0,
        verified: false
      });

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate OTP. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`OTP for +91${phone}: ${otp}`);

    // In production, integrate with SMS provider here:
    // await sendSMS(phone, `Your Ogura OTP is: ${otp}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        demoOtp: otp // Remove in production
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
