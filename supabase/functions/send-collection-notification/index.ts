import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/firebase_messaging';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

interface SendResult {
  token: string;
  ok: boolean;
  invalid: boolean;
  status: number;
  error?: string;
}

async function sendToToken(
  token: string,
  title: string,
  body: string,
  path: string,
  headers: Record<string, string>,
): Promise<SendResult> {
  const res = await fetch(`${GATEWAY_URL}/v1/projects/_/messages:send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        data: { path, type: 'new_collection' },
        android: {
          priority: 'HIGH',
          notification: {
            channel_id: 'ogura_collections',
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
      },
    }),
  });

  if (res.ok) return { token, ok: true, invalid: false, status: res.status };

  const errorBody = await res.text();
  const invalid =
    res.status === 404 ||
    (res.status === 400 && /INVALID_ARGUMENT|registration-token|not a valid FCM/i.test(errorBody)) ||
    /UNREGISTERED/i.test(errorBody);
  console.error(`FCM send failed [${res.status}] for token ...${token.slice(-8)}: ${errorBody}`);
  return { token, ok: false, invalid, status: res.status, error: errorBody };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const FIREBASE_MESSAGING_API_KEY = Deno.env.get('FIREBASE_MESSAGING_API_KEY');
    if (!LOVABLE_API_KEY || !FIREBASE_MESSAGING_API_KEY) {
      return json({ error: 'Push notifications are not configured on the server' }, 500);
    }

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

    const { data: isAdmin, error: roleError } = await admin.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });
    if (roleError || !isAdmin) return json({ error: 'Admin access required' }, 403);

    const payload = await req.json().catch(() => null);
    const collectionId = typeof payload?.collection_id === 'string' ? payload.collection_id : '';
    if (!/^[0-9a-f-]{36}$/i.test(collectionId)) {
      return json({ error: { collection_id: ['A valid collection id is required'] } }, 400);
    }

    const { data: collection, error: collectionError } = await admin
      .from('collections')
      .select('id, title, slug, status')
      .eq('id', collectionId)
      .maybeSingle();

    if (collectionError) {
      console.error('Collection lookup failed:', collectionError.message);
      return json({ error: 'Could not load the collection' }, 500);
    }
    if (!collection) return json({ error: 'Collection not found' }, 404);

    const title =
      typeof payload?.title === 'string' && payload.title.trim()
        ? payload.title.trim().slice(0, 120)
        : 'New Collection is Live ✨';
    const body =
      typeof payload?.body === 'string' && payload.body.trim()
        ? payload.body.trim().slice(0, 240)
        : "Discover OGURA's latest collection now.";
    const path = `/collection/${collection.slug}`;

    const { data: tokenRows, error: tokenError } = await admin
      .from('device_tokens')
      .select('token')
      .eq('is_active', true);

    if (tokenError) {
      console.error('Token lookup failed:', tokenError.message);
      return json({ error: 'Could not load device tokens' }, 500);
    }

    const tokens = (tokenRows ?? []).map((r) => r.token as string);
    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': FIREBASE_MESSAGING_API_KEY,
      'Content-Type': 'application/json',
    };

    const results: SendResult[] = [];
    const BATCH = 25;
    for (let i = 0; i < tokens.length; i += BATCH) {
      const batch = tokens.slice(i, i + BATCH);
      const settled = await Promise.all(
        batch.map((t) =>
          sendToToken(t, title, body, path, headers).catch((e) => ({
            token: t,
            ok: false,
            invalid: false,
            status: 0,
            error: String(e),
          })),
        ),
      );
      results.push(...settled);
    }

    const sentCount = results.filter((r) => r.ok).length;
    const failureCount = results.length - sentCount;
    const invalidTokens = results.filter((r) => r.invalid).map((r) => r.token);

    if (invalidTokens.length > 0) {
      await admin.from('device_tokens').update({ is_active: false }).in('token', invalidTokens);
    }

    const { error: logError } = await admin.from('notifications').insert({
      title,
      body,
      deep_link_path: path,
      collection_id: collection.id,
      sent_count: sentCount,
      failure_count: failureCount,
      created_by: userId,
    });
    if (logError) console.error('Failed to log notification:', logError.message);

    const firstError = results.find((r) => !r.ok && !r.invalid);

    return json({
      success: true,
      total_devices: tokens.length,
      sent_count: sentCount,
      failure_count: failureCount,
      deactivated_tokens: invalidTokens.length,
      deep_link_path: path,
      ...(firstError
        ? { first_error: { status: firstError.status, details: firstError.error?.slice(0, 500) } }
        : {}),
    });
  } catch (err) {
    console.error('send-collection-notification error:', err);
    return json({ error: 'Unexpected error', details: String(err) }, 500);
  }
});
