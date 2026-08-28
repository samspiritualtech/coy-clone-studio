# 50 — Security Architecture

Scope: OGURA Lovable/Supabase project. React SPA (Vite) + Supabase (Postgres/PostgREST/Auth/Storage) + Deno edge functions + external APIs (Razorpay, Replicate/Lovable AI, Pinterest, Algolia, Make.com).

## 1. Trust Boundaries

```
[Browser SPA] --anon publishable key--> [PostgREST + RLS] --(Postgres)
      |                                        ^
      | fetch (supabase.functions.invoke)      |
      v                                        |
[Edge Functions (Deno, Supabase)] --service-role (bypasses RLS)--> [Postgres]
      |
      +--> [Razorpay API] (server-side, key secret)
      +--> [Lovable AI Gateway] (LOVABLE_API_KEY)
      +--> [Pinterest OAuth token endpoint] (client secret)
      +--> [Algolia] (admin key, sync-algolia function)
      +--> [Make.com webhook] (social-post-webhook)

[Browser SPA] --anon key, direct--> [Algolia search] (client-side, react-instantsearch — search key expected, verify)
[Browser SPA] --Google OAuth popup/redirect--> [Supabase Auth / Google]
```

- **[OBSERVED]** The SPA never talks to Postgres directly; all data access is via `@supabase/supabase-js`, which uses PostgREST under the anon (`VITE_SUPABASE_PUBLISHABLE_KEY`) or authenticated user JWT.
- **[OBSERVED]** Edge functions are the only code that uses `SUPABASE_SERVICE_ROLE_KEY` (`send-otp`, `verify-otp`, `razorpay-verify-payment` — src: `supabase/functions/*/index.ts`), which bypasses RLS entirely.
- **[OBSERVED]** `supabase/config.toml` sets `verify_jwt = false` for 9 of 13 edge functions (`virtual-tryon`, `generate-banner-image`, `ai-recommendations`, `image-analysis`, `pincode-lookup`, `sync-algolia`, `social-post-webhook`, `razorpay-create-order`, `razorpay-verify-payment`, `pinterest-token-exchange`), meaning Supabase's platform-level JWT gate is disabled for these — any caller (not just an authenticated app user) can invoke them over the public HTTPS endpoint. **[SECURITY-SENSITIVE]**

## 2. The Anon/Publishable Key Model

- **[OBSERVED]** `src/integrations/supabase/client.ts:6-7` builds the client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Both are bundled into the client JS and are **intentionally public** (the publishable/anon key is Supabase's public API key model, not a secret).
- **[CONFIRMED]** All authorization for data reachable via this key is enforced **only by Postgres RLS policies** (see 42/52). There is no additional app-layer authorization for direct table reads/writes from the SPA.
- **[INFERRED]** Because the anon key is public, any actor can script direct PostgREST calls to `https://<project>.supabase.co/rest/v1/<table>` with the same key extracted from the bundle — RLS is the sole real gate for that path.

## 3. Enforcement Points — where security actually happens

| Layer | What enforces access | Evidence |
|---|---|---|
| Browser SPA / React Router | **UI-only** route guards (`ProtectedRoute`, `RoleProtectedRoute`, `SellerAuthRoute`) — redirect only, no data protection | `src/components/auth/*.tsx` |
| PostgREST (direct table access) | Postgres RLS policies, `has_role()` SECURITY DEFINER function | `/tmp/extract/db.txt` POLICIES section |
| Postgres Storage | Storage bucket RLS on `storage.objects` (per-bucket policies) | `/tmp/extract/db.txt` storage policy rows |
| Edge Functions (verify_jwt=true) | Supabase platform JWT verification before function code runs | `mcp` function only relies on OAuth issuer; **[UNKNOWN]** which functions have verify_jwt=true (not listed in config.toml ⇒ default true) — appears to be none of the payment/AI functions |
| Edge Functions (verify_jwt=false) | **No platform check** — function code must self-validate; most do only input-shape validation, not identity | `send-otp`, `verify-otp`, `razorpay-*`, AI functions |
| Edge function business logic | Ad hoc: HMAC signature check (razorpay-verify-payment), phone regex (send-otp), OTP hash+expiry (verify-otp) | see 55_SECURITY_GAPS |
| External APIs | Razorpay signature verification is the only cryptographic trust check; Pinterest/Algolia/Make rely on server-held secrets, not further validated |  |

## 4. Layered Defence Map

```
Layer 1  Network/TLS           -> Supabase/Vercel-managed HTTPS. [ASSUMED, not verified in code]
Layer 2  Anon Key Gate         -> Public by design; not a real gate, rate limiting unknown. GAP: no rate limiting observed anywhere.
Layer 3  Supabase Auth (JWT)   -> Applies only where verify_jwt=true (most edge functions have it FALSE). GAP.
Layer 4  RLS Policies          -> Primary authorization boundary for all direct table/storage access (see 52).
Layer 5  Edge Function Logic   -> Custom code; inconsistent input validation; uses service-role which bypasses Layer 4 entirely. GAP.
Layer 6  Client-side Guards    -> UX only (ProtectedRoute/RoleProtectedRoute); NOT a security control. Must not be relied upon.
```

## 5. Per-Surface Protection Summary

- **Public catalog data** (products, categories, designers, vendors): protected by `status='live' AND is_available=true` RLS predicates — correctly scoped to public data. [CONFIRMED]
- **Seller data** (products, discounts, orders, payouts, support_tickets): RLS scopes by `sellers.user_id = auth.uid()`. [CONFIRMED] But dev-mode client code (`DEV_SELLER_ID` constant) can bypass the *intended* seller identity in the UI layer while RLS still enforces on the DB side — see 52 for detail. [SECURITY-SENSITIVE]
- **Admin data**: gated by `has_role(auth.uid(),'admin')` in RLS; also gated client-side via `RoleProtectedRoute`/`AdminLogin`. Genuine defence-in-depth here because RLS independently checks role. [CONFIRMED]
- **Payments**: total protected by nothing except client-computed values sent to `razorpay-create-order`/`razorpay-verify-payment` — no server-side recomputation of cart totals from `products`/`order_items` before charging or before persisting `orders.total`. **[SECURITY-SENSITIVE][CRITICAL — detailed in 55]**
- **OTP/phone auth**: protected only by function-local logic (rate limit 60s, 5 attempts, 5 min expiry) inside `send-otp`/`verify-otp`; no platform JWT gate; edge function uses service role to directly manipulate `auth.users` via `supabase.auth.admin`. [SECURITY-SENSITIVE]
- **AI/image functions** (`virtual-tryon`, `image-analysis`, `ai-recommendations`, `generate-banner-image`): `verify_jwt=false`, no auth check observed inside function bodies beyond payload shape ⇒ open to anonymous invocation and potential cost/resource abuse. [SECURITY-SENSITIVE]

## 6. Gaps Flagged (see 55 for full register)

- No server-side re-validation of order pricing before payment/order persistence. [CRITICAL]
- `verify_jwt=false` on payment- and AI-cost-bearing functions with no compensating auth check. [HIGH]
- Service-role key used inside `razorpay-verify-payment` to write orders without idempotency or replay protection (same signature could be replayed to insert a duplicate order). [HIGH]
- Client-side-only route guards create no real protection if RLS/function checks are themselves weak (defence-in-depth is inconsistent across the app, strong for admin tables, weak for payments/OTP).
- CORS is `Access-Control-Allow-Origin: '*'` on every edge function observed. [MEDIUM]
