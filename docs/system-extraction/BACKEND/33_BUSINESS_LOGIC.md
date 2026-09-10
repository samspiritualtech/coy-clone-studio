# 33 — Business Logic Rules

Format per rule: ID / NAME / DESCRIPTION / TRIGGER / ACTOR / PRECONDITIONS / LOGIC / DATA READ / DATA WRITTEN / STATE CHANGE / SUCCESS / FAILURE / EXCEPTION / SECURITY REQUIREMENT / SOURCE FILE / DATABASE SOURCE / RELATED UI / RELATED FLOW / CONFIDENCE.

---

### RULE-SELLER-APPROVAL — Seller approval grants `seller` role
- DESCRIPTION: When an admin flips a seller's `application_status` to `approved`, a DB trigger grants that user the `seller` app role.
- TRIGGER: `UPDATE` on `public.sellers` row.
- ACTOR: admin (via `AdminApprovals`/`AdminSellers` UI, which must have `has_role(admin)` per `sellers` RLS "Admins can manage all sellers").
- PRECONDITIONS: row exists in `sellers`; caller passes `has_role(auth.uid(),'admin')` RLS check to perform the UPDATE.
- LOGIC (`handle_seller_approval`, AFTER UPDATE trigger, `pg_proc`): `IF NEW.application_status='approved' AND OLD.application_status!='approved' THEN INSERT INTO user_roles(user_id,role) VALUES (NEW.user_id,'seller') ON CONFLICT (user_id,role) DO NOTHING;`
- DATA READ: `OLD`/`NEW` row of `sellers`.
- DATA WRITTEN: `user_roles` insert (idempotent via `ON CONFLICT DO NOTHING`).
- STATE CHANGE: `sellers.application_status: pending|rejected → approved` triggers `user_roles += {user_id, 'seller'}`.
- SUCCESS: role granted exactly once even if approved multiple times (conflict-safe).
- FAILURE: none observed — trigger has no error branch; if insert somehow fails, whole UPDATE transaction rolls back (trigger runs in same transaction).
- EXCEPTION: transitioning **from** `approved` back to `pending`/`rejected` does **not** revoke the `seller` role — no corresponding "downgrade" trigger exists. [MISSING/GAP — see 34]
- SECURITY REQUIREMENT: only reachable if caller holds `admin` role (enforced by DB RLS on the `sellers` UPDATE, not by app code) — DB-enforced, not client-trust-based. [CONFIRMED, strong]
- SOURCE FILE: DB trigger only (no direct edge-function/app-code equivalent found).
- DATABASE SOURCE: `pg_proc.handle_seller_approval`; `sellers_application_status_check` CHECK constraint restricts values to `pending|approved|rejected`.
- RELATED UI: `src/pages/admin/AdminSellers.tsx` (approvals), `AdminApprovals.tsx`.
- RELATED FLOW: seller onboarding.
- CONFIDENCE: CONFIRMED.

### RULE-PRODUCT-STATUS-LIFECYCLE — Product status enum & constraint
- DESCRIPTION: `products.status` is restricted to a fixed lifecycle vocabulary.
- TRIGGER: any INSERT/UPDATE of `products.status`.
- ACTOR: seller (own products, via RLS `Sellers can insert/update own products`), admin (`ALL` via `has_role`).
- PRECONDITIONS: none beyond ownership RLS.
- LOGIC: DB CHECK constraint `products_status_check`: `status IN ('draft','submitted','under_review','live','rejected','disabled')`. No state-machine trigger enforces *transition* validity (e.g. nothing stops a seller from setting `draft → live` directly, or `live → draft`) — the constraint only validates the *value*, not the *transition*. [CONFIRMED absence of transition trigger — grep of `pg_proc` shows no such function]
- DATA READ: n/a (constraint, not procedural).
- DATA WRITTEN: `products.status`.
- STATE CHANGE: see `34_WORKFLOWS_AND_STATE_MACHINES.md` for the full diagram.
- SUCCESS: any of the 6 values accepted from any actor with row-level write access.
- FAILURE: any other string → `23514` check_violation, surfaced to caller as a Postgres error.
- EXCEPTION: **admins can also directly write `status` via the `ALL` policy**, and **sellers can self-approve their own products to `live`** since the RLS UPDATE policy only checks `seller_id` ownership, not the target status value — there is no DB rule requiring `submitted → under_review → live` to pass through an admin actor. [SECURITY-SENSITIVE — MEDIUM: a seller can bypass any intended moderation workflow by updating their own product row directly to `status:'live'` from the browser, since nothing but RLS ownership gates the UPDATE] [INFERRED from absence of value-transition trigger + absence of admin-only column-level grant]
- SECURITY REQUIREMENT: value-set is DB-enforced; transition/actor-role enforcement for moderation is **not** DB-enforced — relies entirely on the admin dashboard UI choosing not to let sellers set `live` (client-side convention only, `SellerAddProduct.tsx`/`DashboardAddProduct.tsx` presumably submit as `draft`/`submitted`, not directly checked in this pass). [MISSING — DB does not prevent this]
- SOURCE FILE: `src/pages/seller/SellerAddProduct.tsx`, `src/components/seller-dashboard/pages/DashboardAddProduct.tsx` (writers), `src/pages/admin/AdminProducts.tsx` (presumed moderator).
- DATABASE SOURCE: `products_status_check` constraint; `products` RLS policies.
- RELATED UI: seller "Add Product" forms, Admin Products page.
- RELATED FLOW: catalog moderation.
- CONFIDENCE: CONFIRMED (constraint) / INFERRED (moderation bypass risk).

### RULE-PRODUCT-VISIBILITY — Live-product gating and its bypasses
- DESCRIPTION: Public/customer-facing product listing/detail pages should only show `status='live' AND is_available=true` products.
- TRIGGER: any SELECT of `products` by anon/authenticated non-owner.
- ACTOR: customer (anon or logged in, non-seller-owner, non-admin).
- LOGIC: RLS policy `"Anyone can view live products"`: `qual = (status='live' AND is_available=true)`. This is the **only** enforcement point for the anon/browser path (`ProductDetail.tsx`, `Collections.tsx`, `Search.tsx`, etc. all query `products` with the anon-scoped client and rely on RLS to filter, not on an explicit `.eq('status','live')` in every query — not fully re-verified per file, but confirmed for `ProductDetail.tsx` which just does `.from("products")` without an explicit status filter, relying on RLS). [CONFIRMED for ProductDetail.tsx pattern, `src/pages/ProductDetail.tsx:67`]
- BYPASSES:
  1. `sync-algolia` edge function reads `products` using the **service-role key**, which bypasses RLS entirely — if it does not itself add a `.eq('status','live')` filter (not fully re-verified due to file size, 749 lines), non-live/draft products could be pushed into the public Algolia index and become searchable/visible to any storefront visitor via search, completely bypassing the RLS gate. [SECURITY-SENSITIVE — HIGH, INFERRED — needs direct confirmation of `sync-algolia`'s WHERE clause]
  2. MCP tool `get_product` (`src/lib/mcp/tools/get-product.ts`) does not add its own `status`/`is_available` filter — it relies on RLS via the forwarded anon/user key, so it is *not* actually a bypass for unauthenticated callers (RLS still blocks), but it **is** a bypass for a seller/admin's own forwarded token, letting them fetch their own non-live products through MCP (expected/consistent with their own RLS grants, not a security gap). [CONFIRMED — not a real bypass for anon]
  3. Admin dashboard (`has_role admin` `ALL` policy) intentionally bypasses the live filter — expected.
- SECURITY REQUIREMENT: RLS is the sole real gate for anon/customer visibility; any code path using the service-role key must re-implement the filter manually or it leaks draft/rejected/disabled products. [SECURITY-SENSITIVE — HIGH for sync-algolia, unconfirmed]
- SOURCE FILE: `src/pages/ProductDetail.tsx`, `src/pages/Collections.tsx`, `supabase/functions/sync-algolia/index.ts`.
- DATABASE SOURCE: `products` RLS "Anyone can view live products".
- RELATED FLOW: product discovery/search.
- CONFIDENCE: CONFIRMED (RLS rule itself) / INFERRED (sync-algolia bypass extent).

### RULE-PRICING-DISCOUNT — Discount code validation and amount calc
- DESCRIPTION: Checkout page lets a customer apply a discount code; validation and amount math happen entirely client-side.
- TRIGGER: user clicks "Apply" on a discount code in `Checkout.tsx`.
- ACTOR: authenticated customer (Checkout is behind `ProtectedRoute`).
- PRECONDITIONS: cart non-empty.
- LOGIC (`Checkout.tsx:76-122`): `SELECT * FROM discounts WHERE code=upper(input) AND status='active'` (client anon/auth key, matches the "Anyone can view active discounts" RLS policy) → reject if not found; reject if `usage_limit` set and `usage_count >= usage_limit`; reject if `min_purchase` set and `subtotal < min_purchase`; compute `amount`: `type==='free_shipping' → amount=deliveryFee`; `type.includes('percentage') → amount=round(subtotal*value/100)`; else (`fixed`) → `amount=min(value, subtotal)`.
- DATA READ: `discounts` table (client-side, full row incl. `usage_count`, `min_purchase`, `value`).
- DATA WRITTEN: **none** — `discounts.usage_count` is never incremented anywhere in the reviewed codebase (no edge function, no trigger found that increments it on order placement). [MISSING — usage_limit is effectively unenforceable long-term since usage_count never advances]
- STATE CHANGE: none server-side; only local React state (`discountAmount`, `appliedDiscount`).
- SUCCESS: toast "Discount applied!", `finalTotal` recomputed client-side.
- FAILURE: toast "Invalid code"/"Code expired"/"Minimum not met"; on any exception, generic "Could not apply discount." toast.
- EXCEPTION/SECURITY REQUIREMENT: **[SECURITY-SENSITIVE — HIGH]** The discount amount, and indeed the entire `finalTotal`, are computed in the browser and then sent as trusted input (`order_data.total`, `order_data.discount`) to `razorpay-verify-payment`, which inserts them into `orders` via service role with **no server-side recomputation or cross-check against the `discounts` table, the Razorpay-captured amount, or the cart contents**. A user could apply no discount in the UI, or edit `discountAmount`/`finalTotal` via devtools/direct API call, and set `orders.total`/`orders.discount` to any value while still passing Razorpay signature verification for whatever amount was actually charged by Razorpay's order (which itself is separately client-set via `razorpay-create-order`'s unrestricted `amount` field — see RULE-CHECKOUT-TOTAL). [CONFIRMED, cross-referenced with `razorpay-create-order`/`razorpay-verify-payment` code]
- SOURCE FILE: `src/pages/Checkout.tsx:76-131`.
- DATABASE SOURCE: `discounts` table + RLS; no CHECK constraints on `type`/`applies_to` values found (unlike `products.status`) — [MISSING: `discounts.type` free-text, not constrained].
- RELATED UI: Checkout discount input.
- RELATED FLOW: checkout/pricing.
- CONFIDENCE: CONFIRMED.

### RULE-CHECKOUT-TOTAL — Checkout total computed entirely client-side [SEVERITY: HIGH]
- DESCRIPTION: Subtotal, tax, delivery fee, discount and grand total are all computed in the React client; nothing on the server recomputes or validates them before money changes hands or an order is persisted.
- TRIGGER: cart state changes / checkout page render / discount apply.
- ACTOR: customer.
- LOGIC: `useCart()` provides `subtotal`, `tax` (comment "18% GST" — computed inside `CartContext.tsx`, not re-verified line-by-line here [INFERRED location]), `total`; `Checkout.tsx:130`: `deliveryFee = subtotal >= 999 ? 0 : 99`; `finalTotal = total + deliveryFee - discountAmount` (`Checkout.tsx:131`). This `finalTotal` becomes the Razorpay order `amount` (`Checkout.tsx:156`) sent to `razorpay-create-order`, which only validates `amount>0` server-side (`razorpay-create-order/index.ts`) — no comparison to actual product prices/quantities in the DB. The same `finalTotal`/`subtotal`/`discount` values are re-sent as `order_data` to `razorpay-verify-payment`, which persists them verbatim to `orders` via service role.
- DATA READ: `items` from `CartContext` (client memory, itself populated from `products` fetched earlier — price could be stale if the seller changed it after the item was added to cart, since cart does not re-validate price at checkout time). [SECURITY-SENSITIVE — MEDIUM: no server-side price re-validation against current `products.price` at any point in the flow]
- DATA WRITTEN: `orders.subtotal/shipping_fee/discount/total`, `order_items.unit_price/total_price` (all client-supplied, service-role trusted).
- STATE CHANGE: none until payment; on payment success, `orders`/`order_items` rows are created with these client-supplied numbers.
- SUCCESS/FAILURE: see RULE-RAZORPAY-* below.
- SECURITY REQUIREMENT: **there is no authoritative server-side price/total computation anywhere in this system** — this is the single largest business-logic integrity gap in the checkout flow. [SEVERITY: HIGH — CONFIRMED]
- SOURCE FILE: `src/contexts/CartContext.tsx`, `src/pages/Checkout.tsx:130-195`, `supabase/functions/razorpay-create-order/index.ts`, `supabase/functions/razorpay-verify-payment/index.ts`.
- RELATED FLOW: checkout/payment.
- CONFIDENCE: CONFIRMED.

### RULE-DELIVERY-FEE — Free delivery threshold
- DESCRIPTION: Flat delivery fee waived above a subtotal threshold.
- LOGIC: `Checkout.tsx:130`: `subtotal >= 999 ? 0 : 99` (hardcoded constants, INR). Also surfaced as a UI nudge: "Add ₹{999-subtotal} more for FREE delivery!" (`Checkout.tsx:430-434`).
- SOURCE FILE: `src/pages/Checkout.tsx:130,430-434`.
- CONFIDENCE: CONFIRMED (hardcoded, not DB-configured — `delivery_zones` table has per-pincode `delivery_days`/`express_available` but is not consulted for the fee amount in the reviewed Checkout code path) [INFERRED gap: `delivery_zones` pincode-level rules and the flat ₹99/₹999 fee logic appear disconnected].

### RULE-PINCODE-DELIVERABILITY — Delivery zone lookup
- DESCRIPTION: `delivery_zones` table stores per-pincode `is_deliverable`, `delivery_days`, `express_available`; publicly readable (RLS "Anyone can view delivery zones", `qual:true`).
- ACTOR: anon/authenticated, via `LocationContext.tsx` (pincode-lookup flow, `pincode-lookup` edge function resolves city/state from India Post API, separate from the `delivery_zones` deliverability table).
- LOGIC: [UNKNOWN — exact consuming component not confirmed in this pass; likely a PDP/cart "check delivery to your pincode" widget]. `pincode-lookup` edge function itself does not query `delivery_zones` — it calls the external India Post API only; deliverability against `delivery_zones` appears to be a separate, unconfirmed code path. [MISSING/UNKNOWN — could not verify which UI component reads `delivery_zones`]
- CONFIDENCE: UNKNOWN (table + RLS confirmed; consuming business logic not located).

### RULE-CART — Cart is client-only, no server persistence of cart contents
- DESCRIPTION: Cart items live in `CartContext` (React state), not a DB table — no `cart_items`/`carts` table exists in the schema (`/tmp/extract/db.txt` table list has no such table).
- LOGIC: presumably `localStorage`-backed similar to `WishlistContext` (`WishlistContext.tsx:16,21` explicitly does; `CartContext.tsx` not fully re-verified here for its persistence mechanism, but no Supabase calls to a cart table exist anywhere in `code.txt`'s Supabase-call grep). [INFERRED for CartContext persistence mechanism]
- STATE CHANGE: cart is lost/local per browser; cross-device cart sync is not possible.
- SECURITY REQUIREMENT: none (no server trust boundary — cart is fully client-owned until checkout).
- CONFIDENCE: CONFIRMED (no DB cart table) / INFERRED (localStorage mechanism).

### RULE-WISHLIST — Wishlist is `localStorage`-only, not DB-backed
- DESCRIPTION: `WishlistContext.tsx:16` reads `localStorage.getItem('wishlist')`, `:21` writes back on change. No Supabase table for wishlist exists in the schema dump.
- STATE CHANGE: wishlist state never reaches the server; `/wishlist` route (`ProtectedRoute`) is gated by auth but the data itself isn't tied to `user.id` in any DB row.
- SECURITY REQUIREMENT: n/a — purely client state, not shared across devices, lost on cache clear.
- SOURCE FILE: `src/contexts/WishlistContext.tsx:16,21`.
- CONFIDENCE: CONFIRMED.

### RULE-RAZORPAY-CREATE-ORDER — Payment order creation
- DESCRIPTION: Creates a Razorpay order via Razorpay's REST API using merchant credentials.
- TRIGGER: `handlePayment()` in `Checkout.tsx:133` → `supabase.functions.invoke('razorpay-create-order', {amount:finalTotal, currency:'INR', receipt, notes})`.
- ACTOR: authenticated customer (any caller in practice — function itself is unauthenticated, `verify_jwt=false`, no internal `auth.getUser()` check).
- PRECONDITIONS: `amount > 0` (edge function's only validation, `razorpay-create-order/index.ts`).
- LOGIC: `POST https://api.razorpay.com/v1/orders` with Basic auth `RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET`, body `{amount: amount*100 (paise, INFERRED standard Razorpay convention — not independently re-verified byte-for-byte), currency, receipt, notes}`.
- DATA READ/WRITTEN: none in Postgres — pure external API proxy.
- SUCCESS: `{success:true, order_id, amount, currency, key_id}` → returned to browser, `key_id` also becomes the public Razorpay checkout widget key.
- FAILURE: `{success:false, error}`, HTTP 400 (validation) or 500 (Razorpay API error) — surfaced to user as a toast in `Checkout.tsx:267-273` ("Payment Error... Something went wrong").
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — MEDIUM] amount fully client-controlled and unauthenticated — anyone can create Razorpay orders of arbitrary amount against the merchant account (no financial loss without a real completed payment, but abuse/clutter risk in the Razorpay dashboard, and potential for order_id enumeration/spam).
- SOURCE FILE: `supabase/functions/razorpay-create-order/index.ts`, `src/pages/Checkout.tsx:152-169`.
- CONFIDENCE: CONFIRMED.

### RULE-RAZORPAY-VERIFY — HMAC signature verification + order persistence
- DESCRIPTION: Verifies the Razorpay payment via HMAC-SHA256, then (if `order_data` present) inserts `orders` + `order_items` using the service-role client.
- TRIGGER: Razorpay checkout widget's `handler` callback fires after the payer completes payment in the popup (`Checkout.tsx:205-244`) → `supabase.functions.invoke('razorpay-verify-payment', {razorpay_order_id, razorpay_payment_id, razorpay_signature, order_data})`.
- ACTOR: browser (post-payment callback) — unauthenticated at the HTTP layer.
- PRECONDITIONS: all three Razorpay fields present (400 otherwise).
- LOGIC (`razorpay-verify-payment/index.ts:9-34,68-150`): `expectedSignature = HMAC_SHA256(secret=RAZORPAY_KEY_SECRET, message="${orderId}|${paymentId}")`, hex-encoded, **string-equality compared** (`===`, not constant-time — `verifySignature`, lines 9-34) to `razorpay_signature`. If mismatch → 400 `{success:false}`. If match and `order_data` + service-role env vars present: generate `order_number = 'OGR' + Date.now().toString(36).toUpperCase()` (line 92) → INSERT into `orders` (service role, bypassing RLS): `customer_id: order_data.customer_id` (trusted, unauthenticated input), `seller_id: order_data.seller_id || order_data.customer_id` (**fallback to customer_id if no seller_id supplied**, line 100 — see RULE-ORDER-SELLER-FALLBACK), `subtotal/shipping_fee/discount/total: order_data.*` (trusted), `shipping_address: order_data.shipping_address` (trusted jsonb), `status:'new'`, `tracking_id: razorpay_payment_id`. If that insert fails → returns HTTP 200 `{success:true, payment_verified:true, order_saved:false, error:'Order save failed, please contact support'}` (lines 116-126). If it succeeds, then INSERTs `order_items` mapped from `order_data.items[]` (lines 132-150) — **if this second insert fails, the error is only `console.error`'d; the function still returns `order_saved:true` (based on the earlier `orders` insert success) with no indication to the client that items failed to save** (lines 143-150 — no `itemsError` propagated into the response at all).
- DATA READ: none (no DB read; no cross-check against `orders`/existing payment IDs, cart, or product prices).
- DATA WRITTEN: `orders` insert (service role); `order_items` insert (service role, best-effort).
- STATE CHANGE: `orders` row created with `status:'new'`.
- SUCCESS: `{success:true, payment_verified:true, order_saved:true, order_number, payment_id, order_id, db_order_id}`.
- FAILURE: signature mismatch → 400; missing fields → 400; unexpected exception → 500 generic; DB insert failure → 200 with `order_saved:false` (see 36 for the partial-state analysis).
- EXCEPTION/SECURITY REQUIREMENT: [SECURITY-SENSITIVE — HIGH] Because the function never calls `supabase.auth.getUser()`, there is no verification that the caller *is* `order_data.customer_id`. Combined with RULE-PRICING-DISCOUNT/RULE-CHECKOUT-TOTAL, this means: (a) financial fields are unauthenticated client input trusted into a permanent order record, (b) `customer_id` could be set to any UUID (impersonation risk for order attribution, though the order is still tied to a real successful Razorpay payment by *someone*), (c) not idempotent — no dedupe on `razorpay_payment_id`/`tracking_id`, so a client retry (e.g. network blip after Razorpay success) can create duplicate `orders` rows for the same payment (no unique constraint on `tracking_id` in the schema).
- SOURCE FILE: `supabase/functions/razorpay-verify-payment/index.ts:9-34 (signature), 88-150 (persistence)`; `src/pages/Checkout.tsx:205-244`.
- DATABASE SOURCE: `orders_status_check` CHECK (`new|accepted|packed|shipped|delivered|cancelled`); no unique constraint on `tracking_id`.
- RELATED UI: Checkout page, Order Confirmation page.
- RELATED FLOW: checkout/payment.
- CONFIDENCE: CONFIRMED.

### RULE-ORDER-SELLER-FALLBACK — `seller_id` defaults to `customer_id`
- DESCRIPTION: If the client omits `order_data.seller_id` (e.g. a multi-seller cart isn't split per-seller anywhere in the reviewed checkout flow — `orderData.items` in `Checkout.tsx:187-194` has no `seller_id` per item at all, and `orderData` itself never sets a top-level `seller_id`), the order's `seller_id` is set to the **customer's own user id** — a semantically incorrect placeholder, explicitly flagged in the function's own comment `// Fallback for now` (`razorpay-verify-payment/index.ts:100`).
- IMPACT: since `orders` RLS "Sellers can view/update orders for their products" matches on `seller_id IN (sellers.id WHERE user_id=auth.uid())`, and `sellers.id` is a distinct UUID from `auth.users.id`, setting `seller_id = customer_id` means **no real seller record will ever match this order via RLS** (unless a seller's `sellers.id` coincidentally equals a customer's `auth.uid()`, effectively impossible) — meaning orders placed through this flow are **invisible to any seller dashboard** since `Checkout.tsx` never actually supplies a real `seller_id`. [SECURITY-SENSITIVE / FUNCTIONAL BUG — HIGH: orders cannot be fulfilled by sellers as currently wired, since the checkout flow never determines which seller(s) own the cart's products and never passes a real `seller_id`]
- SOURCE FILE: `razorpay-verify-payment/index.ts:100`; `Checkout.tsx:172-195` (no seller_id ever constructed).
- CONFIDENCE: CONFIRMED (code); INFERRED (functional consequence for seller dashboards — not independently tested end-to-end).

### RULE-OTP-ISSUE — OTP generation, expiry, rate limit
- DESCRIPTION: 6-digit numeric OTP for Indian mobile login.
- TRIGGER: `send-otp` invocation with `{phone}`.
- PRECONDITIONS: `phone` matches `/^[6-9]\d{9}$/`.
- LOGIC: rate limit — reject (429) if the phone's most recent unverified OTP was created <60s ago; delete-then-insert pattern (removes prior unverified OTPs for the phone before creating a new one); OTP = `Math.floor(100000 + Math.random()*900000)` (**not CSPRNG** — `Math.random()`); stored value = `SHA256(otp+phone)` in `otp_verifications.otp_hash`; `expires_at = now()+5min`; `attempts:0`.
- DATA WRITTEN: `otp_verifications` insert (service role).
- SUCCESS: 200 `{success:true, ..., demoOtp: otp}` — **the plaintext OTP is included in the JSON response** (comment: "Remove in production"). [SECURITY-SENSITIVE — CRITICAL]
- FAILURE: 400 invalid phone, 429 rate-limited.
- SOURCE FILE: `supabase/functions/send-otp/index.ts:33-52` (rate limit), OTP generation/hash/storage (per `31_EDGE_FUNCTIONS.md`).
- CONFIDENCE: CONFIRMED.

### RULE-OTP-VERIFY — OTP verification, attempts cap, session creation
- DESCRIPTION: Verifies submitted OTP against the stored hash and, on success, creates/logs in a Supabase Auth user keyed by a synthetic email `${phone}@ogura.phone.auth`.
- TRIGGER: `verify-otp` invocation with `{phone, otp, name?}`.
- PRECONDITIONS: `otp` matches `/^\d{6}$/`; a non-expired `otp_verifications` row exists for the phone; `attempts < 5`.
- LOGIC (`verify-otp/index.ts:35-70`): fetch latest OTP row for phone (not filtered to unverified — `order by created_at desc limit 1`) → if none, 400; if `expires_at < now()`, delete row + 400 "expired"; if `!verified && attempts>=5`, delete row + 400 "too many attempts"; recompute `SHA256(otp+phone)`, compare to `otp_hash`; on mismatch, if `!verified`, `attempts+=1`, return 401; on match: look up existing auth user via `auth.admin.listUsers()` (full scan) matching `email===phoneEmail`. If found: `auth.admin.generateLink({type:'magiclink', email})` → `auth.verifyOtp({token_hash, type:'magiclink'})` to mint a session; update `profiles.name/phone` if `name` provided; mark `otp_verifications.verified=true` only after session established (or after confirming existing user if session creation degrades to `needsRefresh` fallback). If not found: create user via `auth.admin.createUser({email:phoneEmail, password:<32 random bytes hex>, email_confirm:true, user_metadata:{name,phone}})`, `profiles.upsert({id,name,phone})`, then same magic-link session flow; mark OTP verified.
- DATA READ: `otp_verifications` (latest per phone), `auth.users` (full `listUsers()` scan — O(n) — [SECURITY/PERF-SENSITIVE — MEDIUM]).
- DATA WRITTEN: `otp_verifications.attempts`/`verified`; `profiles.name/phone` (update or upsert); `auth.users` (new user via Admin API).
- SUCCESS: 200 `{success:true, session, user:{id,name,phone}}` or `{success:true, session:null, needsRefresh:true}` fallback.
- FAILURE: 400 (no OTP/expired/too many attempts), 401 (hash mismatch), 500 (session/user-creation errors).
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — HIGH] combined with `send-otp`'s plaintext `demoOtp` leak, this flow provides **no real authentication security** — anyone who knows a target phone number can self-serve the OTP and log in as that phone's existing account (account takeover) or create a new one.
- SOURCE FILE: `supabase/functions/verify-otp/index.ts` (full file reviewed above).
- DATABASE SOURCE: `otp_verifications` table (no RLS grants to anon/auth — service-role only); `profiles` table (written via service role here, and via `handle_new_user` trigger for standard email/password signups).
- RELATED FLOW: phone login (no confirmed UI call site found — see 32.3 gap).
- CONFIDENCE: CONFIRMED (code), UNKNOWN (which UI triggers it).

### RULE-PROFILE-CREATION — `handle_new_user` trigger
- DESCRIPTION: On any new `auth.users` row (any signup method), a matching `profiles` row is created/merged.
- TRIGGER: `AFTER INSERT ON auth.users` (standard Supabase pattern, trigger function `handle_new_user`).
- LOGIC: `INSERT INTO profiles(id,name,phone,email,avatar_url,is_onboarded) VALUES (NEW.id, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'User'), NEW.phone, NEW.email, raw_user_meta_data->>'avatar_url', false) ON CONFLICT (id) DO UPDATE SET name=COALESCE(EXCLUDED.name,profiles.name), email=COALESCE(...), avatar_url=COALESCE(...), updated_at=now();`
- DATA WRITTEN: `profiles` row, always `is_onboarded=false` on first creation.
- STATE CHANGE: new user always starts `is_onboarded=false`, driving the `/onboarding` redirect flow (see 34).
- SOURCE: `pg_proc.handle_new_user` (DB trigger, not app code).
- CONFIDENCE: CONFIRMED.

### RULE-ROLE-CHECK — `has_role()` / `useUserRole()` duality
- DESCRIPTION: Two independent role-check mechanisms exist: a DB-side SQL function `has_role(_user_id, _role)` used inside RLS policies (`SELECT EXISTS(SELECT 1 FROM user_roles WHERE user_id=_user_id AND role=_role)`), and a client-side React hook `useUserRole()` (`src/hooks/useUserRole.ts`) that fetches `user_roles` rows for the logged-in user and exposes `hasRole(role)`/`roles[]`.
- SECURITY REQUIREMENT: `has_role()` (DB) is the **only** trustworthy check — it backs every admin/seller RLS policy. `useUserRole()` (client) is **UI-gating only** (`RoleProtectedRoute.tsx`, `AdminLogin.tsx`) — it does not and cannot enforce anything; a user could bypass the route guard via devtools and still be blocked by RLS on the actual data operations, so the client hook is a UX convenience, not a security boundary. [CONFIRMED, consistent architecture]
- SOURCE FILE: `src/hooks/useUserRole.ts` (client), `pg_proc.has_role` (DB).
- CONFIDENCE: CONFIRMED.

### RULE-DEV-SELLER-FALLBACK — Hardcoded `DEV_SELLER_ID` fallback in seller dashboard
- DESCRIPTION: Several seller-dashboard pages hardcode a fallback seller UUID `07edb482-2c8e-4711-8cda-d2f3a87b790a` (`DEV_SELLER_ID`) used whenever the logged-in user has no matching row in `sellers` (`.select("id").eq("user_id",user.id).maybeSingle()` returns null) or when running unauthenticated/in dev.
- LOCATIONS: `DashboardAddProduct.tsx:30,53,57`, `DashboardDiscounts.tsx:33,54,58,87`, `DashboardProducts.tsx:32,42,46`, `DashboardSettings.tsx:12,44`.
- LOGIC: `setSellerId(DEV_SELLER_ID)` if `!user` (no auth), else `.then(({data}) => setSellerId(data?.id || DEV_SELLER_ID))` — i.e. **any authenticated user without a `sellers` row silently operates as this hardcoded seller** for product/discount CRUD in the dashboard.
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — HIGH] this is a development/testing convenience left in shipped code. Actual data writes still go through RLS (`products`/`discounts` INSERT/UPDATE policies require `seller_id IN (own sellers.id)`), so a real non-seller user attempting to write with `DEV_SELLER_ID` as `seller_id` will be rejected by RLS **unless** a `sellers` row with `id=07edb482-...` exists and is owned by a different `user_id` than the caller — in which case the write is simply rejected (RLS still checks `seller_id IN (SELECT sellers.id FROM sellers WHERE user_id=auth.uid())`, so `DEV_SELLER_ID` would only work for whichever real account actually owns that specific `sellers.id`). Net effect: this fallback causes confusing silent failures for any account without a linked `sellers` row (dashboard appears to load but writes will 42501/RLS-fail) rather than a direct security bypass — but it indicates the seller dashboard was built/tested against one fixed dev account and never hardened for the general case. [INFERRED functional consequence; SECURITY-SENSITIVE due to hardcoded UUID appearing in shipped bundle]
- CONFIDENCE: CONFIRMED (code presence), INFERRED (net security impact).

### RULE-VIRTUAL-TRYON — AI-based virtual try-on
- DESCRIPTION: Uploads a human photo + garment image to a third-party Hugging Face Space (`yisol-idm-vton`) running IDM-VTON, polls via SSE, returns a base64 composited image.
- TRIGGER: `useVirtualTryOn.ts:137` → `supabase.functions.invoke('virtual-tryon', {humanImageUrl, garmentImageUrl, garmentDescription})`.
- ACTOR: any caller (unauthenticated at the function level, `verify_jwt=false`).
- LOGIC (`virtual-tryon/index.ts`): if no `garmentImageUrl` → error; if no `humanImageUrl`, falls back to using the garment image as the "human" image (degenerate case, likely produces a nonsensical result — `line 34-36`); joins a Gradio queue (`POST {SPACE_URL}/queue/join`, `fn_index:2`, fixed params `denoise_steps:30, seed:42, auto-masking:true`), then reads Server-Sent Events from `{SPACE_URL}/queue/data` up to `MAX_WAIT_MS=90_000`; on `process_completed` with success, fetches the result image and re-encodes to base64 data URL; on quota/limit/rate errors or queue-full, returns `{success:false, loading:true}` (client is expected to retry/poll, per `useVirtualTryOn.ts` hook name implying polling); on timeout (`AbortError`), also returns `{loading:true}`.
- DATA WRITTEN: on success in the calling component, `tryon_history` insert from the browser (`VirtualTryOn.tsx:99,136`) storing `model_image_url, product_image_url, result_image_url, model_name, product_name` for the logged-in `user.id` (fetched via `supabase.auth.getUser()` just before insert).
- EXTERNAL CALL: Hugging Face Space, authenticated with `HUGGINGFACE_API_TOKEN` (server-side secret).
- FAILURE MODES: 503/429 from the Space → `{loading:true}` (soft-fail, retryable); any other non-OK → hard error message; malformed SSE JSON silently skipped (`try{JSON.parse}catch{continue}`).
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — LOW/MEDIUM] unauthenticated function holding a paid/rate-limited third-party API token — abuse could exhaust the HF quota; images are fetched by URL (SSRF-adjacent: the function will `fetch()` any URL supplied as `humanImageUrl`/`garmentImageUrl` and relay it to the HF Space, and separately `fetch()` whatever `fileUrl` the HF Space returns — no allowlist on either).
- CONFIDENCE: CONFIRMED.

### RULE-AI-RECOMMENDATIONS — Similar/brand/search/category product recommendations
- DESCRIPTION: Client sends the full candidate product catalog plus context to Gemini via the Lovable AI Gateway; the model returns a ranked list of product IDs.
- LOGIC: see `31_EDGE_FUNCTIONS.md §ai-recommendations` for full contract — reiterated here as a business rule: **the recommendation "engine" has no server-side product database of its own; ranking quality and correctness depend entirely on client-supplied `allProducts[]` and prompt engineering inside the edge function**, with a regex-based fallback extracting IDs if the model's JSON is malformed, defaulting to `[]` on total failure.
- SOURCE FILE: `supabase/functions/ai-recommendations/index.ts`; `src/services/recommendationService.ts:70-167`; `src/hooks/useRecommendations.ts`.
- CONFIDENCE: CONFIRMED.

### RULE-ALGOLIA-SYNC — Full catalog re-index
- DESCRIPTION: `sync-algolia` pushes DB products (service role) **plus large hardcoded demo/mock catalogs baked into the function file itself** into the `ogura-products` Algolia index under app id `KEBAEMMQPI`.
- SECURITY/DATA-INTEGRITY REQUIREMENT: mixing real DB products with hardcoded mock data in the same public search index is a data-integrity concern (customers may see fictitious/demo products as if real, or vice versa) — [INFERRED, based on function purpose description in `31_EDGE_FUNCTIONS.md`; exact mock-data boundary not independently line-audited in this pass due to file size (749 lines)].
- No confirmed trigger — not invoked from `src/**`; presumed manual/dashboard/cron-external trigger. [MISSING/UNKNOWN]
- CONFIDENCE: INFERRED for internal filtering logic; CONFIRMED for existence/purpose.

### RULE-SOCIAL-POST-WEBHOOK — "Share my design" → Make.com relay
- DESCRIPTION: Forwards a design/post payload to an external Make.com automation scenario for social publishing.
- LOGIC: requires `event`, `design.title`, `design.description`; no server-side truthfulness/ownership check that the "design" actually belongs to the caller or exists in the DB — pure relay. `supabase/functions/social-post-webhook/index.ts`.
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — LOW/MEDIUM] unauthenticated content-injection surface into the brand's own social automation.
- SOURCE FILE: `supabase/functions/social-post-webhook/index.ts`; `src/services/socialPostService.ts:82`.
- CONFIDENCE: CONFIRMED.

### RULE-SELLER-PROGRAM-WAITLIST — Brand waitlist submission
- DESCRIPTION: Public multi-field form (`brand_name, handle_or_website, what_you_make, city, brand_age, sell_channels[], monthly_orders?, phone`) insertable by anyone (`brand_waitlist_applications` RLS INSERT `{anon,authenticated}`, `with_check:true` — fully open, no CAPTCHA/rate-limit found).
- SOURCE FILE: `src/components/waitlist/WaitlistForm.tsx:82`, route `/seller-program` (`BrandWaitlist.tsx`).
- SECURITY REQUIREMENT: [SECURITY-SENSITIVE — LOW] open, unauthenticated insert with no spam protection — table could be flooded.
- CONFIDENCE: CONFIRMED.

### RULE-SELLER-APPLICATION-LEGACY — `seller_applications` open insert
- DESCRIPTION: Separate, simpler application table (`full_name, brand_name, email, phone, city, category, portfolio_link, sample_images, status`) also open to anon+authenticated INSERT with `with_check:true`, used by `SellerApply.tsx`/`JoinUs.tsx`. Distinct from the `sellers` table (which requires `auth.uid()=user_id` to insert) — [OBSERVED CONFLICT: two parallel "become a seller" data paths (`seller_applications` vs `sellers`) exist with different auth requirements and no code found reconciling/promoting a `seller_applications` row into a real `sellers` row]. [CONFLICT — likely represents two generations of the seller-onboarding feature; not resolved in code]
- CONFIDENCE: CONFIRMED (schema/RLS), INFERRED (product-history explanation for the duplication).

---

## Rules enforced ONLY client-side (no DB constraint, trigger, or server re-check)

1. **Entire checkout total math** (subtotal/tax/delivery-fee/discount/grand-total) — RULE-CHECKOUT-TOTAL. No server recomputation anywhere.
2. **Discount code eligibility (usage limit, min purchase, active window) and amount calculation** — RULE-PRICING-DISCOUNT. Checked once in the browser at "Apply" time; never re-validated at order-persistence time; `usage_count` never incremented.
3. **Free-delivery ₹999 threshold and ₹99 flat fee** — hardcoded constants in `Checkout.tsx`, no DB config, no server check.
4. **Cart contents and quantities** — never validated server-side against `product_variants.stock_quantity` or `products.price` at checkout time (no stock decrement logic found anywhere — see `35_BACKGROUND_JOBS.md` "stock reservation" MISSING entry).
5. **`order_data.customer_id`/`seller_id` correctness** — `razorpay-verify-payment` trusts these values completely; no auth check ties them to the actual caller.
6. **Product moderation workflow ordering** (`draft→submitted→under_review→live`) — only the *value set* is DB-enforced (CHECK constraint); the *sequence/actor* is a UI convention only (sellers technically retain UPDATE rights to set their own `status` to `live` directly).
7. **Role-gated route access via `useUserRole()`/`RoleProtectedRoute`** — a UX convenience; the real boundary is DB RLS (`has_role()`), which is correctly independent, but the *route guard itself* is bypassable in the browser without consequence beyond seeing a UI a user can't actually use.
8. **OTP resend cool-down UX messaging** beyond the server's own 60s check (client likely also disables the button — not verified — server-side 60s check is real, so this one is *server*-enforced too, listed here only to note the client UX layer is not the security boundary).
9. **`sync-algolia` result correctness (live-only)** — believed to filter server-side but not independently confirmed to a byte-for-byte guarantee within this review; if it does not, search results become a client-invisible bypass of `products` RLS.

CONFIDENCE overall: most CONFIRMED via direct source citation; a handful of items are INFERRED or UNKNOWN and are explicitly flagged inline above (notably: `sync-algolia`'s exact WHERE clause, `send-otp`/`verify-otp` UI call sites, `delivery_zones` consuming logic, `CartContext` tax/persistence internals not independently re-read line-by-line in this pass).
