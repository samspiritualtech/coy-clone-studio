# Customer-Side Product Push Bridge: `send-product-notification`

## Current state (verified)

- `send-collection-notification` already sends native Android pushes via the Firebase connector gateway (`FIREBASE_MESSAGING_API_KEY` + `LOVABLE_API_KEY` secrets exist) — it stays untouched.
- `device_tokens` (active FCM tokens per user) and `notifications` (send log, `collection_id` is nullable FK) tables exist.
- `usePushNotifications.ts` handles tap deep-links by reading `data.path` and navigating in-app, so `/product/<id>` already routes correctly (ID-centric product routing exists).
- `OGURA_PUSH_SHARED_SECRET` does not exist yet — it must be added as a server secret.

## What gets built

### 1. New edge function `supabase/functions/send-product-notification/index.ts`

- `OPTIONS` handled with CORS headers (same pattern as existing functions).
- **Auth:** constant-time comparison of the `x-ogura-push-secret` header against `Deno.env.get('OGURA_PUSH_SHARED_SECRET')`; reject `401` if missing/mismatch. No JWT, no client access — server-to-server only.
- **Input validation:** body `{ product_id: string, product_title?: string }` — product id validated (non-empty, max 100 chars, slug/UUID-safe characters).
- **Delivery:** load `token` from `device_tokens` where `is_active = true`; send one FCM message per token through `https://connector-gateway.lovable.dev/firebase_messaging/v1/projects/_/messages:send` with:
  - notification: title `New Product Added 🛍️`, body `Check out the latest addition to OGURA.`
  - data: `{ path: "/product/<product-id>", type: "new_product" }`
  - android: `priority: HIGH`, channel `ogura_collections` (matches the channel the Capacitor app creates)
- **Token hygiene:** 404 / `UNREGISTERED` / invalid-argument responses mark tokens `is_active = false`.
- **Logging:** insert into `notifications` (`title`, `body`, `deep_link_path: /product/<id>`, `collection_id: null`, sent/failure counts, `created_by: null`).
- **Response:** `{ sent_count, failure_count, total_devices, deactivated_tokens }` exactly as specified; provider errors surfaced with status + body for debugging.

### 2. Secret

- Request `OGURA_PUSH_SHARED_SECRET` via the secrets tool (a generated random value) — server-only, never in client code.

### 3. Test & verify

- Call the function with a wrong/absent secret → expect 401.
- Call with the correct secret and a test `product_id` → expect the `{sent_count, ...}` JSON (0 devices is a valid pass if no tokens registered yet), and a row in `notifications`.
- Confirm the tap handler path: `data.path = /product/<id>` matches the existing `usePushNotifications` deep-link navigation, which routes via the app's router.

## Explicitly out of scope

- No changes to `send-collection-notification`, database tables, or frontend files.
- No Firebase credentials anywhere except the existing connector-managed gateway keys.

## Technical notes

- Sending pattern, batching (25 concurrent), and invalid-token detection mirror the existing collection function for consistency.
- If the Seller Center needs the shared secret value, it is shown once to the user via the secrets tool — never written into code.
