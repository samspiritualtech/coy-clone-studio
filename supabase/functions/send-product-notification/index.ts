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

// Constant-time string comparison to avoid timing attacks on the shared secret.
function safeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
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
        data: { path, type: 'new_product' },
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
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    // --- Shared-secret auth (server-to-server from OGURA Seller Center) ---
    const expectedSecret = Deno.env.get('OGURA_PUSH_SHARED_SECRET');
    if (!expectedSecret) {
      console.error('OGURA_PUSH_SHARED_SECRET is not configured');
      return json({ error: 'Push bridge is not configured on the server' }, 500);
    }
    const providedSecret = req.headers.get('x-ogura-push-secret') ?? '';
    if (!providedSecret || !safeEqual(providedSecret, expectedSecret)) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const FIREBASE_MESSAGING_API_KEY = Deno.env.get('FIREBASE_MESSAGING_API_KEY');
    if (!LOVABLE_API_KEY || !FIREBASE_MESSAGING_API_KEY) {
      return json({ error: 'Push notifications are not configured on the server' }, 500);
    }

    // --- Input validation ---
    const payload = await req.json().catch(() => null);
    const productId = typeof payload?.product_id === 'string' ? payload.product_id.trim() : '';
    if (!productId || productId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(productId)) {
      return json({ error: { product_id: ['A valid product id is required'] } }, 400);
    }

    const title = 'New Product Added 🛍️';
    const body = 'Check out the latest addition to OGURA.';
    const path = `/product/${productId}`;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );

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
      collection_id: null,
      sent_count: sentCount,
      failure_count: failureCount,
      created_by: null,
    });
    if (logError) console.error('Failed to log notification:', logError.message);

    const firstError = results.find((r) => !r.ok && !r.invalid);

    return json({
      sent_count: sentCount,
      failure_count: failureCount,
      total_devices: tokens.length,
      deactivated_tokens: invalidTokens.length,
      ...(firstError
        ? { first_error: { status: firstError.status, details: firstError.error?.slice(0, 500) } }
        : {}),
    });
  } catch (err) {
    console.error('send-product-notification error:', err);
    return json({ error: 'Unexpected error', details: String(err) }, 500);
  }
});
