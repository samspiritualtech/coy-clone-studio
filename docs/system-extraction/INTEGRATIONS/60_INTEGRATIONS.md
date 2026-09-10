# 60 — External Integrations Inventory

Scope: every outbound/inbound network dependency actually wired into code, verified by reading source. Nothing here is inferred from marketing copy alone.

---

## 1. Supabase / Lovable Cloud (primary backend)
- **SERVICE**: Supabase (Lovable Cloud-provisioned) — Postgres + Auth + Storage + Edge Functions.
- **PURPOSE**: Sole application database, auth provider, file storage, and serverless function host. [CONFIRMED]
- **CALLER**: `src/integrations/supabase/client.ts:12` — `createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {...})`. Used everywhere via `import { supabase } from "@/integrations/supabase/client"`.
- **PROJECT ID**: `yudzgkrjsstqbfrrrrly` (supabase/config.toml:1, and matches `VITE_SUPABASE_URL=https://yudzgkrjsstqbfrrrrly.supabase.co`).
- **TRIGGER**: every page/component/hook that reads or writes app data.
- **AUTH METHOD**: anon/publishable JWT key on client; service-role key inside edge functions only (server-side).
- **ENV VARS**: `VITE_SUPABASE_URL=REDACTED (project URL, not secret)`, `VITE_SUPABASE_PUBLISHABLE_KEY=REDACTED (anon key, public by design)`, `SUPABASE_URL=REDACTED`, `SUPABASE_PUBLISHABLE_KEY=REDACTED` (duplicated non-VITE_ copies in `.env`), `SUPABASE_SERVICE_ROLE_KEY=REDACTED` (edge-function-only, type=secret, used_by=razorpay-verify-payment, send-otp, verify-otp, sync-algolia; required=yes; risk=full DB bypass of RLS if leaked) [SECURITY-SENSITIVE].
- **CRITICALITY**: hard dependency — app cannot function without it.

## 2. External "Seller Center" Supabase project (cross-project read API)
- **SERVICE**: A *second*, separate Supabase project (`pyesltzkemtranachpne.supabase.co`), not the same project as the main app (`yudzgkrjsstqbfrrrrly`). [CONFIRMED]
- **PURPOSE**: Read-only product feed — appears to be a companion "Seller Center" app publishing products this storefront displays as "brand store" / "new arrivals" inventory.
- **CALLER files**: `src/lib/brandStores.ts:3`, `src/pages/Collections.tsx:25`, `src/pages/ProductDetail.tsx:108`, `src/components/SellerNewArrivals.tsx:6`.
- **ENDPOINT**: `GET https://pyesltzkemtranachpne.supabase.co/functions/v1/products`.
- **TRIGGER**: page load of Collections, ProductDetail, Brand Store pages, and the SellerNewArrivals homepage widget.
- **REQUEST**: plain unauthenticated `fetch()`, no API key/header sent in observed call sites (function's `verify_jwt` setting is on the *other* project, unknown to this repo).
- **AUTH METHOD**: [UNKNOWN] — no Authorization header set from this codebase; function may be public (`verify_jwt=false` on the other project, unconfirmed since that project's config isn't in this repo).
- **INPUT**: none (GET, no params observed).
- **OUTPUT**: JSON array of product objects, mapped via `mapApiProduct()` in `brandStores.ts` into `BrandStoreProduct`.
- **DATABASE EFFECT**: none — read-only, not written back to this project's DB.
- **FAILURE**: [OBSERVED] no explicit retry; failures presumably fall back to static/mock catalog (`ProductDetail.tsx` wraps in try/catch per typical pattern — verify per call site).
- **RETRY / TIMEOUT**: [MISSING] no retry or timeout logic wraps these `fetch()` calls.
- **SECURITY RISK**: [SECURITY-SENSITIVE] hard-coded cross-tenant dependency on infrastructure not owned/documented by this repo; if that project is deleted, renamed, or its function auth changes, four pages silently break with no fallback UX guarantee documented.
- **CRITICALITY**: soft/optional for core cart-and-checkout flow, but hard dependency for Brand Store / New Arrivals / part of Collections & ProductDetail content.

## 3. Google OAuth (via Lovable Cloud Auth, not raw Google SDK)
- **SERVICE**: Google Sign-In, brokered through `@lovable.dev/cloud-auth-js`.
- **PURPOSE**: Social login for customers.
- **CALLER**: `src/contexts/AuthContext.tsx:129` → `lovable.auth.signInWithOAuth("google", {...})`; wrapper defined in `src/integrations/lovable/index.ts:9-27` which calls `lovableAuth.signInWithOAuth(provider, opts)` then `supabase.auth.setSession(result.tokens)`.
- **TRIGGER**: user clicks `GoogleSignInButton` (`src/components/auth/GoogleSignInButton.tsx`).
- **AUTH METHOD**: OAuth redirect flow managed entirely inside the `@lovable.dev/cloud-auth-js` package; **no Google Client ID/Secret appears anywhere in this repo** — credentials are held by the Lovable Cloud platform, not by this codebase. [CONFIRMED absence in repo] [INFERRED managed by Lovable Cloud]
- **INPUT**: provider name (`"google"`), optional `redirect_uri`.
- **OUTPUT**: `{ redirected }` or `{ error }` or Supabase session tokens, which are then installed into the Supabase JS client's session via `setSession`.
- **DATABASE EFFECT**: creates/updates `auth.users` row in the primary Supabase project; a `profiles` row is expected to be created via trigger (not verified in this doc — see 71/72 for trigger inventory if present).
- **FAILURE**: `signInWithOAuth` returns `{error}`, surfaced to UI via toast (not traced further here).
- **ENV VARS**: none present in this repo for Google — [MISSING] from an app-rebuild perspective; a from-scratch rebuild off-Lovable-Cloud would need `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` configured in a real OAuth provider [CONFLICT with "just works" assumption].
- **CRITICALITY**: optional (alternative to phone-OTP and email/password login).

## 4. Razorpay (payment gateway)
See **61_PAYMENT.md** for the full trace. Summary:
- **SERVICE**: Razorpay Orders API + Checkout.js widget.
- **CALLER files**: `supabase/functions/razorpay-create-order/index.ts`, `supabase/functions/razorpay-verify-payment/index.ts`, `src/pages/Checkout.tsx`.
- **ENDPOINT**: `https://api.razorpay.com/v1/orders` (server-side order creation); client-side loads `https://checkout.razorpay.com/v1/checkout.js` (Checkout.tsx:52).
- **AUTH METHOD**: HTTP Basic auth with `RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET` (base64) for order creation; HMAC-SHA256 signature check for verification.
- **ENV VARS**: `RAZORPAY_KEY_ID=REDACTED` (type=public-ish key id, used_by=razorpay-create-order, razorpay-verify-payment's response echo; required=yes), `RAZORPAY_KEY_SECRET=REDACTED` (type=secret, used_by=both razorpay-* functions; required=yes; risk=can forge orders/refunds if leaked) [SECURITY-SENSITIVE].
- **WEBHOOK**: [MISSING] — no Razorpay server-to-server webhook endpoint exists in `supabase/functions/`; verification is entirely client-driven (browser calls verify function after Checkout.js `handler` fires). This is a payment-integrity gap, detailed in 61.
- **CRITICALITY**: hard dependency for any real payment; no alternate payment method exists in code.

## 5. Virtual Try-On models — Hugging Face Space (IDM-VTON), *not* Replicate
- **SERVICE**: Hugging Face-hosted Gradio Space `yisol/idm-vton` at `https://yisol-idm-vton.hf.space`. [CONFIRMED] No Replicate API calls exist anywhere in the repo — the task brief's mention of "Replicate and/or HuggingFace" resolves to **HuggingFace only**. [CONFLICT with brief's Replicate assumption — no Replicate code found]
- **CALLER**: `supabase/functions/virtual-tryon/index.ts` (full trace in 62_AI_AND_STUDIO.md).
- **AUTH METHOD**: `Authorization: Bearer ${HUGGINGFACE_API_TOKEN}` sent to the HF Space's Gradio queue endpoints.
- **ENV VARS**: `HUGGINGFACE_API_TOKEN=REDACTED` (type=secret, used_by=virtual-tryon, required=yes, risk=quota abuse/billing on HF account if leaked).
- **PROTOCOL**: Gradio SSE queue protocol (`/queue/join` then `/queue/data`), `fn_index: 2`, hardcoded `denoise_steps: 30`, `seed: 42`.
- **TIMEOUT**: 90 seconds hard cap (`MAX_WAIT_MS = 90_000`).
- **CRITICALITY**: optional — a discrete "Virtual Try-On" feature; rest of storefront functions without it. Reliant on a public community Space with no SLA (cold starts / 503 explicitly handled as "loading").

## 6. Lovable AI Gateway (LLM + image-generation)
- **SERVICE**: `https://ai.gateway.lovable.dev/v1/chat/completions` — OpenAI-compatible gateway provided by Lovable Cloud.
- **PURPOSE / CALLERS**:
  - `supabase/functions/ai-recommendations/index.ts` — model `google/gemini-2.5-flash`, text-only, returns JSON array of product IDs.
  - `supabase/functions/image-analysis/index.ts` — model `google/gemini-2.5-flash` with multimodal `image_url` input (base64), two sequential calls (analyze image → match products).
  - `supabase/functions/generate-banner-image/index.ts` — model `google/gemini-2.5-flash-image-preview`, `modalities: ["image","text"]`, returns a generated banner image.
- **AUTH METHOD**: `Authorization: Bearer ${LOVABLE_API_KEY}`.
- **ENV VARS**: `LOVABLE_API_KEY=REDACTED` (type=secret/platform-issued, used_by=ai-recommendations, image-analysis, generate-banner-image; required=yes; risk=abuse of AI credits if leaked).
- **FAILURE HANDLING**: all three functions explicitly branch on HTTP 429 (rate limit) and (banner function only) 402 (payment/credits required), returning structured JSON errors to the client rather than throwing raw 500s.
- **RETRY**: [MISSING] none of the three functions retry on failure; caller (frontend) also does not retry these three (contrast with virtual-tryon's client-side retry loop).
- **CRITICALITY**: optional/soft — recommendations, image search, and banner generation degrade to empty arrays/errors without breaking checkout or browsing.

## 7. Algolia (search)
- **SERVICE**: Algolia Search (`algoliasearch/lite` client).
- **CALLER**: `src/lib/algoliaClient.ts:5` — `algoliasearch("KEBAEMMQPI", "765787a04065dd199e268ba75e81e34f")`; App ID and **search-only** API key are hardcoded directly in frontend source (not env vars). Code comment self-documents this is intentional ("safe to expose... search permissions only").
- **INDEX**: `ogura-products` (`ALGOLIA_INDEX_NAME`).
- **SYNC PATH**: `supabase/functions/sync-algolia/index.ts` — generates a large static/synthetic product catalog (dresses/tops/bottoms/outerwear/footwear/accessories/bags, ~700 items) and pushes to Algolia. This function's write-side Admin API key is presumably a separate secret (not observed in the first 500 lines read; assume `ALGOLIA_ADMIN_API_KEY` env var is needed for the write half — [UNKNOWN], recommend confirming in Supabase function secrets).
- **CRITICALITY**: hard dependency for the `/search` and Algolia-powered PLP components (`src/components/search/*`); optional for the rest of the storefront which uses direct Supabase queries.

## 8. Pinterest API v5
- **SERVICE**: Pinterest OAuth + Boards/Pins API.
- **CALLER**: `supabase/functions/pinterest-token-exchange/index.ts` (server-side OAuth code exchange), plus frontend components `ConnectPinterestButton.tsx`, `PinterestBoardModal.tsx`, `UserPinterestBoards.tsx`, `SaveToPinterestButton.tsx` (not fully read in this pass — token-exchange function confirms API v5 usage: `https://api.pinterest.com/v5/oauth/token`).
- **AUTH METHOD**: HTTP Basic auth with `PINTEREST_CLIENT_ID:PINTEREST_CLIENT_SECRET` for token exchange; resulting `access_token` returned to the client for subsequent direct Pinterest API calls from the browser (implied — token is handed back to frontend, not stored server-side in the reviewed function).
- **ENV VARS**: `PINTEREST_CLIENT_ID=REDACTED`, `PINTEREST_CLIENT_SECRET=REDACTED` (both secret, used_by=pinterest-token-exchange, required=yes).
- **SECURITY RISK**: [SECURITY-SENSITIVE] access token is returned directly to the browser in the JSON response and presumably stored in client-side state/localStorage for later direct Pinterest calls — token lifetime/storage/rotation was not verified further in this pass.
- **CRITICALITY**: optional — "Save to Pinterest" social feature.

## 9. Make.com webhook (social posting)
- **SERVICE**: Make.com (Integromat) inbound webhook.
- **CALLER**: `supabase/functions/social-post-webhook/index.ts`, invoked from `src/services/socialPostService.ts` → `supabase.functions.invoke("social-post-webhook", {...})`.
- **ENDPOINT**: `Deno.env.get("MAKE_WEBHOOK_URL")` (dynamic; not hardcoded).
- **ENV VARS**: `MAKE_WEBHOOK_URL=REDACTED` (type=secret-ish URL, used_by=social-post-webhook, required=yes; risk=SSRF/spoofed social posts if leaked/misconfigured, low severity).
- **TRIGGER**: "custom_design_created" / "custom_order_confirmed" events fired from Made-to-Order design flows.
- **REQUEST**: flattened JSON payload (title, description, image, url, designer info, customization fields) POSTed with `Content-Type: application/json`, no signing/HMAC on the outbound call.
- **FAILURE**: fire-and-forget — `triggerSocialPost()` catches all errors and returns `false`; does not block the calling UI flow.
- **CRITICALITY**: optional/cosmetic marketing automation.

## 10. IP Geolocation
- **SERVICE**: `ip-api.com` (free tier, no key, documented 45 req/min limit) called server-side.
- **CALLER**: `supabase/functions/ip-geolocation/index.ts:24` — `http://ip-api.com/json/${clientIP}?fields=status,message,country,regionName,city`. Note: **plain HTTP, not HTTPS** [SECURITY-SENSITIVE — IP-based geolocation query sent unencrypted, low-severity data but still a plaintext leak of visitor IP to an intermediary].
- **AUTH METHOD**: none (no API key).
- **FAILURE**: on `status:"fail"` or any exception, hardcoded fallback to `Delhi, Delhi, India`.
- **ENV VARS**: none.
- **CRITICALITY**: optional — feeds default location for delivery-check UI; falls back safely.

## 11. Pincode Lookup (India Post)
- **SERVICE**: `https://api.postalpincode.in/pincode/{pincode}` — free Indian government-adjacent public API, no key.
- **CALLER**: `supabase/functions/pincode-lookup/index.ts`.
- **VALIDATION**: server-side regex `^\d{6}$` before calling out.
- **CRITICALITY**: optional convenience (auto-fill city/state during address entry); manual entry fallback exists per error message text ("enter details manually").

## 12. Spline (3D)
- **SERVICE**: Spline embedded 3D scene via iframe.
- **CALLER**: `src/components/Spline3DBackground.tsx:6` — `src='https://my.spline.design/fashiontech-jQgcNhhdhO3bpc6NgnyW2CKN/'`.
- **AUTH METHOD**: none — public Spline share link embedded as an `<iframe>` (or similar; not confirmed further).
- **CRITICALITY**: optional/cosmetic; purely decorative background on marketing surfaces.

## 13. Maps
[MISSING] — no Google Maps / Mapbox / Leaflet integration found anywhere in `src` (searched for map SDK imports; only found the `LuxuryStoreLocator`/`StoreLocator` components which, based on file names, likely render a static store list rather than an interactive map — not independently confirmed with map tile requests).

## 14. MCP (Model Context Protocol) clients
- **SERVICE**: `@lovable.dev/mcp-js` (v0.24.0) — two roles:
  1. **Build-time Vite plugin**: `vite.config.ts:5,10` — `mcpPlugin()` from `@lovable.dev/mcp-js/stacks/supabase/vite`, auto-generates `supabase/functions/mcp/index.ts` from `src/lib/mcp/**` at build time.
  2. **Runtime MCP server**: deployed as the `mcp` edge function (auto-generated, "do not edit" banner), defining at least one tool (`search-products`, per `src/lib/mcp/tools/search-products.ts` bundled reference) using `zod@^3.23.8` for schema validation.
- **PURPOSE**: exposes a Model-Context-Protocol tool surface (e.g., for AI agents/assistants) backed by the same Supabase project via `src/lib/mcp/supabase.ts` (separate lightweight client factory reading `SUPABASE_URL`/`VITE_SUPABASE_URL` and a publishable key).
- **CRITICALITY**: optional / platform tooling — not part of the customer-facing checkout or browsing path.

---

## Consolidated ENV VAR register (redacted)

| VAR | Type | Used by | Required | Risk |
|---|---|---|---|---|
| VITE_SUPABASE_URL | public URL | frontend supabase client | yes | none (public) |
| VITE_SUPABASE_PUBLISHABLE_KEY | public anon key | frontend supabase client | yes | low (RLS-scoped) |
| SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY | duplicate non-VITE copies | build tooling / legacy | yes | low |
| SUPABASE_SERVICE_ROLE_KEY | secret | razorpay-verify-payment, send-otp, verify-otp, sync-algolia | yes | [SECURITY-SENSITIVE] full RLS bypass |
| RAZORPAY_KEY_ID | key id | razorpay-create-order, razorpay-verify-payment | yes | low |
| RAZORPAY_KEY_SECRET | secret | razorpay-create-order, razorpay-verify-payment | yes | [SECURITY-SENSITIVE] |
| HUGGINGFACE_API_TOKEN | secret | virtual-tryon | yes | medium (quota/billing abuse) |
| LOVABLE_API_KEY | secret | ai-recommendations, image-analysis, generate-banner-image | yes | medium (AI credit abuse) |
| PINTEREST_CLIENT_ID | secret | pinterest-token-exchange | yes | low |
| PINTEREST_CLIENT_SECRET | secret | pinterest-token-exchange | yes | [SECURITY-SENSITIVE] |
| MAKE_WEBHOOK_URL | secret-ish URL | social-post-webhook | yes | low |
| ALGOLIA admin key (write side of sync-algolia) | secret | sync-algolia | [UNKNOWN — not confirmed present] | medium if exists |

