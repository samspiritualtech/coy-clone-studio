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

    // Get the latest OTP for this phone (including recently verified ones for retry scenarios)
    const { data: otpRecords } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1);

    const otpRecord = otpRecords?.[0];

    if (!otpRecord) {
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

    // Check attempts (max 5 to allow retries after backend failures)
    if (!otpRecord.verified && otpRecord.attempts >= 5) {
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
      // Increment attempts only if not already verified (to allow retries)
      if (!otpRecord.verified) {
        await supabase
          .from('otp_verifications')
          .update({ attempts: otpRecord.attempts + 1 })
          .eq('id', otpRecord.id);
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid OTP. Please try again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Don't mark as verified yet - wait until user creation/login succeeds

    // Create or sign in user with phone-based email
    const phoneEmail = `${phone}@ogura.phone.auth`;
    
    // Check if user already exists by looking up by email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === phoneEmail);

    if (existingUser) {
      // User exists - generate a magic link token for them
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: phoneEmail,
      });

      if (sessionError || !sessionData) {
        console.error('Error generating session:', sessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to sign in. Please try again.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update profile if name provided
      if (name) {
        await supabase
          .from('profiles')
          .update({ name, phone })
          .eq('id', existingUser.id);
      }

      console.log(`User signed in: +91${phone}`);

      // Use the token to create a session
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: sessionData.properties?.hashed_token,
        type: 'magiclink',
      });

      if (verifyError || !verifyData.session) {
        // Fallback: return user info without session, client can handle
        // Mark OTP as verified since user exists
        await supabase
          .from('otp_verifications')
          .update({ verified: true })
          .eq('id', otpRecord.id);

        return new Response(
          JSON.stringify({ 
            success: true,
            session: null,
            user: {
              id: existingUser.id,
              name: name || existingUser.user_metadata?.name || `User ${phone.slice(-4)}`,
              phone
            },
            needsRefresh: true,
            message: 'Login successful'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark OTP as verified on successful login
      await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({ 
          success: true,
          session: verifyData.session,
          user: {
            id: existingUser.id,
            name: name || existingUser.user_metadata?.name || `User ${phone.slice(-4)}`,
            phone
          },
          message: 'Login successful'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // New user - create account with a consistent password
    const phonePassword = `ogura_secure_${phone}_auth`;
    
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

    // Mark OTP as verified on successful signup
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

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
