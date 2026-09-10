# 61 — Payment Extraction (Razorpay)

## Components involved
- `src/pages/Checkout.tsx` — client-side cart total math, discount application, Razorpay Checkout.js invocation.
- `supabase/functions/razorpay-create-order/index.ts` — creates a Razorpay order server-side.
- `supabase/functions/razorpay-verify-payment/index.ts` — verifies HMAC signature and writes `orders`/`order_items` rows using the **service role key**.
- `discounts` table (migration `20260312041856_...sql`) — coupon validation.

## Full trace: CUSTOMER → CART → TOTAL → PAYMENT ORDER → PROVIDER → VERIFICATION → ORDER → INVENTORY → SELLER SPLIT → LEDGER → REFUND/PAYOUT

| Step | Status | Evidence |
|---|---|---|
| CUSTOMER adds to cart | [CONFIRMED] | `CartContext` (not fully re-read here, referenced via `useCart()` in Checkout.tsx:38) |
| CART → subtotal/tax/total | [CONFIRMED] | `Checkout.tsx:38` destructures `subtotal, tax, total` from `useCart()`. Computed **entirely client-side** in the cart context. |
| Delivery fee rule | [CONFIRMED] | `Checkout.tsx:128`: `const deliveryFee = subtotal >= 999 ? 0 : 99;` — hardcoded threshold, **client-side only**, not re-validated on server. |
| Discount code validation | [CONFIRMED, partially server-checked] | `Checkout.tsx:76-121` queries `discounts` table directly from the **browser** using the anon key (`supabase.from("discounts").select(...)`), checks `status`, `usage_limit` vs `usage_count`, `min_purchase`. This is a **read** against real DB data (good), but the *discount amount calculation* (`amount = subtotal * value/100` etc.) happens **in the browser** (`Checkout.tsx:104-113`) and that computed `discountAmount` is what gets sent onward — never recomputed/verified server-side. |
| `finalTotal` computation | [CONFIRMED — CLIENT-SIDE, SEVERITY: HIGH] | `Checkout.tsx:129`: `const finalTotal = total + deliveryFee - discountAmount;`. This is the amount sent to `razorpay-create-order` as `amount`. **No server-side recomputation of price from authoritative product prices, quantities, or discount rules exists anywhere in the payment path.** |
| PAYMENT ORDER creation | [CONFIRMED] | `Checkout.tsx:153-165` invokes edge function `razorpay-create-order` with `{ amount: finalTotal, currency, receipt, notes }`. The edge function (`razorpay-create-order/index.ts:34`) only checks `amount > 0` — **it does not know or check what's actually in the cart**, it trusts whatever number the browser sends. [SECURITY-SENSITIVE — HIGH SEVERITY: a modified client can request a Razorpay order for any positive amount, e.g. ₹1, regardless of real cart value.] |
| PROVIDER (Razorpay) | [CONFIRMED] | Order created via Basic-auth POST to `https://api.razorpay.com/v1/orders`, amount converted to paise (`Math.round(amount*100)`). Razorpay Checkout.js widget opened client-side with `order_id`, `key_id` (public). |
| VERIFICATION | [CONFIRMED — CORRECTLY IMPLEMENTED] | `razorpay-verify-payment/index.ts:11-30` implements HMAC-SHA256 over `${order_id}|${payment_id}` using `RAZORPAY_KEY_SECRET`, comparing hex digest to `razorpay_signature` from the client. This is the **correct** Razorpay verification algorithm and is done server-side — this part is sound. |
| ORDER creation in DB | [CONFIRMED] | On valid signature, `razorpay-verify-payment/index.ts:95-109` inserts into `orders` using the **service-role client**, with fields `order_number` (`OGR${Date.now().toString(36).toUpperCase()}` — see idempotency note below), `customer_id`, `seller_id` (falls back to `customer_id` if not provided — **data-integrity bug**, see below), `subtotal`, `shipping_fee`, `discount`, `total`, `shipping_address`, `status: 'new'`, **`tracking_id: razorpay_payment_id`** — confirms the brief's note: **the `tracking_id` column is repurposed to store the Razorpay payment ID, not a courier tracking number.** [CONFIRMED, SEVERITY: schema/semantic conflict — `tracking_id` cannot later hold a real courier AWB without a new column or overwriting the payment reference]. |
| order_items insert | [CONFIRMED] | `razorpay-verify-payment/index.ts:127-142` inserts `order_items` rows (`product_id, quantity, unit_price, total_price, size, color`) from **client-supplied `order_data.items`**, again unverified against server-side product records — prices come straight from the browser's cart state. [SECURITY-SENSITIVE — client-controlled `unit_price`/`total_price` are trusted verbatim and stored as the order-of-record even though the *payment amount* was separately (and also client-controlled) sent to Razorpay; the two numbers are never cross-checked against each other or against the `products` table price.] |
| INVENTORY decrement | [MISSING] | No stock/inventory decrement call exists in `razorpay-verify-payment`. No reference to a `product.stock` or `inventory` update anywhere in the payment path. |
| SELLER SPLIT / commission | [MISSING] | `seller_id` is naively set to `order_data.seller_id || order_data.customer_id` (a customer ID used as a seller ID fallback — clear bug/placeholder), and no per-item seller attribution, no commission percentage, no split calculation exists. Multi-seller carts are not handled — the whole order is written with a single `seller_id`. |
| LEDGER | [MISSING] | No `ledger`, `transactions`, or `payments` table found in migrations; the only durable record of a successful charge is the `orders.tracking_id` field holding the Razorpay payment ID string. There is no dedicated payments/ledger table to reconcile against Razorpay settlement reports. |
| RECONCILIATION | [MISSING] | No scheduled job, edge function, or webhook reconciles Razorpay's records against `orders`. The **only** confirmation of payment success is the one-time client → `razorpay-verify-payment` call triggered by the Checkout.js JS `handler` callback. |
| REFUNDS / partial refunds | [MISSING] | No `razorpay-refund` (or similarly named) edge function exists. No refunds/credit-note table. No UI action anywhere calls Razorpay's refund API. |
| SELLER SETTLEMENTS / PAYOUTS | [MISSING] | `DashboardTransfers.tsx` exists under seller-dashboard pages (name suggests payout UI) but no server-side payout/settlement processing code, no payout table, and no bank-transfer or Razorpay Route/X integration was found. [Recommend inspecting `DashboardTransfers.tsx` directly if payout UI copy needs auditing — likely displays static/mock data]. |

## Idempotency & Retry / Failure & Partial-State Paths
- **Idempotency**: [MISSING]. `razorpay-create-order` generates a `receipt` from `Date.now()` client-side and accepts whatever `amount` is passed with no idempotency key check; a user could double-click "Pay" and create two Razorpay orders for the same cart (Razorpay itself would still require two separate successful payments, limiting duplicate-charge risk, but duplicate **order rows** in the DB are possible if `razorpay-verify-payment` is called twice for genuinely different order_ids from a retried flow).
- **Partial-state / "payment succeeded but order not saved"**: [CONFIRMED — EXPLICITLY HANDLED BUT UNRESOLVED]. `razorpay-verify-payment/index.ts:112-125`: if the `orders` insert fails after signature verification succeeds, the function returns `success: true, payment_verified: true, order_saved: false, error: 'Order save failed, please contact support'`. **This is a known, acknowledged partial-failure state with no automated recovery path** — the customer has been charged, Razorpay has the money, but no order exists in the DB; resolution is manual ("contact support"). [SECURITY/BUSINESS-SENSITIVE — money collected with no corresponding order].
- **Retry**: [MISSING] no automatic retry of the `orders` insert, no dead-letter queue, no alerting hook on this failure branch (see 73_MONITORING_LOGGING.md).
- **Timeout**: neither Razorpay function sets an explicit fetch timeout; relies on Deno/undici defaults.

## Client-controlled monetary fields — trust audit

| Field | Where computed | Sent by client to | Server re-validates? | Trust verdict |
|---|---|---|---|---|
| `subtotal` | CartContext (client) | razorpay-create-order (indirectly via `finalTotal`), razorpay-verify-payment (`order_data.subtotal`) | No | **Untrusted, but stored as-is** |
| `deliveryFee` | `Checkout.tsx:128` (client, hardcoded ₹999 free-ship threshold) | both functions | No | **Untrusted** |
| `discountAmount` | `Checkout.tsx:104-113` (client computes % / flat / free-shipping value from a real `discounts` row, but the arithmetic itself is client-side) | both functions | No — the discount **row** is validated (`status`, `usage_limit`, `min_purchase`), but the **derived rupee amount** is not recomputed server-side | **Partially trusted** (code is real, math is not re-verified) |
| `finalTotal` / `amount` sent to Razorpay | `Checkout.tsx:129` | `razorpay-create-order` | Only checked for `> 0` | **Untrusted — HIGH SEVERITY**: this is the literal amount charged to the customer's card/UPI, fully attacker-controllable via browser devtools/API replay. |
| `order_data.items[].unit_price` / `total_price` | Cart item state (client) | `razorpay-verify-payment` | No — inserted verbatim into `order_items` | **Untrusted — HIGH SEVERITY**: the permanent order record's pricing is whatever the browser claims, not the live `products.price`. |
| `order_data.total` | client | `razorpay-verify-payment` → `orders.total` | No | **Untrusted** |
| Discount `usage_count` increment | — | — | [MISSING] no evidence the edge function increments `discounts.usage_count` after a successful order, so the `usage_limit` check is likely **not actually enforced across multiple orders** (a coupon could be reused past its limit) [CONFLICT with intended discount-limit feature]. |

## Overall severity summary
[SECURITY-SENSITIVE — CRITICAL]: The **entire order amount and line-item pricing is client-authoritative**. Razorpay's HMAC signature only proves that *a* payment of *some* amount was completed and matches the order Razorpay itself created — but that Razorpay order's amount was itself set from an unchecked client value. An attacker can:
1. Add high-value items to cart.
2. Intercept/modify the `amount` sent to `razorpay-create-order` to a trivial value (e.g. ₹1).
3. Pay the trivial amount, get a valid Razorpay signature for that trivial-amount order.
4. Submit the *original* high-value `order_data.items` to `razorpay-verify-payment`, which will insert them as a legitimate paid order because verification only checks the signature math, not that the paid amount matches the items' total.

This is a full payment-bypass vulnerability given the current code. Recommend server-side price recomputation from the `products` table before both order creation and verification — currently [MISSING].
