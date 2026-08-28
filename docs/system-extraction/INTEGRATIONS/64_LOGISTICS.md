# 64 — Logistics: Delivery & Location

## delivery_zones table
Migration `20260121081121_46cf0a09-d885-4281-a0a6-2037456b40d7.sql` creates `public.delivery_zones (id, pincode UNIQUE, city, state, is_deliverable, delivery_days, express_available, created_at)`, RLS: public SELECT for everyone. Seeded with ~19 hardcoded major-city pincodes (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Ahmedabad, Pune, Jaipur, Lucknow, Nagpur, Kochi, Bhubaneswar). [CONFIRMED] Any pincode not in this seed list is, by construction, absent from the table — component behavior for "unknown pincode" governs whether that's treated as non-deliverable or unchecked (see DeliveryChecker below).

## DeliveryChecker component
`src/components/DeliveryChecker.tsx` — calls `checkDelivery(pincode)` from `LocationContext`, auto-triggers when `location.pincode` changes, debounced by requiring exactly 6 digits before checking. Renders a compact and full variant. The actual delivery-eligibility query logic lives in `LocationContext` (queries `delivery_zones` by pincode — implementation not fully re-read in this pass beyond the component's consumption of `checkDelivery`/`DeliveryInfo`).

## pincode-lookup edge function
`supabase/functions/pincode-lookup/index.ts` — validates 6-digit format, calls `https://api.postalpincode.in/pincode/{pincode}` (India Post public API, no key), returns `{city, state, country, postOfficeName}`. This is for **address auto-fill**, separate from `delivery_zones` (deliverability check). Two independent pincode paths exist: one for "can we ship here" (delivery_zones, DB-backed, ~19 rows) and one for "what's this pincode's city/state" (India Post API, comprehensive/live).

## ip-geolocation edge function
`supabase/functions/ip-geolocation/index.ts` — reads `x-forwarded-for`/`x-real-ip`, queries `http://ip-api.com/json/{ip}` (plain HTTP, no key, 45 req/min free tier), falls back to hardcoded `Delhi, Delhi, India` on any failure or private/local IP. Used to pre-populate `LocationContext` on first visit before the user manually confirms/changes location.

## LocationContext
`src/contexts/LocationContext.tsx` — central provider wrapping the app (`App.tsx`); manages `location`, `selectedAddress`, `showAddressModal`, `showManualSelector`, and exposes `checkDelivery()`. Coordinates IP geolocation (initial guess) → `ManualLocationSelector`/`LocationPermissionModal` (user override) → `pincode-lookup` (address-form autofill) → `delivery_zones` (shippability check) → `DeliveryChecker`/`HeaderLocationIndicator` (UI surfaces).

## Address management
`user_addresses` table (migration `20260121083507_...sql`): `id, user_id, full_name, mobile, pincode, address_line, city, state, landmark, address_type ('home'|'work'), is_default, timestamps`. RLS scoped to `auth.uid() = user_id`. Managed via `AddressForm.tsx`, `AddressCard.tsx`, `AddressSelectionModal.tsx`.

## Shipping fee rules
[CONFIRMED, CLIENT-SIDE ONLY] `src/pages/Checkout.tsx:128`: flat rule — `subtotal >= 999 ? 0 : ₹99`. No zone-based, weight-based, or carrier-rate-based shipping calculation exists; the `delivery_days`/`express_available` columns in `delivery_zones` are informational only (shown to the user) and **do not feed into the actual shipping fee charged** — [CONFLICT] a zone marked non-`express_available` or with 5-day delivery is charged the same flat fee as a 2-day express zone.

## Courier/tracking fields on orders
`orders.tracking_id` — [CONFIRMED] **repurposed to store the Razorpay payment ID** (`razorpay-verify-payment/index.ts:105`: `tracking_id: razorpay_payment_id`), not a courier AWB/tracking number. `shipping_carrier` — [UNKNOWN/not located]: no column named `shipping_carrier` was found in the migrations reviewed; if referenced in seller-dashboard order UI it would currently have no backing schema confirmed in this pass. No courier/logistics-provider API integration (Shiprocket, Delhivery, etc.) exists anywhere in the codebase. **Carrier integration: [MISSING].**
