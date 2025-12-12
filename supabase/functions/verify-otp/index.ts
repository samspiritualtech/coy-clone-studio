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
    const { phone, otp, name } = await req.json();

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the latest unverified OTP for this phone
    const { data: otpRecord, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'No OTP found. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OTP expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from('otp_verifications').delete().eq('id', otpRecord.id);
      return new Response(
        JSON.stringify({ success: false, error: 'OTP has expired. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
      await supabase.from('otp_verifications').delete().eq('id', otpRecord.id);
      return new Response(
        JSON.stringify({ success: false, error: 'Too many attempts. Please request a new OTP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify OTP hash
    const encoder = new TextEncoder();
    const data = encoder.encode(otp + phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const otpHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (otpHash !== otpRecord.otp_hash) {
      // Increment attempts
      await supabase
        .from('otp_verifications')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP. Please try again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    // Create or sign in user with phone-based email
    const phoneEmail = `${phone}@ogura.phone.auth`;
    const phonePassword = `ogura_${phone}_${otpRecord.otp_hash.slice(0, 16)}`;

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: phoneEmail,
      password: phonePassword
    });

    if (signInData?.session) {
      // Existing user - update profile if name provided
      if (name) {
        await supabase
          .from('profiles')
          .update({ name, phone })
          .eq('id', signInData.user.id);
      }

      console.log(`User signed in: +91${phone}`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          session: signInData.session,
          user: {
            id: signInData.user.id,
            name: name || `User ${phone.slice(-4)}`,
            phone
          },
          message: 'Login successful'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // New user - create account
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: phoneEmail,
      password: phonePassword,
      email_confirm: true,
      user_metadata: { name: name || `User ${phone.slice(-4)}`, phone }
    });

    if (signUpError) {
      console.error('Error creating user:', signUpError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create account. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update profile with phone
    await supabase
      .from('profiles')
      .upsert({ 
        id: signUpData.user.id, 
        name: name || `User ${phone.slice(-4)}`,
        phone 
      });

    // Sign in the new user to get session
    const { data: newSession } = await supabase.auth.signInWithPassword({
      email: phoneEmail,
      password: phonePassword
    });

    console.log(`New user created: +91${phone}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        session: newSession?.session,
        user: {
          id: signUpData.user.id,
          name: name || `User ${phone.slice(-4)}`,
          phone
        },
        message: 'Account created successfully'
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
