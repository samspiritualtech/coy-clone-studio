# 52 — Authorization

Cross-reference: `docs/system-extraction/DATABASE/42_*` for full RLS listing (this doc summarizes and analyzes it).

## 1. Role model

- **[CONFIRMED]** `app_role` is a Postgres enum (referenced as `'admin'::app_role`, `'seller'::app_role` in policies; `USER-DEFINED` type on `user_roles.role`). Observed values in use: `admin`, `seller`; the frontend `AppRole` type (`src/hooks/useUserRole.ts:5`) adds `consumer`. **[UNKNOWN]** whether `consumer` is ever actually inserted into `user_roles` — no INSERT of role `consumer` found in scanned code; a user with zero `user_roles` rows is implicitly treated as a consumer by absence of role, not by an explicit row.
- **[CONFIRMED]** `user_roles` table: `id, user_id, role, created_at`. Multiple rows per user allowed (no unique constraint observed in the column dump) — a user could hold both `seller` and `admin`.
- **[CONFIRMED]** `has_role(auth.uid(), role)` is a SECURITY DEFINER Postgres function used throughout RLS `qual`/`with_check` expressions (`designers`, `influencer_videos`, `products`, `sellers`, `vendors`, `user_roles`, `seller_applications`, `brand_waitlist_applications`). This is the single authorization primitive for admin-gated tables. Its use of SECURITY DEFINER is required to avoid infinite RLS recursion when checking `user_roles` from within a policy on another table — standard, correct Supabase pattern. [CONFIRMED-by-convention; function body not directly dumped but inferred from its usage pattern and name matching Supabase's documented helper].

## 2. `useUserRole` hook — client-side role read

`src/hooks/useUserRole.ts`: on auth ready, `SELECT role FROM user_roles WHERE user_id = auth.uid()` directly against PostgREST (protected by RLS policy `user_roles: Users can view own roles`). Returns `{roles, hasRole, isLoading}`. **This is purely informational for UI branching** — it cannot be used to grant DB access; genuine enforcement is the RLS predicate on the *target* table, not this hook. [CONFIRMED]

## 3. Route guards (client-side only — no server enforcement)

| Guard | Enforcement | Bypassable via? |
|---|---|---|
| `ProtectedRoute` | Checks `isAuthenticated` | Direct PostgREST/API calls, bypassing UI entirely — RLS is the real gate |
| `RoleProtectedRoute` | Checks `hasRole(requiredRole)` from `useUserRole` | Same — UI-only; RLS is the real gate |
| `SellerAuthRoute` | Checks `isAuthenticated` **only**, no role check | Any authenticated non-seller reaches wrapped seller pages' UI shell (though their data fetches will be RLS-empty) |
| `AdminLogin` self-check | `hasRole('admin')` gates redirect, not data | n/a — UI only |

**[SECURITY-SENSITIVE]**: none of these guards should be treated as an authorization boundary; every one is client-executed JS, trivially bypassed by calling Supabase REST/functions directly with a valid session token. The real boundary in every case is DB RLS. This is architecturally acceptable **only if RLS is complete**, which it is not (see below).

## 4. RLS-based authorization per table (summary; full list in DATABASE/42)

| Table | Public/anon | Authenticated (owner) | Admin | Notes |
|---|---|---|---|---|
| products | SELECT if `status='live' AND is_available` | seller: SELECT/INSERT/UPDATE/DELETE own (`seller_id` via `sellers.user_id=auth.uid()`) | ALL via `has_role(admin)` | No policy restricts seller INSERT price/status content — a seller can set `status='live'` themselves (see gaps) |
| product_variants | SELECT if parent product live | seller: ALL on own | — (no explicit admin policy seen) | |
| orders | none anon | customer: SELECT own, INSERT with `customer_id=auth.uid()`; seller: SELECT/UPDATE own (`seller_id`) | none explicit | **No admin policy on `orders`** — admins cannot read orders via RLS unless also owner; likely handled via service-role in a function/dashboard, not RLS. [MISSING] |
| order_items | none anon | customer: SELECT/INSERT via parent order; seller: SELECT via parent order | none | INSERT `with_check` only checks `order_id` belongs to customer, **does not validate price/quantity fields against `products`/`product_variants`** — client can insert arbitrary `unit_price`/`total_price`. [SECURITY-SENSITIVE][CRITICAL — see 55] |
| profiles | none anon | owner: SELECT/INSERT/UPDATE own | none | No admin read policy on profiles — admins cannot query customer profiles via RLS. |
| sellers | none anon | owner: SELECT/UPDATE own, INSERT own | ALL via has_role(admin) | `application_status` is client-writable by seller on their own row (UPDATE policy has no column-level restriction) — a seller could self-approve/self-verify (`is_verified`) if not blocked elsewhere. [SECURITY-SENSITIVE] |
| seller_applications | INSERT open to anon+authenticated | none (no owner-read policy) | admin SELECT/UPDATE | Consistent with an application-then-approve model — but bypassed by `signUpWithEmail` auto-approval path (see 51 CONFLICT). |
| user_roles | none anon | owner: SELECT own only | ALL via has_role(admin) | Only admins can INSERT roles via RLS — **but `AuthContext.signUpWithEmail` inserts a `user_roles` row directly as the signing-up user** (`supabase.from('user_roles').insert({user_id: data.user.id, role:'seller'})`), which would need a permissive INSERT policy for non-admins or it silently fails. **[CONFLICT]** — either (a) there exists an INSERT policy not captured in this policy dump allowing self-insert, or (b) this insert fails RLS and self-signup seller role assignment silently no-ops (error not surfaced to user; code does `await` without checking the error at `AuthContext.tsx:184-187`). Needs a live-DB check; documented as [CONFLICT/UNKNOWN pending verification]. |
| user_addresses | none | owner: full CRUD own | none | |
| tryon_history | none | owner (incl. null for guest at insert time bypasses `auth.uid()=user_id`? actually `user_id` must equal `auth.uid()`, so anonymous inserts with `user_id=null` would fail `auth.uid()=user_id` unless `auth.uid()` is also null for anon — meaning guest try-on writes silently fail RLS for anon callers) | none | **[CONFLICT]** with the "guest sessions" description in 51 — `VirtualTryOn.tsx` attempts insert regardless of auth state, but RLS `auth.uid() = user_id` cannot be satisfied when both are null in Postgres (`NULL = NULL` is not true), so anonymous try-on history inserts are expected to fail row-security, meaning the app likely swallows this error. |
| discounts | anon SELECT of active | seller: ALL own | none explicit | |
| categories/vendors/designers/delivery_zones/influencer_videos | public SELECT (active) | — | admin ALL | Standard public catalog data. |
| brand_waitlist_applications | anon+auth INSERT | none | admin SELECT | |
| payouts | none | seller SELECT own | none | No seller/admin write policy shown for payouts SELECT-only for seller — consistent with payouts being system/admin-generated (outside this dump). |
| support_tickets | none | seller SELECT/INSERT/UPDATE own | none | |

## 5. Storage bucket policies

| Bucket | SELECT | INSERT | UPDATE/DELETE |
|---|---|---|---|
| tryon-images | public | any authenticated user | owner-delete (authenticated) |
| influencer-videos | public | any authenticated user | any authenticated user (update+delete) |
| product-images | public | **any authenticated user, no seller-ownership check, no folder restriction on INSERT** (`with_check: bucket_id='product-images'`) | DELETE restricted to `auth.uid() = storage.foldername(name)[1]` (path-prefix ownership) |

**[SECURITY-SENSITIVE][HIGH]**: `product-images` INSERT policy allows **any authenticated user** (any consumer, not just approved sellers) to upload arbitrary files into the shared product-images bucket with no path/ownership constraint on write (only delete is ownership-scoped). This permits non-sellers to pollute/host arbitrary public files under this bucket, and allows a seller to write into another seller's folder path on upload (since the with_check doesn't scope the folder at all, unlike delete). Cross-ref 55.

## 6. Edge function authorization

| Function | verify_jwt | Internal auth check | Effective authorization |
|---|---|---|---|
| razorpay-create-order | false | none | **Anyone with the public endpoint URL can create a Razorpay order** (cost/spam risk against Razorpay account, not direct fund loss) |
| razorpay-verify-payment | false | HMAC signature check against Razorpay secret only | Verifies payment authenticity, but **not caller identity** — `order_data.customer_id` is taken verbatim from the request body and inserted into `orders.customer_id`, so a caller who obtains someone else's valid Razorpay payment/order id triplet could attribute the order to an arbitrary `customer_id`. Uses service-role, so this insert bypasses the `orders` RLS `with_check (auth.uid()=customer_id)` entirely. **[CRITICAL]** |
| send-otp / verify-otp | false | phone format / OTP hash+expiry only | No caller-identity check at all (by design, since it's pre-auth); relies on OTP secrecy, which is broken by `demoOtp` leak (see 51) |
| virtual-tryon, image-analysis, ai-recommendations, generate-banner-image | false | none observed beyond payload shape | Any anonymous caller can invoke Lovable AI Gateway–backed functions, burning `LOVABLE_API_KEY` quota |
| pincode-lookup, ip-geolocation | false/not listed | none | Low-sensitivity, acceptable to be open |
| pinterest-token-exchange | false | none beyond code presence | Exchanges Pinterest client secret server-side; endpoint itself must be called with a real OAuth `code`, limiting abuse value but still open surface |
| sync-algolia | false | none observed | Should be restricted to admin/service use; open invocation could let anyone trigger a full catalog resync (Algolia admin key usage, potential cost/rate abuse) |
| social-post-webhook | false | none observed (webhook) | No shared-secret/HMAC check on incoming Make.com webhook observed — spoofable [SECURITY-SENSITIVE] |
| mcp | delegated to Supabase OAuth issuer (`acceptedAudiences: "authenticated"`) | Supabase-verified JWT | The only edge function type with real bearer-token verification of caller identity |

## 7. Dev-mode seller fallback — `DEV_SELLER_ID`

**[SECURITY-SENSITIVE][HIGH]** Found in `src/components/seller-dashboard/pages/{DashboardAddProduct,DashboardDiscounts,DashboardProducts,DashboardSettings}.tsx`:
```
const DEV_SELLER_ID = "07edb482-2c8e-4711-8cda-d2f3a87b790a";
...
.then(({ data }) => setSellerId(data?.id || DEV_SELLER_ID));
```
- Pattern: the component queries `sellers` for a row matching `user_id = auth.uid()`; if none is found (`.maybeSingle()` returns null/no data), it **falls back to a hardcoded UUID** and proceeds to use it as `sellerId` for subsequent product/discount CRUD calls.
- Risk: this is a leftover development convenience. In production, any authenticated user with no seller profile who reaches the seller dashboard (e.g., via `SellerAuthRoute`, which — per §3 — does not check seller role) will have the UI operate against `DEV_SELLER_ID`'s data context. Whether this results in actual cross-tenant writes depends entirely on RLS: `products`/`discounts` policies scope by `seller_id IN (SELECT id FROM sellers WHERE user_id=auth.uid())`, so an insert/update targeting `DEV_SELLER_ID` as `seller_id` will be **rejected by RLS unless the logged-in dev/test user's `auth.uid()` genuinely maps to that seller row** — meaning in production this fallback most likely just produces confusing RLS-denied errors rather than a live cross-tenant bypass, **but it is still hardcoded production-shipped test data (a specific real or seed seller UUID) that should not exist in client bundle code**, and if that seller row is a real active seller, every failed-lookup user's dashboard silently attempts to read/write that specific seller's product/discount data (reads would succeed only if RLS also permits, e.g., public "live products" SELECT policy on `products`, but discount/product management calls would fail write, not read-only exposure of others' non-public discounts). **[INFERRED risk level — exact blast radius depends on runtime RLS behavior not exercised here].**

## 8. Capability matrix — Role x Resource x Operation

| Resource | Consumer | Seller (own) | Admin | Anon |
|---|---|---|---|---|
| products (live) | Read | CRUD own | CRUD all | Read |
| products (non-live) | — | Read/CRUD own | CRUD all | — |
| orders | Create own, Read own | Read/Update own (as seller) | **No RLS admin path** [MISSING] | — |
| order_items | Read/insert via own order | Read via own order | none | — |
| sellers profile | — | Read/Update own (incl. verification/status fields) | CRUD all | — |
| seller_applications | Submit (insert) | — | Read/Update (approve) | Submit (insert) |
| user_roles | Read own | Read own | CRUD all | — |
| discounts | Read active | CRUD own | none explicit | Read active |
| product-images storage | — | Upload (any authenticated, not seller-checked) | — | Read |
| profiles | Read/Update own | same | **No admin read policy** [MISSING] | — |
| payments (Razorpay functions) | Invoke (unauthenticated call allowed) | same | same | Invoke |

## 9. Client-side-only authorization instances (flagged)

1. `ProtectedRoute`, `RoleProtectedRoute`, `SellerAuthRoute`, `AdminLogin` role check — all React-only gates.
2. `useUserRole` — read-only convenience hook, not an enforcement mechanism.
3. `DEV_SELLER_ID` fallback — client-side identity substitution with no server-side equivalent concept.
4. Checkout total computation (`Checkout.tsx` — discount %, delivery fee, `finalTotal`) — computed entirely client-side and sent to `razorpay-create-order`/`razorpay-verify-payment` with no server recomputation from `products`/`discounts` tables. **[CRITICAL — see 55]**
