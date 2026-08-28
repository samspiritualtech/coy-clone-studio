# 20 — FRONTEND DATA FETCHING

## 1. Supabase `from()` call sites

| File:Line | Table | Op | Trigger | Fields | Auth req | RLS reliance |
|---|---|---|---|---|---|---|
| src/contexts/AuthContext.tsx:73-77 | profiles | SELECT | on session change | `*` by id | session required | RLS: user reads own profile [INFERRED] |
| src/contexts/AuthContext.tsx:175-181 | sellers | INSERT | signUpWithEmail | user_id, brand_name, city, seller_type, application_status:'approved' | authenticated (post-signup) | [SECURITY-SENSITIVE] client sets `application_status:'approved'` directly — depends entirely on RLS/insert policy to not trust this column, otherwise self-approval |
| src/contexts/AuthContext.tsx:184-187 | user_roles | INSERT | signUpWithEmail | user_id, role:'seller' | authenticated | [SECURITY-SENSITIVE] client-assigned role; RLS must restrict insertable roles or any signup could self-assign `admin` if the value were attacker-controlled (here hardcoded to 'seller', so limited, but pattern is risky) |
| src/contexts/AuthContext.tsx:205-208 | profiles | UPDATE | completeOnboarding() | is_onboarded:true, updated_at | authenticated | RLS: `auth.uid()=id` presumed |
| src/components/waitlist/WaitlistForm.tsx:82 | brand_waitlist_applications | INSERT | form submit | brand_name, handle_or_website, what_you_make, city, brand_age, sell_channels, monthly_orders, phone | public/unauthenticated (marketing form) | RLS presumably public INSERT-only |
| src/components/seller-dashboard/pages/DashboardProducts.tsx:45 | sellers | SELECT (id) | dashboard mount | id by user_id | authenticated | RLS: sellers self-select |
| src/components/seller-dashboard/pages/DashboardDiscounts.tsx:57 | sellers | SELECT (id) | dashboard mount | id | authenticated | same |
| src/components/seller-dashboard/pages/DashboardAddProduct.tsx:56 | sellers | SELECT (id) | form mount | id | authenticated | same |
| src/components/seller-dashboard/pages/DashboardAddProduct.tsx:101 | products | INSERT | add-product submit | full product row incl. price, images, category, etc. | authenticated seller | RLS policy "Sellers can insert own products" WITH CHECK seller_id ownership [CONFIRMED db.txt:290] |
| src/components/VirtualTryOn.tsx:99,136 | tryon_history | INSERT | after virtual try-on generation | user id + result reference | authenticated | RLS [UNKNOWN, not in excerpt] |
| src/pages/Checkout.tsx:78-114 (handleApplyDiscount) | discounts | SELECT `*` | user clicks "Apply" | filter by code, status='active' | any (client reads full discount row incl. usage_limit, min_purchase) | RLS: presumably public SELECT of active discounts — [SECURITY-SENSITIVE] client fetches full row and does eligibility math itself (usage_limit, min_purchase, percentage calc) rather than server validating; a modified client could apply invalid/expired/ineligible codes if RLS doesn't also enforce at write time downstream |
| src/pages/SellerApply.tsx:73 | seller_applications | INSERT | application submit | applicant fields (as any cast — no generated types) | public/unauthenticated | RLS [UNKNOWN] |
| src/pages/JoinUs.tsx:125 | seller_applications | INSERT | application submit | applicant fields | public/unauthenticated | RLS [UNKNOWN] |
| src/pages/seller/SellerAddProduct.tsx:157 | products | INSERT | add-product submit (alt page) | product row | authenticated seller | same RLS as above |
| src/hooks/useDesigners.ts:6-43 | designers | SELECT | list/detail pages | filtered/by id | public | RLS: public read presumably |
| src/hooks/useDesignerProducts.ts:12-88 | products (+categories) | SELECT | designer storefront | filtered by designer_id, paged | public | RLS "Anyone can view live products" (status='live' AND is_available=true) [CONFIRMED db.txt:286] |
| src/hooks/useDesignerBySlug.ts:6 | designers | SELECT | designer page by slug | by slug | public | public read |
| src/components/LoveOguraSection.tsx:17-18 | influencer_videos | SELECT | homepage mount | video rows | public | public read |
| src/pages/Collections.tsx (supabase import) | products (implied, alongside external API merge) | SELECT | PLP mount | product rows merged with `staticProducts` and external API | public | public read |

## 2. Supabase `storage` call sites
| File:Line | Bucket | Op | Notes |
|---|---|---|---|
| src/pages/seller/SellerAddProduct.tsx:113,122 | product-images | upload + getPublicUrl | seller product image upload |
| src/pages/SellerApply.tsx:51,53 | product-images | upload + getPublicUrl | seller application proof image |
| src/pages/JoinUs.tsx:108,110 | product-images | upload + getPublicUrl | join-us application image |
| src/hooks/useVirtualTryOn.ts:110,116 | tryon-images | upload + getPublicUrl | user-uploaded try-on photo |
| src/components/seller-dashboard/pages/DashboardAddProduct.tsx:76,78 | product-images | upload + getPublicUrl | seller dashboard product image |

All uploads use **public bucket + `getPublicUrl()`**, no signed URLs observed — file paths become guessable/public once uploaded; no explicit content-type/size validation visible at these call sites in this pass [UNKNOWN — needs code body inspection to confirm].

## 3. Supabase `functions.invoke` (edge functions) call sites
| File:Line | Function | Trigger | Input | Purpose |
|---|---|---|---|---|
| src/services/socialPostService.ts:82 | social-post-webhook | social share action | post payload | pushes social post webhook |
| src/services/recommendationService.ts:70,108,138,167 | ai-recommendations | various recommendation widgets | user/context params | product recommendations |
| src/services/recommendationService.ts:196 | image-analysis | image-based search/recs | image data | visual analysis |
| src/contexts/LocationContext.tsx:76 | ip-geolocation | mount, silent location detect | none | IP → city/state |
| src/contexts/LocationContext.tsx:325 | pincode-lookup | delivery checker / address form | pincode | city/state/deliverability lookup |
| src/hooks/useVirtualTryOn.ts:137 | virtual-tryon | user starts try-on | model image + garment image URLs | AI try-on generation |
| src/pages/Checkout.tsx:152 | razorpay-create-order | user clicks pay | amount, currency, receipt, notes | creates Razorpay order server-side |
| src/pages/Checkout.tsx:208 | razorpay-verify-payment | Razorpay handler callback | razorpay_order_id/payment_id/signature + full `order_data` (customer_id, subtotal, shipping_fee, discount, total, shipping_address, items[]) | **Server-side signature verification AND the actual `orders`/`order_items` INSERT happens inside this edge function** (client only assembles the payload) — this is the correct pattern: monetary totals are computed client-side (Checkout.tsx `finalTotal = total + deliveryFee - discountAmount`) and merely **passed** to the edge function, not authoritative unless the edge function recomputes/re-validates server-side [UNKNOWN whether razorpay-verify-payment recomputes totals — flagged in findings] |
| src/pages/PinterestCallback.tsx:26 | pinterest-token-exchange | OAuth callback | auth code | exchanges Pinterest code for token |

## 4. Raw `fetch()` to external services
| File:Line | Endpoint | Purpose | Auth | Error handling |
|---|---|---|---|---|
| src/pages/ProductDetail.tsx:108 | `https://pyesltzkemtranachpne.supabase.co/functions/v1/products` | fetch external "Seller Center" product catalog for a single product's detail merge | none observed (no auth header) | [UNKNOWN — needs body inspection] |
| src/pages/Collections.tsx:25 (`EXTERNAL_API_URL`) | same endpoint | fetch full external product catalog for PLP, merged with `staticProducts` | none | maps external shape via helper |
| src/lib/brandStores.ts:3,25-49 (`EXTERNAL_API_URL`, `mapApiProduct`) | same endpoint | builds brand/store pages from an external, cross-project Seller Center API (different Supabase project id than this app's own backend — `pyesltzkemtranachpne` vs this project's own ref) [SECURITY-SENSITIVE — cross-tenant data dependency, no visible auth, response shape defensively coerced with `??`/fallbacks suggesting an unstable/loosely-typed contract] | none | defensive `?? / \|\|` fallbacks throughout `mapApiProduct`, placeholder image fallback `/placeholder.svg` |
| src/components/PinterestBoardModal.tsx:41 | `https://api.pinterest.com/v5/boards/{board.id}/pins?page_size=25` | fetch board pins for "connect Pinterest" UX | uses `pinterest_token` from localStorage (Bearer) [INFERRED] | [UNKNOWN] |
| src/lib/algoliaClient.ts | Algolia REST via `algoliasearch/lite` client, index `ogura-products` | product search (Search.tsx, Header search dropdowns) | Algolia public search-only API key (embedded client-side; by design lite/search keys are safe to expose) [OBSERVED] | handled by InstantSearch internals |
| Checkout.tsx (script tag, not fetch) | `https://checkout.razorpay.com/v1/checkout.js` | loads Razorpay JS SDK | none | onload sets `razorpayLoaded` |

## 5. Summary tables

### Reads by table
`profiles, sellers, discounts, designers, products, product_variants (via RLS-visible join), influencer_videos, tryon_history (implied read on history page, not directly grepped)`.

### Writes by table
`sellers (INSERT — signup auto-seller), user_roles (INSERT — signup auto-role), profiles (UPDATE — onboarding), brand_waitlist_applications (INSERT), products (INSERT — seller add-product, two separate pages), tryon_history (INSERT), seller_applications (INSERT ×2 pages)`. **No direct client-side INSERT to `orders` or `order_items` was found** — those are created inside the `razorpay-verify-payment` edge function only (server-side), per Checkout.tsx:208 and RLS policy "Customers can create orders" (`auth.uid()=customer_id`, db.txt:274) which exists presumably for the edge function's use of the user's JWT context or a service-role bypass [UNKNOWN which].

### Edge functions invoked from client
`ai-recommendations, image-analysis, ip-geolocation, pincode-lookup, virtual-tryon, razorpay-create-order, razorpay-verify-payment, pinterest-token-exchange, social-post-webhook`. Not invoked directly from client (server/cron only, per supabase/functions listing): `generate-banner-image, mcp, send-otp, verify-otp, sync-algolia` [OBSERVED — no client call sites found for these five].

### External endpoints
`https://pyesltzkemtranachpne.supabase.co/functions/v1/products` (external Seller Center API, 3 call sites), Algolia (`*.algolia.net` via SDK), `api.pinterest.com/v5`, `checkout.razorpay.com` (SDK script), Cloudinary/Pexels/Unsplash (static media only, see doc 18).

## 6. Findings — frontend operations that should be server-side only

1. **[HIGH] Discount/coupon validation and amount computation performed entirely client-side.** Evidence: Checkout.tsx:78-121 — reads full `discounts` row via `supabase.from("discounts").select("*")`, then client JS checks `usage_limit`, `min_purchase`, and computes `amount` for percentage/fixed/free-shipping types, storing `discountAmount`/`appliedDiscount` in component state. Nothing forces the edge function to recompute or verify the discount server-side beyond whatever `razorpay-verify-payment` may (not confirmed) trust. A tampered client could send an arbitrary `discount` value inside `order_data` (Checkout.tsx:161-181, `discount: Math.round(discountAmount)`), and if the edge function doesn't recompute the discount from the DB and only uses the client-provided `total`, this is a direct pricing-integrity risk.

2. **[HIGH] Order total (`finalTotal`) is computed client-side** (Checkout.tsx:132-133, `deliveryFee`, `finalTotal = total + deliveryFee - discountAmount`) and passed both to `razorpay-create-order` (used to set the actual charge amount, line 152-166) and again inside `order_data.total` to `razorpay-verify-payment` (line 161-181). If `razorpay-create-order` uses the client-supplied `amount` as-is to create the payment order without recomputing from server-held cart/product prices, a modified client can pay less than the real cart total. Evidence: amount field sent directly from `finalTotal` with no server-side product-price lookup visible from the client code path.

3. **[MEDIUM] `unit_price`/`total_price` per line item are taken from client state** (Checkout.tsx: `items.map(item => ({... unit_price: Math.round(item.product.price) ...}))`), i.e., `item.product.price` originates from whatever product data the client currently has loaded (which could itself be stale/tampered if sourced from the cart's localStorage-persisted `product` object — see doc 19 CartContext, which stores full product objects in localStorage). If the edge function trusts these values instead of re-querying `products` by `product_id`, an attacker could edit `localStorage['cart']` to lower `product.price` before checkout.

4. **[MEDIUM] Client-side auto-creation of seller identity and role at signup** (AuthContext.tsx:175-187) — writing `application_status:'approved'` and `role:'seller'` from the browser during self-signup bypasses any human/automatic vetting workflow implied by the existence of a separate `seller_applications` review table (SellerApply.tsx, JoinUs.tsx). This creates two parallel, inconsistent seller-onboarding paths: one instant/self-approved (AuthContext), one application-based (`seller_applications`).

5. **[LOW-MEDIUM] External Seller Center API calls with no visible authentication** to `https://pyesltzkemtranachpne.supabase.co/functions/v1/products` from `Collections.tsx`, `ProductDetail.tsx`, `brandStores.ts` — cross-project data fetch merged directly into product listings/detail pages; if that endpoint is unauthenticated and mutable state ever gets derived from it (e.g., price display), it constitutes an external trust dependency outside this app's own RLS/edge-function boundary.

**Note:** actual `orders`/`order_items` table writes were not found client-side (good practice — confirmed done inside `razorpay-verify-payment` edge function, consistent with RLS policy `orders` INSERT `auth.uid()=customer_id` at db.txt:274, and order_items INSERT policy scoped to owning order at db.txt:257-259). The remaining risk is whether that edge function **re-derives** amounts/discounts from trusted server data or **trusts the client-supplied `order_data` verbatim** — the edge function's internal logic was not in the extracted `code.txt`/`db.txt` facts available to this document and is marked **[UNKNOWN — verify supabase/functions/razorpay-verify-payment/index.ts server-side logic directly]**.
