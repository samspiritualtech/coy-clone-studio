# 32 — API and Server Actions

Scope: every network-reachable surface. Consistent with `30_BACKEND_ARCHITECTURE.md`/`31_EDGE_FUNCTIONS.md`. Project ref `yudzgkrjsstqbfrrrrly` (own project) vs external Seller Center project `pyesltzkemtranachpne` (different Supabase project, read-only for this app).

## 32.1 PostgREST table API (own project, via `@supabase/supabase-js`, `src/integrations/supabase/client.ts`)

Every table below is reachable from the browser at `https://yudzgkrjsstqbfrrrrly.supabase.co/rest/v1/<table>` using the publishable/anon key by default, or the caller's JWT when logged in. Effective CRUD per role is the union of `pg_policies` rows (`/tmp/extract/db.txt "=== POLICIES ==="`). [CONFIRMED unless noted]

| Table | anon | authenticated (self-scoped) | admin (`has_role admin`) | Notes |
|---|---|---|---|---|
| `categories` | SELECT (`is_active=true`) | same | full via no admin policy found [INFERRED: managed manually/seed] | |
| `delivery_zones` | SELECT (all) | same | — | public read of all pincodes |
| `designers` | SELECT (all) | same | ALL | |
| `discounts` | SELECT (`status='active' AND (end_date IS NULL OR end_date>now())`) | same + sellers: ALL where `seller_id IN (own sellers.id)` | — (no explicit admin policy; sellers self-manage) | anon can browse active discount codes/values directly (`code`, `value`, `min_purchase`) — [SECURITY-SENSITIVE — LOW: discount codes and rules are publicly enumerable via `select *`] |
| `influencer_videos` | SELECT (`is_active`) | same | ALL | |
| `order_items` | none | INSERT if `order_id` belongs to an order where `customer_id=auth.uid()`; SELECT own (via parent order) or seller's (via `orders.seller_id -> sellers.user_id=auth.uid()`) | — | **Customers can INSERT order_items directly from the browser** (RLS: `order_items "Customers can insert order items"`), independent of the service-role insert done in `razorpay-verify-payment` — i.e. there are *two* code paths that can create order line items: the edge function (service role) and a theoretical direct client insert (not observed being used in `src/**`, but the policy exists and is exploitable) [OBSERVED policy + INFERRED unused] |
| `orders` | none | SELECT own (`customer_id=auth.uid()`); sellers SELECT/UPDATE where `seller_id IN (own sellers.id)` | — | **No client-side INSERT policy on `orders` for anon/authenticated** — the only way an order row is created is the `razorpay-verify-payment` edge function using the service-role key, which bypasses RLS entirely. [CONFIRMED — INSERT policy absent from policy dump] |
| `otp_verifications` | none (no policy grants anon/auth any access) | none | — | Only reachable via `send-otp`/`verify-otp` edge functions (service role). [CONFIRMED] |
| `payouts` | not observed in policy dump snippet reviewed | — | — | [UNKNOWN — not captured in reviewed slice of db.txt; likely admin/seller-scoped, needs direct confirmation] |
| `product_variants` | inferred readable alongside products (not separately confirmed) | — | — | [UNKNOWN — policy not captured in reviewed excerpt] |
| `products` | SELECT where `status='live' AND is_available=true` ("Anyone can view live products") | sellers: SELECT/INSERT/UPDATE/DELETE own (`seller_id IN own sellers.id`) | ALL (`has_role admin`) | **Visibility gate is `status='live' AND is_available=true`; this is the only RLS gate — see `33_BUSINESS_LOGIC.md` RULE-PRODUCT-VISIBILITY for where it is bypassed (edge functions using service role: `sync-algolia`, MCP `get_product`).** |
| `profiles` | not captured in reviewed excerpt | presumably self-row only via `id=auth.uid()` | — | [UNKNOWN — confirm directly; created via `handle_new_user` trigger] |
| `seller_applications` | INSERT (anon+authenticated, `with_check: true` — fully open) | same | SELECT/UPDATE (`has_role admin`) | Legacy/simple application table used by `SellerApply.tsx`/`JoinUs.tsx`; anyone can insert arbitrary rows unauthenticated. |
| `sellers` | none | INSERT own (`auth.uid()=user_id`); SELECT/UPDATE own | ALL (admin) | This is the "real" seller record; approval flow flips `application_status` here (see 33/34). |
| `support_tickets` | not captured in excerpt | — | — | [UNKNOWN] |
| `tryon_history` | insert observed from client (`VirtualTryOn.tsx:99,136`) — RLS not captured in excerpt | — | — | [UNKNOWN policy, OBSERVED client write] |
| `user_addresses` | none | presumably self (`user_id=auth.uid()`) | — | [INFERRED, not directly captured] |
| `user_roles` | none | none for self-insert (INSERT is NOT client-writable per reviewed policies — only `handle_seller_approval` trigger and `AuthContext.tsx:184` insert `user_roles` directly from the client on signup, see 33/36 conflict) | ALL (admin) | **[CONFLICT]**: `AuthContext.tsx:184` does `supabase.from('user_roles').insert(...)` from the browser during seller signup — this requires either an INSERT policy not captured in the reviewed excerpt, or it silently fails under RLS. [UNKNOWN — verify `user_roles` INSERT policy directly] |
| `vendors` | SELECT? (not captured) | — | ALL (admin) | |
| `designers`, `brand_waitlist_applications` | INSERT open to anon+authenticated (`with_check:true`); SELECT admin-only | — | — | |

General rule: **all writes that matter financially or to trust (orders, role grants, seller approval) are designed to go through service-role edge functions, not direct table RLS** — except the notable gaps in `order_items` INSERT and `seller_applications` INSERT which remain fully open, and `discounts` SELECT which exposes full code metadata to anon. [INFERRED/CONFIRMED per table above]

## 32.2 Storage buckets (PostgREST/Storage API)

From `/tmp/extract/db.txt "=== BUCKETS ==="`/`STORAGE POLICIES` (see also client call sites): buckets used from the browser include `product-images` (`DashboardAddProduct.tsx:76`, `SellerAddProduct.tsx:113`, `SellerApply.tsx:51`, `JoinUs.tsx:108`) and `tryon-images` (`useVirtualTryOn.ts:110`). Uploads go directly from the browser using the anon/authenticated session; bucket-level RLS (Storage policies) governs who can write/read — exact policy text is in `db.txt "=== STORAGE POLICIES ==="` [OBSERVED bucket names, policy content not re-quoted here — see sibling docs / db.txt directly for full policy SQL].

## 32.3 Edge Function HTTP endpoints

All are `POST https://yudzgkrjsstqbfrrrrly.supabase.co/functions/v1/<name>`, callable either via `supabase.functions.invoke(name, {body})` (attaches the caller's anon/auth key automatically as `Authorization`/`apikey` headers) or by building the URL manually from `VITE_SUPABASE_PROJECT_ID` (used internally by `src/lib/mcp/index.ts:6,15` to construct the MCP OAuth issuer URL — not for invoking other functions). No code path in `src/**` builds a raw fetch URL to call these functions directly instead of `supabase.functions.invoke`; `invoke()` is the sole calling convention observed. [CONFIRMED, `/tmp/extract/code.txt "SUPABASE CALLS IN SRC"`]

| Function | Invocation site | verify_jwt |
|---|---|---|
| `ai-recommendations` | `supabase.functions.invoke('ai-recommendations', ...)` — `recommendationService.ts:70,108,138,167` | false |
| `generate-banner-image` | no call site found in `src/**` [MISSING/UNKNOWN] | false |
| `image-analysis` | `recommendationService.ts:196` | false |
| `ip-geolocation` | `LocationContext.tsx:76` | not in config.toml [UNKNOWN] |
| `pincode-lookup` | `LocationContext.tsx:325` | false |
| `pinterest-token-exchange` | `PinterestCallback.tsx:26` | false |
| `razorpay-create-order` | `Checkout.tsx:152` | false |
| `razorpay-verify-payment` | `Checkout.tsx:208` | false |
| `send-otp` | no call site found in reviewed grep [MISSING/UNKNOWN — presumably a phone-login UI not captured] | not in config.toml [UNKNOWN] |
| `verify-otp` | same as above [MISSING/UNKNOWN] | not in config.toml [UNKNOWN] |
| `social-post-webhook` | `socialPostService.ts:82` | false |
| `sync-algolia` | no call site in `src/**` [MISSING/UNKNOWN — externally triggered, cron, or manual] | false |
| `virtual-tryon` | `useVirtualTryOn.ts:137` | false |
| `mcp` | not invoked from `src/**` at all — it is a standalone MCP server endpoint consumed by external MCP clients (e.g. an LLM agent), not the SPA | see 32.5 |

Full per-function request/response/error contracts are in `31_EDGE_FUNCTIONS.md` — this document indexes invocation and reachability only, to avoid duplication.

## 32.4 External Seller Center API (different Supabase project) [OBSERVED via live `curl`, read-only]

`GET https://pyesltzkemtranachpne.supabase.co/functions/v1/products` — **a different Supabase project** than this app's own (`yudzgkrjsstqbfrrrrly`). This is a separate "Seller Center" product catalog service that OGURA's storefront does not appear to call from `src/**` (no reference to `pyesltzkemtranachpne` found in the codebase grep) — it was reached directly per task instructions, not via any in-repo code path. [OBSERVED — external, not part of this app's own backend]

Live response shape (array of product objects), field-by-field as observed:
```json
[
  {
    "id": "1f914fbf-210b-4d19-a2a0-bef45c4ad94e",
    "name": "silver dress",
    "slug": "silver-dress",
    "sku": "2sfjc",
    "price": 1200,
    "mrp": 1500,
    "stock": 0,
    "store": null,
    "category": "dress",
    "image_urls": ["https://pyesltzkemtranachpne.supabase.co/storage/v1/object/public/product-images/..."],
    "video_url": "https://.../video.mp4"
  },
  {
    "id": "f03f9509-...",
    "name": "Royal Crimson Boho Kaftan Set",
    "slug": "royal-crimson-boho-kaftan-set-f03f",
    "sku": null,
    "price": 399,
    "mrp": null,
    "stock": 10,
    "store": { "name": "dhruv khandelwal", "slug": "dhruv-khandelwal" },
    "category": null,
    "image_urls": ["..."],
    "video_url": null
  }
]
```
Observations: [OBSERVED] fields `slug`, `sku`, `mrp`, `category`, `store` are frequently `null` (inconsistent seller data entry); `store` is either `null` or `{name, slug}`; no pagination parameters were sent and the endpoint returned a flat unpaginated array; endpoint required no auth header (called with plain `curl`, no API key) — publicly world-readable product feed. [SECURITY-SENSITIVE — LOW, external system, out of this app's control] This endpoint is **not part of the OGURA app's own backend surface** — no `33`/`34`/`35`/`36` business rules should be attributed to it; it is documented here only because the task required probing it. No relationship (shared IDs, sync job) between this external catalog and the OGURA `products` table was found in the codebase. [INFERRED — unrelated systems, same naming convention ("Seller Center") suggests common vendor/platform origin but no code linkage in this repo]

## 32.5 MCP endpoint (`supabase/functions/mcp`)

- Endpoint: `POST https://yudzgkrjsstqbfrrrrly.supabase.co/functions/v1/mcp` implementing MCP-over-HTTP (JSON-RPC), generated from `src/lib/mcp/index.ts` (`supabase/functions/mcp/index.ts`, banner "AUTO-GENERATED"). [CONFIRMED]
- OAuth issuer config (`src/lib/mcp/index.ts:14-17`): `auth.oauth.issuer({ issuer: `https://${VITE_SUPABASE_PROJECT_ID}.supabase.co/auth/v1`, acceptedAudiences: "authenticated" })` — MCP clients must obtain a bearer token from this project's Supabase Auth (`/auth/v1`) with audience `authenticated`; the MCP runtime validates the token against that issuer before treating a call as authenticated (`ctx.isAuthenticated()`/`ctx.getUserId()`). [CONFIRMED]
- Tools:
  - `search_products({query?, category?, max_price?, limit≤50})` — `src/lib/mcp/tools/search-products.ts`. Uses `supabaseOptionalUser(ctx)` (anon key + caller's forwarded bearer token if present). Query: `.from("products").select("id,title,price,category,short_description,description,images").eq("status","live").limit(limit??20)`, optional `.or(title.ilike/description.ilike)`, `.eq("category",…)`, `.lte("price",…)`. No auth required — rides RLS "Anyone can view live products" (though that RLS also checks `is_available=true`; the MCP query itself only filters `status='live'`, so `is_available=false` live-status products could theoretically appear in results if RLS did not also require it — RLS is the actual backstop here). [CONFIRMED]
  - `get_product({product_id: uuid})` — `src/lib/mcp/tools/get-product.ts`. `supabaseOptionalUser(ctx).from("products").select("*").eq("id",product_id).maybeSingle()`. **No `status`/`is_available` filter in the tool's own query** — relies entirely on RLS to block non-live rows for unauthenticated/non-owning callers; RLS's `status='live' AND is_available=true` policy is therefore the sole gate. [CONFIRMED, consistent with `31_EDGE_FUNCTIONS.md §mcp`]
  - `list_my_orders({limit≤50})` — `src/lib/mcp/tools/list-my-orders.ts`. Requires `ctx.isAuthenticated()`; returns 401-style MCP error content if not. Uses `supabaseForUser(ctx)` (forwards caller's bearer token) — `.from("orders").select("id,order_number,status,subtotal,shipping_fee,discount,total,tracking_id,created_at").eq("customer_id", ctx.getUserId()).order("created_at",desc).limit(limit??10)`. Scoped correctly to the caller via RLS + explicit filter (defense in depth). [CONFIRMED]
- No DB writes are performed by any MCP tool — read-only surface. [CONFIRMED]
- Error handling: Postgres error `message` is returned verbatim inside MCP `isError:true` content blocks for all three tools — minor info-leak of DB error text to MCP clients. [SECURITY-SENSITIVE — LOW]

## 32.6 RPC calls (`supabase.rpc(...)`)

No occurrence of `supabase.rpc(` was found in `src/**` or `supabase/functions/**` in the reviewed grep output (`/tmp/extract/code.txt`, `files.txt`). [MISSING — confirmed absence] All Postgres-side logic is instead invoked implicitly via triggers (`handle_new_user`, `handle_seller_approval`, `cleanup_expired_otps`, `update_updated_at_column`) rather than callable RPC functions; `has_role(uuid, app_role)` is a `SECURITY DEFINER`-style SQL function used **inside RLS policy definitions only**, not called directly from the client as an RPC. [CONFIRMED via `pg_proc` dump]
