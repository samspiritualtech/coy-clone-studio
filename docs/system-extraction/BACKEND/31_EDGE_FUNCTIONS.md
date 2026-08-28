# 31 — Edge Functions Reference

General pattern shared by **all** functions [CONFIRMED]: Deno `serve()`/`Deno.serve()`, manual CORS (`Access-Control-Allow-Origin: '*'`, OPTIONS preflight returns 200 with empty body), no shared middleware, no structured logging beyond `console.log`/`console.error` (visible in Supabase function logs only), no rate limiting except `send-otp`'s ad-hoc 60s check, no request schema validation library (manual `if (!field)` checks only), no idempotency keys.

---
## ai-recommendations
- File: `supabase/functions/ai-recommendations/index.ts` (172 lines). verify_jwt=false.
- Purpose: AI-driven product recommendations (similar/brand/search/category) using Lovable AI Gateway (Gemini).
- Invocation: `src/services/recommendationService.ts:70,108,138,167` via `supabase.functions.invoke('ai-recommendations', {...})`.
- Methods: POST (+OPTIONS). Input: `{ type, productId?, productData?, brandName?, query?, category?, allProducts[] }` — **no schema validation**, destructured directly from `req.json()` [MISSING validation].
- Auth: none (verify_jwt=false, no internal check).
- Env: `LOVABLE_API_KEY=REDACTED` (type: AI gateway key; used_by: this fn + generate-banner-image + image-analysis; required; source: Lovable Cloud secret; risk: abuse/cost if function is spammed since no auth).
- External API: `https://ai.gateway.lovable.dev/v1/chat/completions` (model `google/gemini-2.5-flash`).
- DB: none directly — `allProducts` catalog is supplied by the caller (frontend), not queried server-side.
- Response: `{ productIds: string[] }` or `{ error, productIds: [] }`.
- Errors: 429 (rate-limited by gateway) passthrough; 500 generic. No retries; caller (`recommendationService.ts`) does not appear to retry.
- Failure modes: malformed AI JSON → regex-extracted, falls back to `[]`. Downstream: `useRecommendations` hook shows empty state.
- Security: [SECURITY-SENSITIVE — MEDIUM] unauthenticated, unlimited AI-gateway spend surface; client fully controls the `allProducts` payload sent into the prompt (prompt injection risk is low-impact since output is just IDs, but cost abuse is real).

## generate-banner-image
- File: `supabase/functions/generate-banner-image/index.ts` (87 lines). verify_jwt=false.
- Purpose: Generate marketing banner images via Gemini image-preview model.
- Invocation: not found among grepped `supabase.functions.invoke` call sites in `src/**` [UNKNOWN — likely admin/dev tool or unused from current UI; MISSING call site].
- Input: `{ prompt, type }`, no validation of length/content.
- Env: `LOVABLE_API_KEY=REDACTED`.
- External API: `ai.gateway.lovable.dev` chat completions, `modalities: ["image","text"]`.
- DB: none.
- Response: `{ image: base64/url, type }`; errors 429/402/500.
- Security: [SECURITY-SENSITIVE — MEDIUM] unauthenticated image-generation spend surface (same class as above); if truly unused by the frontend, it's dead attack surface that should be considered for removal — [INFERRED].

## image-analysis
- File: `supabase/functions/image-analysis/index.ts` (189 lines). verify_jwt=false.
- Purpose: "shop the look" — analyze an uploaded photo (Gemini vision) then match catalog products.
- Invocation: `src/services/recommendationService.ts:196`.
- Input: `{ imageBase64, allProducts[] }`, no size/type validation before sending to AI gateway [MISSING — large payload/cost risk].
- Env: `LOVABLE_API_KEY=REDACTED`.
- External API: two sequential calls to `ai.gateway.lovable.dev` (vision analysis, then text matching).
- DB: none (catalog passed by client).
- Response: `{ productIds[], attributes }` or error shape.
- Security: [SECURITY-SENSITIVE — MEDIUM] unauthenticated, accepts arbitrary base64 images, two AI calls per request — highest per-call cost of the AI functions, no auth/rate limit.

## pincode-lookup
- File: `supabase/functions/pincode-lookup/index.ts` (96 lines). verify_jwt=false.
- Purpose: resolve Indian PIN code → city/state via India Post public API.
- Invocation: `src/contexts/LocationContext.tsx:325`.
- Input validation: `/^\d{6}$/` regex on `pincode` [CONFIRMED — one of the few functions with real validation].
- Env: none.
- External API: `https://api.postalpincode.in/pincode/{pincode}` (unauthenticated public API, no key).
- DB: none.
- Response: `{ success, city, state, country, postOfficeName }` (200) or `{ success:false, error }` (400/404/500).
- Security: low risk — read-only public passthrough proxy; still unauthenticated but low value target (rate-limit/DoS risk on India Post only). [SECURITY-SENSITIVE — LOW]

## ip-geolocation
- File: `supabase/functions/ip-geolocation/index.ts` (86 lines). Not present in `config.toml` [verify_jwt effectively default — UNKNOWN, see 30.4].
- Purpose: derive user's city/state/country from request IP for default delivery location.
- Invocation: `src/contexts/LocationContext.tsx:76`.
- Logic: reads `x-forwarded-for`/`x-real-ip`; calls `http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city` (plaintext HTTP, no key). On lookup failure (private/local IP) hardcodes fallback `Delhi, Delhi, India, source: "fallback"`.
- DB: none. Env: none.
- Security: [SECURITY-SENSITIVE — LOW] outbound call over plain HTTP to a free unauthenticated geo API; IP address of every visitor is sent to a third party (ip-api.com) — privacy/data-sharing note.

## sync-algolia
- File: `supabase/functions/sync-algolia/index.ts` (749 lines). verify_jwt=false.
- Purpose: push the full product catalog (live DB products **plus** large hardcoded demo/mock catalogs baked into this file) into an Algolia search index.
- Invocation: no client call site found in `src/**` grep results [MISSING/UNKNOWN — likely triggered manually/by an external cron or the Lovable dashboard, not from the SPA].
- Env: `ALGOLIA_ADMIN_KEY=REDACTED` (Algolia admin write key — **high-privilege secret**, can rewrite the entire public search index), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY=REDACTED`. `ALGOLIA_APP_ID` (`"KEBAEMMQPI"`) and index name (`ogura-products`) are hardcoded, not secrets.
- DB: reads `products` (and related) with service-role client, bypassing RLS — reads **all** products regardless of `status`/`is_available` [INFERRED — needs confirmation of exact filter; not fully re-verified line-by-line due to file size].
- External API: Algolia REST (`saveObjects`/index management).
- Security: [SECURITY-SENSITIVE — HIGH] this function holds both the Algolia admin key and the Supabase service-role key and is reachable **unauthenticated**. Any caller can trigger a full re-index (cost/availability risk on Algolia) and, depending on exact code past line 749 not fully reviewed here, potentially leak non-live/draft product data into the public search index. Recommend confirming filter-by-status server side and adding auth.

## social-post-webhook
- File: `supabase/functions/social-post-webhook/index.ts` (143 lines). verify_jwt=false.
- Purpose: forward "share my design" events to a Make.com (Integromat) webhook for auto-posting to social channels.
- Invocation: `src/services/socialPostService.ts:82`.
- Input validation: requires `event`, `design.title`, `design.description` (400 if missing); no auth of caller identity, no validation that `design` data is truthful.
- Env: `MAKE_WEBHOOK_URL=REDACTED` (Make.com scenario webhook URL — treated as a secret since knowledge of it lets anyone trigger the scenario directly, but here the value itself isn't leaked to the client since the edge function proxies it).
- External API: POST to `MAKE_WEBHOOK_URL` with a flattened payload (title/description/image/url/event/timestamp/platform/priceRange/occasion/designer*/customizations*).
- Response: `{ success, message }` (200), `{ error }` (400/500), `{ success:false, error, status }` (502 on webhook failure).
- Security: [SECURITY-SENSITIVE — LOW/MEDIUM] unauthenticated relay that lets anyone post arbitrary content (title/description/image URL) into the brand's social-automation pipeline — spam/defacement risk on the Make.com scenario output, no rate limiting.

## razorpay-create-order
- File: `supabase/functions/razorpay-create-order/index.ts` (88 lines). verify_jwt=false.
- Purpose: create a Razorpay payment order for checkout.
- Invocation: `src/pages/Checkout.tsx:152`.
- Input: `{ amount, currency='INR', receipt?, notes? }`. Validation: `amount > 0` only [MISSING: no upper bound, no cross-check against actual cart contents server-side — the client fully controls `amount`].
- Env: `RAZORPAY_KEY_ID=REDACTED` (public-ish key id, also returned to client), `RAZORPAY_KEY_SECRET=REDACTED` (secret, used only server-side for Basic-auth to Razorpay).
- External API: `POST https://api.razorpay.com/v1/orders` (Basic auth).
- DB: none.
- Response: `{ success, order_id, amount, currency, key_id }` or `{ success:false, error }` (400/500).
- Security: [SECURITY-SENSITIVE — MEDIUM] amount is entirely client-supplied and not validated against server-known cart/pricing; an attacker could create arbitrary low/high value Razorpay orders under the merchant account (financial/abuse risk, though actual charge still requires the payer to complete checkout).

## razorpay-verify-payment
- File: `supabase/functions/razorpay-verify-payment/index.ts` (173 lines). verify_jwt=false.
- Purpose: verify Razorpay HMAC signature and, on success, insert the `orders` row using the service-role client.
- Invocation: `src/pages/Checkout.tsx:208`, inside the Razorpay `handler` callback (client-side, after payment popup completes).
- Input: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, order_data }`. `order_data` is **entirely client-constructed** (see Checkout.tsx:172-195): `customer_id`, `seller_id` (fallback to `customer_id` if absent — `index.ts:~100`), `subtotal`, `shipping_fee`, `discount`, `total`, `shipping_address`, `items[]`.
- Signature check: HMAC-SHA256 over `${orderId}|${paymentId}` using `RAZORPAY_KEY_SECRET`, constant computed and string-compared (`verifySignature`, lines 9-31) — **not constant-time comparison** [SECURITY-SENSITIVE — LOW: timing side channel, low practical exploitability over network].
- Env: `RAZORPAY_KEY_SECRET=REDACTED`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY=REDACTED`.
- DB writes: `orders` insert only (service role, bypasses RLS) with `order_number = 'OGR' + base36(Date.now())`, `status:'new'`, `tracking_id: razorpay_payment_id`. **No `order_items` insert happens in this function** — `order_data.items` is accepted in the payload but not written anywhere found in this file [MISSING — order line items are apparently never persisted server-side by this flow; see `33_BUSINESS_LOGIC.md`].
- Response: success case `{ success:true, payment_verified:true, order_saved:true/false, order_number, payment_id, ... }`; on `orderError` it still returns **HTTP 200 with `success:true, order_saved:false`** — i.e. payment success is reported to the client even when the DB write failed (`index.ts:~118-132`) — partial-state risk documented in `36_ERROR_HANDLING.md`.
- Security: [SECURITY-SENSITIVE — HIGH] `customer_id`, `total`, `subtotal`, pricing entirely trusted from client input with a service-role insert; nothing cross-checks `total` against the Razorpay-captured `amount`, nor `customer_id` against the authenticated caller (function is unauthenticated and never calls `supabase.auth.getUser()`). A user who can produce a valid Razorpay signature for *any* amount they actually paid could set `customer_id` to another user's UUID or fabricate `total`/`discount` values for the stored order record. Financial/data-integrity risk.

## pinterest-token-exchange
- File: `supabase/functions/pinterest-token-exchange/index.ts` (74 lines). verify_jwt=false.
- Purpose: OAuth "authorization_code" → access_token exchange for Pinterest integration (seller social connect).
- Invocation: `src/pages/PinterestCallback.tsx:26`.
- Input: `{ code, redirect_uri }`, validated for presence only.
- Env: `PINTEREST_CLIENT_ID=REDACTED`, `PINTEREST_CLIENT_SECRET=REDACTED`.
- External API: `POST https://api.pinterest.com/v5/oauth/token` (Basic auth with client id/secret).
- DB: none — access token is returned directly to the browser, not persisted server-side [MISSING: no storage of refresh/access token → each session must re-auth; also means token lives only in client memory/state].
- Response: `{ access_token }` or `{ error }`.
- Security: [SECURITY-SENSITIVE — MEDIUM] access token, once issued, is returned straight to the browser (acceptable per Pinterest's public-client model) but the function itself is unauthenticated, so anyone holding a valid Pinterest `code` (only obtainable via the real OAuth redirect) can complete exchange — low incremental risk given code is single-use and short-lived.

## send-otp
- File: `supabase/functions/send-otp/index.ts` (114 lines). verify_jwt: not in config.toml [UNKNOWN, likely false — must be publicly callable pre-auth].
- Purpose: issue a 6-digit OTP for Indian-mobile-number login.
- Invocation: not found via `supabase.functions.invoke('send-otp', ...)` grep in reviewed `code.txt` output; presumably called from a phone-login UI not captured in the grepped call-site list [MISSING call site confirmation — UNKNOWN].
- Input validation: `/^[6-9]\d{9}$/` (Indian mobile format) [CONFIRMED].
- Rate limit: rejects with 429 if last unverified OTP for that phone was created <60s ago (`index.ts:33-52`).
- OTP generation: `Math.floor(100000 + Math.random()*900000)` — **`Math.random()` is not cryptographically secure** [SECURITY-SENSITIVE — MEDIUM: OTP predictability risk, though 6-digit space plus attempt cap partly mitigates].
- Storage: SHA-256 hash of `otp+phone` (not a salted/bcrypt hash, no per-record salt beyond the phone number itself) written to `otp_verifications` with 5-minute expiry, `attempts:0`.
- Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY=REDACTED`.
- Response includes `demoOtp: otp` **in the JSON body returned to the client** (`index.ts:~100`, comment "Remove in production") — [SECURITY-SENSITIVE — CRITICAL] this leaks the OTP itself to anyone who can call the function, completely defeating the OTP security control. No actual SMS provider integration exists (comment: "In production, integrate with SMS provider here").
- No idempotency beyond the delete-then-insert pattern.

## verify-otp
- File: `supabase/functions/verify-otp/index.ts` (249 lines). verify_jwt: not in config.toml [UNKNOWN].
- Purpose: verify OTP and sign the user in (creating a Supabase Auth session) via a synthetic email `${phone}@ogura.phone.auth`.
- Input: `{ phone, otp, name? }`; OTP must match `/^\d{6}$/`.
- Logic: fetch latest OTP row for phone → reject if none/expired (deletes expired record) → reject if `attempts>=5` (deletes record) → recompute SHA-256(`otp+phone`) and compare to stored hash → on mismatch increments `attempts` and returns 401 → on match, looks up existing auth user by scanning **all** users via `auth.admin.listUsers()` and matching `email === phoneEmail` [SECURITY/PERF-SENSITIVE — MEDIUM: `listUsers()` is O(all users) per verification, not scoped/filtered — will not scale and is a needless full-table admin scan] → if found, generates a magic-link token (`auth.admin.generateLink`) and immediately exchanges it (`auth.verifyOtp`) to mint a session; if not found, [truncated in review — creates the user, per standard pattern, not fully re-confirmed line-by-line beyond line ~150].
- DB: reads/writes `otp_verifications` (marks `verified:true` only after a session is actually established — "wait until user creation/login succeeds", a good practice), updates `profiles.name/phone` for existing users.
- Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY=REDACTED`.
- Security: [SECURITY-SENSITIVE — HIGH] combined with `send-otp`'s `demoOtp` leak, phone-based auth in this codebase provides effectively no real protection — anyone who knows a phone number can self-serve the OTP from `send-otp`'s response and then log in as that phone's account via `verify-otp`, including pre-existing accounts (account-takeover risk for any user who previously verified with a phone).

## mcp
- File: `supabase/functions/mcp/index.ts` (generated, 167 lines) from `src/lib/mcp/**`.
- Purpose/auth/tools: see `30_BACKEND_ARCHITECTURE.md §30.3`.
- Methods: implements the MCP JSON-RPC-over-HTTP transport via `createSupabaseHandler` (library-managed), not a simple REST verb set.
- Env: relies on `SUPABASE_URL`/`VITE_SUPABASE_URL` and a publishable key (`SUPABASE_PUBLISHABLE_KEY(S)`/anon key) resolved at runtime (`supabase.ts:14-51`) — **no service-role usage**, the safest-by-design function in the set.
- DB reads: `products` (status='live' only, for `search_products`/`get_product` — though `get_product` does **not** filter by status, so any product id, including drafts, is fetchable via MCP without auth [SECURITY-SENSITIVE — LOW/MEDIUM: `get_product` bypasses the "live only" gate that `search_products` and the RLS SELECT policy for anon enforce, but RLS is still active on the underlying anon-key query, so a non-live product is only exposed if RLS itself allows it — since RLS's "Anyond can view live products" policy restricts anon SELECT to `status='live'`, an anonymous MCP caller effectively still cannot read draft products; only an authenticated seller/admin token forwarded through `ctx.getToken()` could see more, consistent with their own RLS grants]); `orders` (customer-scoped, authenticated only).
- Failure modes: returns MCP `isError:true` content blocks with the Postgres error message forwarded verbatim (`text: error.message`) — [SECURITY-SENSITIVE — LOW: raw DB error text exposure to MCP clients, minor info leak].
