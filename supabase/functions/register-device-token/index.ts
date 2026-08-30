import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace('Bearer ', '').trim();
    if (!jwt) return json({ error: 'Missing authorization header' }, 401);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );

    const { data: userData, error: userError } = await admin.auth.getUser(jwt);
    if (userError || !userData?.user) return json({ error: 'Invalid session' }, 401);
    const userId = userData.user.id;

    const payload = await req.json().catch(() => null);
    const token = typeof payload?.token === 'string' ? payload.token.trim() : '';
    const platformRaw = typeof payload?.platform === 'string' ? payload.platform : 'android';
    const platform = ['android', 'ios', 'web'].includes(platformRaw) ? platformRaw : 'android';
    const deviceInfo =
      payload?.device_info && typeof payload.device_info === 'object' ? payload.device_info : null;

    if (token.length < 20 || token.length > 4096) {
      return json({ error: { token: ['A valid device token is required'] } }, 400);
    }

    // Token strings are globally unique per device+app install. Re-registering the
    // same token (or a refreshed one) re-points it at the current user and reactivates it.
    const { error } = await admin
      .from('device_tokens')
      .upsert(
        {
          user_id: userId,
          token,
          platform,
          device_info: deviceInfo,
          is_active: true,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'token' },
      );

    if (error) {
      console.error('Failed to upsert device token:', error.message);
      return json({ error: 'Could not save device token' }, 500);
    }

    // Drop any stale token rows this device previously reported for the same user.
    const staleTokens: string[] = Array.isArray(payload?.previous_tokens)
      ? payload.previous_tokens.filter((t: unknown) => typeof t === 'string' && t !== token)
      : [];
    if (staleTokens.length > 0) {
      await admin
        .from('device_tokens')
        .update({ is_active: false })
        .eq('user_id', userId)
        .in('token', staleTokens);
    }

    return json({ success: true });
  } catch (err) {
    console.error('register-device-token error:', err);
    return json({ error: 'Unexpected error' }, 500);
  }
});
