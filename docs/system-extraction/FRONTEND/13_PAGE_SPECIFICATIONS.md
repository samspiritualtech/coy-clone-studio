# 13 — Page Specifications

Scope: every file under `src/pages/**` (48 files). Depth is concentrated on the pages named in the brief; remaining static/utility pages get shorter but specific entries. All facts cross-reference 10/11/12; new detail here comes from direct reads of the page source files. Tags: [CONFIRMED] read from source, [OBSERVED] inferred from code but not runtime-tested, [INFERRED] reasonable deduction, [UNKNOWN]/[MISSING] absent, [CONFLICT] contradicts runtime probe or another doc, [SECURITY-SENSITIVE].

---

## Index (`src/pages/Index.tsx`) — `/`
- **Purpose**: Customer marketing homepage. **User type**: public.
- **Entry**: default landing route, nav logo, most internal links. **Exit**: every section links deeper (collections, category, designers, stores).
- **Structure (render order)** [CONFIRMED]: `LuxuryHeader` → `LuxuryHero` → `Premium3DCategorySection` → `SellerNewArrivals` → museum-themed wrapper `<div className="museum-surface">` (mouse-tracked gradient via `onMouseMove` setting CSS vars `--mx/--my`) containing `HiddenGemsSection`, `CategoryShowcase`, `DesignersSpotlight`, `LuxuryTrustBadges`, `LuxuryBrands`, `LuxuryGiftCard`, `LuxuryStoreLocator` → `LuxuryFooter`.
- **Forms**: none directly (children may have their own, e.g. `LuxuryGiftCard`, waitlist widgets — see 14).
- **Buttons**: none at this level; all CTAs are inside child components.
- **Modals/drawers/tabs**: none at this level.
- **Loading/empty/error**: none — page itself renders synchronously; children (`SellerNewArrivals`) fetch their own data and manage their own states [OBSERVED].
- **Auth/authz**: none; fully public.
- **Data sources**: none owned by `Index` itself; delegates entirely to children.
- **Mutations**: none.
- **URL/query params**: none read.
- **Side effects**: `useLenis()` initializes smooth-scroll (GSAP/Lenis) for the whole page; mousemove handler on the museum wrapper mutates inline CSS custom properties (`el.style.setProperty`) — a DOM side effect outside React state.
- **Responsive/mobile**: relies on Tailwind responsive classes inside each child; no page-level breakpoint logic.
- **SEO metadata**: [MISSING] — no `<title>`/meta tag management via `react-helmet` or manual `document.title` in this file (unlike `BrandWaitlist`).
- **Business rules**: none at this level.
- **Security notes**: none directly; children performing Supabase reads use `anon` key only.
- **Related pages**: virtually all customer routes (hub page).
- **RECONSTRUCTION SPEC**: Static composition page. To rebuild: import 11 marketing components in the exact order above, wrap sections 4–10 in a div with mouse-tracked CSS custom properties for a spotlight effect, call `useLenis()` once at top, no props/state of its own required.

---

## Collections (`src/pages/Collections.tsx`) — `/collections`, `/collections/:category`
- **Purpose**: All-products / category-filtered PLP (product listing page). **User type**: public.
- **Entry**: header nav "Shop"/category links, homepage CTAs, `?category=`/`?subcategory=` deep links. **Exit**: product cards → `/product/:id`.
- **Structure**: `Header` → `<main>` breadcrumb (`Home`/`Collections`/category) → `<h1>` title with item count → active-filter `Badge` chips (removable) + "Clear all" → grid (`isLoading` skeleton | empty state | product grid) → `Footer`.
- **Forms**: none (no search input on this page — filtering is via query params only).
- **Buttons**: filter-chip remove (`X` icon, calls `clearFilter`), "Clear all" (text button), per-card wishlist heart toggle (`toggleItem`), per-card "Buy Now" button (`ShoppingBag` icon, navigates to PDP) — note label says "Buy Now" but action is `navigate('/product/:id')`, not an actual purchase [OBSERVED — mislabeled CTA, no add-to-cart happens here].
- **Modals/drawers**: none.
- **Loading state**: 8 skeleton `Card`s (aspect-[3/4] image + 3 text lines) while `isLoading`.
- **Empty state**: `PackageOpen` icon + "No products available" + "Try adjusting your filters or check back later." when `filteredProducts.length === 0`.
- **Error state**: none surfaced to UI; DB/API errors only `console.error`'d, silently degrade to whatever data succeeded [OBSERVED].
- **Auth/authz**: none — public route, no guard.
- **Data sources** [CONFIRMED]:
  1. `supabase.from("products").select("*").in("status",["live","submitted"]).eq("is_available", true)` — mapped to internal `Product` shape (`title→name`, `style_tags→tags`, `occasion_tags→occasions`, `fabric` fallback for `material`).
  2. Fallback/parallel external `fetch("https://pyesltzkemtranachpne.supabase.co/functions/v1/products")` (legacy edge function, hard-coded absolute URL to the project's own Supabase functions endpoint — not env-configured) [SECURITY-SENSITIVE: hardcoded backend URL, no auth header sent].
  3. Static fallback `data/products.ts` (`staticProducts`), merged last (DB and API rows take precedence by id).
- **Mutations**: none (wishlist toggle is client-side `WishlistContext`, not a DB write here — see 14/15 for `WishlistContext` internals).
- **URL/query params**: `?category=` and `?subcategory=` control filtering via two static lookup maps (`categoryMapping`, `subcategoryMapping`); `setSearchParams({})` clears all. The declared route param `:category` (from `/collections/:category`) is **not read** — dead route param [CONFLICT with route table intent].
- **Side effects**: single `useEffect` on mount fetches DB + API in sequence (not parallel) and merges.
- **Responsive**: grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.
- **SEO**: [MISSING] no title/meta management.
- **Business rules**: DB rows always win over external API and static data on id collision; only `status in (live, submitted)` AND `is_available=true` rows are shown — note `submitted` (pending admin approval) products are visibly listed to customers alongside `live` ones, which contradicts the admin-approval workflow implied by `AdminApprovals` (`pending`→`live`) [CONFLICT / SECURITY-SENSITIVE: unapproved ("submitted") seller products may be publicly visible before admin review, though the actual approval flow uses status values `pending`→`live`/`rejected`, so `submitted` may be a distinct pre-pending seller-side status — verify against DB CHECK constraint on `products.status`].
- **Security**: anon Supabase client only; RLS assumed to gate `products` table (not verified here — see DB extraction docs).
- **Related pages**: `ProductDetail`, `Search`, `CategoryPage`, `OccasionDetail`.
- **RECONSTRUCTION SPEC**: Need `supabase` client, `data/products.ts` static fallback array, `WishlistContext`, shadcn `Card/Badge/Skeleton/Breadcrumb`, react-router `useSearchParams`. Reproduce the two mapping dictionaries (`categoryMapping`, `subcategoryMapping`, `categoryDisplayNames`) verbatim since filtering logic depends on them.

---

## ProductDetail (`src/pages/ProductDetail.tsx`) — `/product/:id`
- **Purpose**: PDP (product detail page), largest customer page (685 lines). **User type**: public (mutations like add-to-cart/wishlist require nothing extra client-side, but persistent cart/wishlist for guests is local-only — see 15).
- **Entry**: product cards everywhere (`Collections`, `Search`, `BrandStore`, carousels). **Exit**: `/cart` (Buy Now flow), `/store/:slug` (brand link), `/collections` (not-found fallback).
- **Structure (render order)**: `Header` → optional `?debug=1` raw JSON dump (`<pre>`) → 2-col grid: **Left** = `ProductImageGallery` (sticky) + optional `<video>` if `videoUrl`; **Right** = brand link → title → rating badge → price block (price, MRP strike-through, discount % `Badge`) → tag `Badge`s (first 4) → color swatch selector (`colorVariants`) → size selector (grid, continues below fold — file truncated at line 446 but route/12_PAGE_INVENTORY confirms further sections: quantity stepper, Add to Bag / Buy Now buttons, delivery/DeliveryChecker, ProductDetailsAccordion, wishlist toggle, share, then below the fold `RecommendationCarousel`, `SimilarProductsGrid`) → `Footer`. Modals: `VirtualTryOnDialog`, `ViewSimilarModal`, `SizeGuideModal`, `AddressSelectionModal` (Buy-Now flow).
- **Forms**: none classic form; selection UI (size/color/qty) acts as an implicit form with client-side validation (`if (!selectedSize) toast error`).
- **Buttons**: color swatches (circular, `Check` overlay when selected), size buttons, quantity `+/-` (Minus/Plus icons), "Add to Bag" (`handleAddToCart`), "Buy Now" (`handleBuyNow` → opens `AddressSelectionModal`, then navigates to `/cart` on select), wishlist heart toggle (`handleWishlistToggle`), share (`Share2` icon — handler not shown in first 446 lines, presumably `SocialShareButtons`), "View Similar" button (opens `ViewSimilarModal`), Size Guide trigger (opens `SizeGuideModal`), hidden debug "Test social webhook" flow (`handleTestSocialWebhook`, calls `triggerSocialPost` service — a Make.com/webhook integration test button not gated behind any admin flag) [SECURITY-SENSITIVE: appears to be a leftover dev/test action reachable by any visitor if rendered].
- **Loading**: skeleton layout (image + 5 text-line placeholders) while `isApiLoading`.
- **Empty/not-found**: "Product not found" + "Browse Collections" button when `currentProduct` is null after DB+API+static lookup all fail.
- **Auth/authz**: none — public; cart/wishlist actions work for guests via context (localStorage-backed, not gated by `ProtectedRoute` at this route, though `/cart` itself IS gated).
- **Data sources** [CONFIRMED]: `supabase.from("products").select("*").eq("id",id).maybeSingle()` → mapped to `Product`; on miss, `fetch("…/functions/v1/products")` external API, filtered by id; on miss, `staticProducts.find(p=>p.id===id)`.
- **Mutations**: none server-side; `addItem` (CartContext, local), `toggleItem` (WishlistContext, local).
- **URL/query params**: `id` path param; `?debug=1` toggles raw JSON dump of `currentProduct` (a diagnostic backdoor exposing full mapped product object incl. internal `status` field) [SECURITY-SENSITIVE: low severity, exposes internal `status` value client-side].
- **Side effects**: two `useEffect`s — product fetch (keyed on `id`), and variant/size/qty reset whenever `currentProduct.id` changes; `console.log` statements left in production code (`"PDP RAW DATA"`, `"[PDP] DB product row"`, `"[PDP] mapped description"`) [OBSERVED: debug logging shipped to prod].
- **Responsive**: `grid lg:grid-cols-2`, image gallery `lg:sticky lg:top-24`.
- **SEO**: [MISSING] no per-product `<title>`/OG tags — bad for social sharing/SEO of PDPs.
- **Business rules**: `discountPercent = round((original-price)/original*100)`; size/color reset on variant change; `selectedColor` derived from `activeVariant` or first `colors[0]`; similar-products modal uses static data only (`staticProducts`), independent of DB products, so DB-only products never appear as "similar" [OBSERVED — cross-source inconsistency].
- **Security**: `triggerSocialPost` webhook test button sends product data externally on demand — verify this is dev-only and should be removed before production hardening.
- **Related pages**: `Collections`, `Cart`, `BrandStore` (via brand link), `Search`.
- **RECONSTRUCTION SPEC**: Requires `CartContext`, `WishlistContext`, `LocationContext` (for address modal), `supabase` client, static `data/products.ts`, `Product`/`ColorVariant`/`UserAddress` types, and the child components `ProductImageGallery`, `VirtualTryOnDialog`, `RecommendationCarousel`, `SimilarProductsGrid`, `ViewSimilarModal`, `SizeGuideModal`, `ProductDetailsAccordion`, `DeliveryChecker`, `AddressSelectionModal`. Preserve the 3-tier data-fallback order (DB → external API → static) and the variant/size reset-on-change logic exactly, since it's the "single source of truth" pattern the code comments call out.

---

## Cart (`src/pages/Cart.tsx`) — `/cart`
- **Purpose**: Shopping cart review before checkout. **User type**: authenticated (`ProtectedRoute`).
- **Entry**: header cart icon, PDP "Buy Now"/"Add to Bag" flows, Dashboard quick link. **Exit**: `/checkout`, `/collections` (continue shopping or empty-state CTA).
- **Structure**: `Header` → `<h1>` "Shopping Cart (N items)" → 2-col grid: **left** = Delivery Address `Card` (shows `AddressCard` if `selectedAddress` else dashed "Add Delivery Address" button) + per-item `Card`s (image, name/brand, price×qty, size/color, qty stepper, Remove button); **right** = sticky Order Summary `Card` (subtotal, delivery FREE/₹99 threshold ₹999, 18% GST tax line, total, free-delivery nudge message, "Proceed to Checkout" primary button, "Continue Shopping" outline button) → `Footer` → `AddressSelectionModal`.
- **Forms**: none text-input forms; qty stepper and address modal act as the interactive elements.
- **Buttons**: address Change/Add (`ChevronRight`), qty `+/-` (`Minus`/`Plus` icon buttons calling `updateQuantity`), "Remove" (`Trash2` icon, `removeItem`), "Proceed to Checkout" (`navigate('/checkout')`), "Continue Shopping" (`navigate('/collections')`), empty-state "Browse Collections".
- **Loading/empty state**: `items.length===0` renders a full replacement screen (`ShoppingBag` icon, "Your cart is empty", CTA) instead of the cart layout — no separate loading spinner (cart is derived from in-memory/localStorage context, synchronous).
- **Error state**: none (no async fetch in this page itself).
- **Auth/authz**: `ProtectedRoute` at router level — unauthenticated users redirected to `/login?from=/cart`.
- **Data sources**: `CartContext` (`items, updateQuantity, removeItem, subtotal, tax, total`), `LocationContext` (`selectedAddress, showAddressModal`).
- **Mutations**: all client-side context mutations; no direct Supabase writes on this page.
- **URL/query params**: none.
- **Side effects**: `handleAddressSelect` shows a toast confirming delivery city/pincode.
- **Business rules**: free delivery threshold **₹999** (else **₹99**), tax label "18% GST" (tax value computed in `CartContext`, not on this page — verify GST calc logic there), key for cart line uniqueness = `product.id + size + color` (supports same product in multiple size/color as separate lines).
- **SEO**: [MISSING].
- **Security**: none beyond route guard; cart persists in a context — see 15 for whether it's localStorage (guest-vulnerable to tampering) or DB-synced.
- **Related pages**: `ProductDetail`, `Checkout`, `Wishlist`.
- **RECONSTRUCTION SPEC**: Needs `CartContext` (items/subtotal/tax/total/updateQuantity/removeItem), `LocationContext` (address state), `AddressCard`, `AddressSelectionModal`. Free-shipping threshold (999) and flat fee (99) are hard-coded in this file — must be replicated exactly, not read from config.

---

## Checkout (`src/pages/Checkout.tsx`) — `/checkout`
- **Purpose**: Address confirmation, discount code, and Razorpay payment. **User type**: authenticated.
- **Entry**: Cart's "Proceed to Checkout". **Exit**: `/order-confirmation` (success, via `navigate` with `location.state` payload) or back to `/cart` if cart empties.
- **Structure**: `Header` → breadcrumb text (Cart→Checkout→Confirmation) → `<h1>Checkout</h1>` → 2-col grid: **left** = Delivery Address `Card` (same pattern as Cart) + Order Items `Card` (image, name, brand, size/color/qty, line total); **right** = sticky Payment Summary `Card`: discount-code `Input`+"Apply" button (hidden once a discount is applied, replaced by an inline "Discount (CODE) [Remove]" line), subtotal/delivery/tax/discount/total breakdown, "Pay ₹total" button (disabled while `isProcessing` or Razorpay script not loaded, shows spinner), trust badges (Shield/Truck/CheckCircle2 icons + copy), payment-method icons row → `AddressSelectionModal`.
- **Forms**: discount code `Input` (`onKeyDown Enter` triggers apply, no other validation beyond server round-trip).
- **Buttons**: "Apply" (discount), "Remove" (discount), "Change"/"Add Address", "Pay ₹{amount}" (primary CTA).
- **Loading state**: "Apply" button shows `Loader2` spinner while `applyingDiscount`; "Pay" button shows `Loader2` + "Processing..." while `isProcessing`.
- **Empty state**: if `items.length===0`, component renders `null` (blank page) after the redirect-to-`/cart` `useEffect` fires — brief flash of blank screen possible before redirect completes [OBSERVED].
- **Error state**: toast-based errors for invalid/expired/min-purchase-not-met discount codes; toast for order-creation/verification failures; Razorpay modal `ondismiss` shows a "Payment Cancelled" toast and resets `isProcessing`.
- **Auth/authz**: `ProtectedRoute`.
- **Data sources / mutations** [CONFIRMED]:
  - `supabase.from("discounts").select("*").eq("code", CODE).eq("status","active").maybeSingle()` — client-side validates `usage_limit` vs `usage_count`, `min_purchase` vs `subtotal`; discount types: `free_shipping` (amount = deliveryFee), `*percentage*` (amount = subtotal × value/100), else flat (amount = min(value, subtotal)). **No server-side re-validation of the discount before charging** beyond what's passed in `order_data` to the verify function — potential trust boundary issue [SECURITY-SENSITIVE: discount amount computed client-side and sent as part of order_data to `razorpay-verify-payment`; if the edge function doesn't re-validate server-side, a client could tamper with `discount`/`total` before payment verification].
  - `supabase.functions.invoke('razorpay-create-order', {body:{amount:finalTotal, currency:'INR', receipt, notes:{customer_email, items_count}}})`.
  - Razorpay Checkout.js loaded via injected `<script src="https://checkout.razorpay.com/v1/checkout.js">` in a `useEffect` (added/removed on mount/unmount).
  - On payment success (`handler` callback): `supabase.functions.invoke('razorpay-verify-payment', {body:{razorpay_order_id, razorpay_payment_id, razorpay_signature, order_data}})` where `order_data` includes `customer_id, subtotal, shipping_fee, discount, total, shipping_address, items[]`.
  - On verify success: `clearCart()` then `navigate('/order-confirmation', {state:{orderNumber, paymentId, total, address, items}})`.
- **URL/query params**: none.
- **Business rules**: delivery fee same ₹999/₹99 threshold as Cart; `finalTotal = total + deliveryFee - discountAmount`; Razorpay `theme.color:'#000000'`, `prefill` uses selected address name/mobile + user email.
- **SEO**: [MISSING].
- **Security**: [SECURITY-SENSITIVE] Razorpay key (`key_id`) returned from the edge function and used client-side (expected/standard for Razorpay Checkout.js — not itself a leak, it's the publishable key). Discount validation duplicated client-side without visible server enforcement in this file (edge function internals not in scope of this doc).
- **Related pages**: `Cart`, `OrderConfirmation`.
- **RECONSTRUCTION SPEC**: Needs `CartContext`, `AuthContext` (`user`), `LocationContext`, `useToast`, `supabase` client + two edge functions (`razorpay-create-order`, `razorpay-verify-payment`), `discounts` table read access, dynamic Razorpay script injection, and router `state`-based handoff to `OrderConfirmation` (no persistence — a refresh mid-checkout loses discount state, by design of local component state).

---

## OrderConfirmation (`src/pages/OrderConfirmation.tsx`) — `/order-confirmation`
- **Purpose**: Post-payment success summary. **User type**: authenticated.
- **Entry**: only reachable via `Checkout`'s `navigate(..., {state})`. **Exit**: `/dashboard` ("Track Order" — dashboard has no real order tracking UI, dead-end feature) [OBSERVED], `/collections` ("Continue Shopping").
- **Structure**: `Header` → success icon+headline → Order Number `Card` (order number, Copy button, payment ID, total) → Delivery Address `Card` → Order Items `Card` → "What's Next?" 3-step numbered list `Card` → action buttons row → `Footer`.
- **Buttons**: "Copy" (clipboard write + toast), "Track Order" (link to `/dashboard`), "Continue Shopping" (link to `/collections`).
- **Loading/empty**: if `location.state` has no `orderNumber`, `useEffect` immediately `navigate('/')` and component returns `null` in the meantime — **this page cannot be deep-linked, bookmarked, or reloaded**; refreshing loses all order data because nothing is persisted or fetched by order number [OBSERVED, matches 11/12 notes]. [CONFLICT-RISK: if a real "order history" is later added, this page's data model (route state only) will need to be replaced by an `orders` table fetch keyed by `orderNumber`].
- **Auth/authz**: `ProtectedRoute`.
- **Data sources**: none — 100% from `location.state` (`orderNumber, paymentId, total, address, items`).
- **Mutations**: none.
- **Business rules**: static "What's Next" copy (email confirmation, 2–3 day shipping, SMS/email tracking) — these are marketing promises not wired to any actual notification system visible in this codebase [OBSERVED].
- **SEO**: [MISSING] (also arguably should be `noindex` given it's a transient, session-only page).
- **Security**: order/payment IDs and full shipping address are rendered from unvalidated router state — since this state can only realistically arrive from the `Checkout` flow, risk is low, but a manually-crafted `history.pushState`/`Link state` could show fabricated success content because there is no server-side confirmation performed on this page itself [SECURITY-SENSITIVE: low — spoofable success screen client-side, though no protected action is taken based on it].
- **Related pages**: `Checkout`, `Dashboard`.
- **RECONSTRUCTION SPEC**: Simple stateless presentational page keyed entirely on `location.state` typed as `OrderConfirmationState`; redirect-to-home guard for missing state; no data fetching to reproduce.

---

## Search (`src/pages/Search.tsx`) — `/search`
- **Purpose**: Full-text/faceted product search via Algolia, plus a parallel brand-store results block. **User type**: public.
- **Entry**: header search bar (`?q=`), nav search icon. **Exit**: individual `AlgoliaProductHit` links to PDPs; `BrandSearchResults` links to `/store/:slug`.
- **Structure**: `Header` → `InstantSearch` (Algolia) wrapping `Configure hitsPerPage=12` and `SearchContent` (title/query text, desktop sidebar `AlgoliaFilterSidebar` (`hidden lg:block`), mobile `AlgoliaMobileFilters` (`lg:hidden`), `BrandSearchResults` (Supabase-backed, rendered above product hits), `AlgoliaSearchResults`, `AlgoliaPagination`) → `Footer`.
- **Data sources** [CONFIRMED]: Algolia `searchClient`/`ALGOLIA_INDEX_NAME` from `src/lib/algoliaClient.ts` (index seeded from `?q=` via `initialUiState`); `BrandSearchResults` presumably queries Supabase brand/seller data by the same `query` string (see 14 for its internals).
- **URL/query params**: `?q=` seeds the initial Algolia query (one-way — Algolia's own URL sync, if any, is not configured here since no `routing` prop is passed to `InstantSearch`, meaning **user's search-box edits do not update the browser URL** and the page is not bookmarkable mid-search) [OBSERVED].
- **Loading/empty/error**: delegated entirely to Algolia InstantSearch's own hit/loading state inside `AlgoliaSearchResults`/`AlgoliaNoResults` (see 14).
- **Auth/authz**: none.
- **Business rules**: `hitsPerPage=12` hard-coded via `Configure`.
- **SEO**: [MISSING].
- **Related pages**: `Collections`, `BrandStore`.
- **RECONSTRUCTION SPEC**: Requires Algolia account/index + `algoliasearch`/`react-instantsearch`, `src/lib/algoliaClient.ts`, and the `src/components/search/*` family (`AlgoliaFilterSidebar`, `AlgoliaMobileFilters`, `AlgoliaSearchResults`, `AlgoliaPagination`, `BrandSearchResults`). No `routing` config means URL sync must be added if bookmarkable search state is required for reconstruction parity or improvement.

---

## BrandStore (`src/pages/BrandStore.tsx`) — `/store/:slug`, `/brand/:slug`
- **Purpose**: Live seller brand storefront page (distinct from legacy `BrandDetail`). **User type**: public. 157 lines.
- **Data source** [per 11/12, CONFIRMED via route map]: `fetchBrandStores()` from `src/lib/brandStores.ts`, matched by `slugifyBrand()`; renders brand hero, `OptimizedImage`, `Breadcrumb`, and (per naming convention) that brand's live products.
- **URL params**: `slug` — resolved against the live `sellers`/brand-store list, not a static dataset.
- **Business rule**: `/store/:slug` and `/brand/:slug` are the exact same component/route target — a deliberate alias, not a duplicate bug, but doubles crawl surface for SEO [OBSERVED].
- **SEO**: [MISSING] no per-brand meta tags observed at this depth of read.
- **Related pages**: `Brands` (directory), `ProductDetail` (brand link), `BrandDetail` (legacy/static parallel page for a *different* data source — see 11 [OBSERVED] duplication note).
- **RECONSTRUCTION SPEC**: Needs `src/lib/brandStores.ts` (`fetchBrandStores`, `slugifyBrand`), `OptimizedImage`, `Breadcrumb`. [Recommend follow-up full read if pixel-level rebuild is required; this entry is based on route-map-level evidence plus file-size confirmation, not a full line-by-line read.] [INFERRED: exact section order not independently verified in this pass.]

---

## CategoryPage (`src/pages/CategoryPage.tsx`) — `/category/:slug`
- **Purpose**: Editorial category landing page driven by a static config (`data/oguraCategories.ts`). **User type**: public. 83 lines.
- **Special case** [CONFIRMED via 11]: if `slug === 'made-to-order'`, renders `MadeToOrderPage` instead of the normal category layout — i.e. this route is the *only* entry point to the Made-to-Order flow.
- **Structure** (per 12_PAGE_INVENTORY, component list): `CategoryHeroBanner`, `SubCategoryScroll`, `FeaturedCollectionGrid`, `LuxeEditSection`, `CategoryProductGrid`, `CelebrityIconsSection`.
- **Data source**: `getCategoryBySlug(slug)` — pure static lookup, no Supabase call in the page itself (child `CategoryProductGrid` may query products by category — see 14).
- **Not-found behavior**: unknown slug → `<Navigate to="/" replace/>` (silent redirect, no 404 message shown to the user) [OBSERVED].
- **SEO**: [MISSING].
- **Related pages**: `Collections`, `MadeToOrderPage`, `OccasionDetail`.
- **RECONSTRUCTION SPEC**: Requires `data/oguraCategories.ts` static config keyed by slug, the six category-section components, and the made-to-order conditional branch. [INFERRED structure ordering from component-list evidence in 12; not independently re-verified line-by-line here.]

---

## BrandWaitlist (`src/pages/BrandWaitlist.tsx`) — `/seller-program` (+ legacy redirects `/waitlist`, `/apply-to-join`)
- **Purpose**: Seller-program marketing/waitlist landing, largest marketing page (486 lines). **User type**: public.
- **SEO**: [CONFIRMED per 11] — this is the **one** customer page that manually sets `document.title` and a meta description, i.e. the only page in the app with any client-side SEO handling at all.
- **Data source**: `WaitlistForm`/`WaitlistSection` components — per naming and typical pattern, these likely perform a Supabase insert into a waitlist table (see 14 for confirmation: `src/components/waitlist/WaitlistForm.tsx` is in the direct-Supabase-call list found by grep).
- **Business rules**: two legacy paths (`/waitlist`, `/apply-to-join`) permanently redirect here via `<Navigate replace>` — treat both as historical URLs preserved for inbound-link compatibility.
- **Related pages**: `JoinUs`, `SellerApply`, `SellerLanding` (three parallel seller-acquisition entry points across the customer and seller apps) [OBSERVED: potential redundant/overlapping funnels].
- **RECONSTRUCTION SPEC**: Requires manual `document.title`/meta description side effect, `WaitlistForm`/`WaitlistSection` (with their Supabase insert target table), and the two `Navigate` redirect routes. [INFERRED: full section-by-section layout not re-read line-by-line in this pass beyond what 11/12 already captured; treat as [MISSING] full detail for anything beyond title/meta + waitlist form.]

---

## Login (`src/pages/Login.tsx`) — `/login`
- **Purpose**: Customer Google-OAuth sign-in gateway. **User type**: public (pre-auth).
- **Structure**: 2-col split — left (`hidden lg:flex`) branding panel with OGURA wordmark, headline, stat counters (500+ Designers / 10K+ Products / 50+ Cities — static marketing numbers, not live data) [OBSERVED: hard-coded fake/placeholder stats]; right column — mobile logo, "Welcome Back" heading, `GoogleSignInButton`, divider, Terms/Privacy links, "← Back to browsing" link.
- **Forms**: none manual — the only auth mechanism on this page is Google OAuth (no email/password fields on the customer login, unlike `SellerLogin`) [OBSERVED — inconsistent auth UX between customer and seller apps].
- **Redirect logic** [CONFIRMED, fairly intricate]:
  - Reads `?next=` query param; accepted only if it's a same-origin path (`startsWith('/')` and not `//`).
  - Reads `sessionStorage['ogura_post_auth_path']` as a fallback "path saved before the Google OAuth round-trip" (handles cross-subdomain OAuth redirects), rejected if it starts with `/login`.
  - Priority: `next` param > `location.state.from.pathname` > stored path > `/dashboard` default.
  - On successful auth: if `isNewUser` and not using a same-origin `next`, force `/onboarding`; else go to the resolved `from`.
  - On mount, reads `?error`/`?error_description` query params (OAuth error passthrough) and shows a `sonner` toast, then strips them from the URL via `history.replaceState`.
- **Loading/auth states**: full-screen spinner while `isLoading` OR while `isAuthenticated` (briefly, before the redirect `useEffect` fires) — i.e. authenticated users always see a spinner flash on this route rather than instant redirect [OBSERVED].
- **Auth/authz**: none required to view; effectively self-redirecting once authenticated.
- **Data sources**: `AuthContext` only (`isAuthenticated, isLoading, isNewUser`), no direct Supabase calls in this file.
- **Security notes**: [SECURITY-SENSITIVE] open-redirect mitigation exists (same-origin check on `next`/stored path) — good practice, correctly implemented (`startsWith('/') && !startsWith('//')`).
- **Related pages**: `Onboarding`, `Dashboard`, `SellerLogin`, `AdminLogin` (three parallel, inconsistent login UIs across apps).
- **RECONSTRUCTION SPEC**: Requires `AuthContext` (`isAuthenticated`, `isLoading`, `isNewUser`), `GoogleSignInButton`, and the exact `next`/`from`/`sessionStorage` priority chain above — this redirect-resolution logic is non-trivial and must be reproduced precisely to avoid open-redirect regressions or broken post-login navigation across subdomains.

---

## Onboarding (`src/pages/Onboarding.tsx`) — `/onboarding`
- **Purpose**: Post-signup preference collection (largely cosmetic). **User type**: authenticated.
- **Structure**: centered card layout — welcome header (`Sparkles` icon, "Welcome to OGURA, {firstName}!"), "What interests you?" `Card` with a 2×3/3×2 grid of toggle buttons (womenswear/menswear/bridal/ethnic/contemporary/accessories, each with an emoji), "Stay Updated" `Card` with two `Checkbox` rows (order notifications default **checked**, promotions default **unchecked**), action row ("Skip for now" outline button, "Get Started" primary button).
- **Forms**: fully local `useState({womenswear, menswear, bridal, ethnic, contemporary, accessories, notifications, promotions})` — **none of these values are sent anywhere** [CONFIRMED, matches 11's flag]. Only action taken is `completeOnboarding()` from `AuthContext`.
- **Mutations**: `completeOnboarding()` → (per 11) `supabase.from('profiles').update({is_onboarded:true})`. The category/notification checkboxes are pure UI theatre with no persistence [SECURITY/DATA-INTEGRITY OBSERVATION: not a security issue, but a functional gap — any "personalization" promised by this screen does not exist].
- **Buttons**: category toggle buttons (local state only), "Skip for now" (`navigate('/dashboard', {replace:true})` without calling `completeOnboarding`, meaning skipping does **not** set `is_onboarded=true`) [OBSERVED — user could be re-shown onboarding indefinitely if `/onboarding` is gated by `is_onboarded` elsewhere, though no such gate was found in the route table besides `Login`'s `isNewUser` check], "Get Started" (`handleComplete` → `completeOnboarding()` + success toast + navigate to `/dashboard`).
- **Loading**: "Get Started" button shows `Loader2` + "Setting up..." while `isSubmitting`.
- **Error state**: generic toast "Something went wrong. Please try again." on any `completeOnboarding()` throw.
- **Related pages**: `Login` (source of `isNewUser` redirect), `Dashboard`, `Profile`.
- **RECONSTRUCTION SPEC**: Only functional requirement is `AuthContext.completeOnboarding()` and `user.name`; the entire preferences UI can be reproduced as pure decorative local state (or, if true personalization is desired, this is the exact spot where a `profiles`/`user_preferences` write would need to be added — currently absent).

---

## Profile (`src/pages/Profile.tsx`) — `/profile`
- **Purpose**: Account settings. **User type**: authenticated. 270 lines.
- **Structure**: `Header` → "Back to Dashboard" button → avatar+name/email header → stacked `Card`s: **Personal Information** (Full Name editable `Input`, Email `Input` disabled with "cannot be changed... linked to Google account" note, Phone editable `Input`, "Save Changes" button) → **Security** (static "Google Sign-In / Active" display card, no interactive control) → **Saved Addresses** (`id="addresses"` anchor target used by Dashboard's `/profile#addresses` link; content is **always** the empty state — "No saved addresses yet" — there is no fetch of a `user_addresses`/similar table on this page) [CONFIRMED stub, matches 11/12] → **Notifications** (two rows, both marked "Coming soon", non-interactive) → **Danger Zone / Sign Out** card (destructive-styled "Sign Out" button).
- **Forms**: name/phone edit form, no client-side validation beyond none-required (any string, including empty, is accepted) [OBSERVED — no zod/regex validation on phone format here despite `AddressForm` elsewhere in the app using stricter validation].
- **Mutations** [CONFIRMED]: `supabase.from("profiles").update({name, phone, updated_at: now}).eq("id", user.id)`.
- **Buttons**: "Save Changes" (shows "Saving..." text while `isSaving`), "Sign Out" (`logout()` then `navigate('/login')`).
- **Error/success**: `sonner` toast success "Profile updated successfully" / error "Failed to update profile. Please try again."
- **Auth/authz**: `ProtectedRoute`.
- **Business rules**: email field is immutable in the UI (Google-linked) though the underlying `profiles.email` column may or may not be enforced immutable at the DB layer — [UNKNOWN, verify DB constraint].
- **Related pages**: `Dashboard` (`#addresses` anchor link, and general account hub), `Onboarding`.
- **RECONSTRUCTION SPEC**: Needs `AuthContext` (`user`, `logout`), `supabase.from('profiles')` write access scoped to the current user's own row (RLS `auth.uid() = id` expected — verify in DB docs). The Saved Addresses and Notifications sections must be explicitly reproduced as **static stub UI**, not real features, unless the rebuild scope is to actually implement them.

---

## Dashboard (`src/pages/Dashboard.tsx`) — `/dashboard`
- **Purpose**: Customer account home/hub. **User type**: authenticated. 195 lines.
- **Structure**: `Header` → avatar + "Welcome back, {firstName}!" + email → "Explore New Arrivals" promo `Card` (Sparkles icon, "Shop Now" button → `/collections`) → 4-card quick-link grid: **My Orders** (`href="/orders"` — **not a registered route in any app router**, confirmed dead link [CONFLICT with route map, matches 11's flag]), **Wishlist** (`/wishlist`), **Shopping Cart** (`/cart`), **Saved Addresses** (`/profile#addresses`) → 2-col Account section: Profile Information `Card` (read-only Name/Email/Phone display + "Edit Profile" link to `/profile`) and Account Actions `Card` (Profile Settings link, Sign Out button) → `LuxuryFooter`.
- **Buttons**: "Shop Now", 4× quick-link cards (whole card is a `<Link>`), "Edit Profile", "Profile Settings", "Sign Out" (`logout()` — no navigate after, unlike `Profile`'s sign-out which explicitly navigates to `/login`; relies on `AuthContext`/route guards to redirect) [OBSERVED minor inconsistency].
- **Data sources**: `AuthContext.user` only — **no order history, no live stats**; this is a purely presentational hub with one confirmed broken link.
- **Auth/authz**: `ProtectedRoute`.
- **Related pages**: `Profile`, `Wishlist`, `Cart`, `OrderConfirmation` ("Track Order" links here, reinforcing that Dashboard is meant to be an order-tracking hub but currently has zero order data wired in) [OBSERVED — functional gap: Dashboard cannot fulfill the "Track Order" promise made by OrderConfirmation].
- **RECONSTRUCTION SPEC**: Needs `AuthContext` only; the "My Orders" link either needs a real `/orders` route + an `orders` table query (currently missing entirely) or should be corrected to point at an existing route.

---

## SELLER APP PAGES (`src/pages/seller/*`)

### SellerLanding (`/seller`, `/seller/join`, catch-all) — 207 lines
Purely static marketing content, no data/auth. Sections in order: Hero (badge, H1, subcopy, "Apply as Partner"/"Seller Login" buttons — both point to `/seller/login`, not to a distinct signup route, so "Apply as Partner" doesn't actually start an application, it just logs in) [OBSERVED — CTA mislabeling], Commission tiers (3 static cards: 15% Standard / 12% Growth ₹1L+/mo / 10% Premium ₹5L+/mo — hard-coded business numbers), Benefits grid (6 static cards), Testimonials (3 hard-coded fake/sample names — "Priya Sharma", "Rajesh Mehra", "Anita Kapoor" with generic quotes, not sourced from any CMS/DB) [OBSERVED: likely placeholder content, flag if going to production], final CTA. **RECONSTRUCTION**: no data dependencies; reproduce the 3 hard-coded commission tiers and benefits/testimonials arrays verbatim if pixel parity is required.

### SellerLogin (`/seller-login`, `/seller/login`) — 128 lines
Email/password **and** Google sign-in (unlike customer `Login`). Form fields: `email` (type=email), `password` (type=password) — **no client-side validation at all** (empty check only: `if (!email || !password) toast.error(...)`, no format/regex checks). Submit → `useAuth().signInWithEmail(email, password)` → on success `navigate('/seller/dashboard', {replace:true})`, on failure toast the returned error string. Also has an `?error`/`?error_description` query-param passthrough toast (OAuth error surfacing) identical pattern to customer `Login`. Link to `/join` for signup (not `/seller-signup`, despite that route existing) [OBSERVED — inconsistent signup routing across the seller app]. **Security**: password sent via `AuthContext.signInWithEmail` (Supabase Auth, presumably HTTPS + Supabase's own hashing) — no additional client-side risk beyond standard Supabase Auth password flow.

### SellerSignup (`/seller-signup` only — NOT `/seller/signup`) — 120 lines
Fields: `email`, `password` (min-length check: `password.length < 6` → toast "Password must be at least 6 characters", the only validation rule present). Submit → `useAuth().signUpWithEmail(email, password)` which (per 11) auto-inserts a `sellers` row and a `user_roles` row with `role:'seller'` — i.e. **any self-signup via this form immediately grants the `seller` role**, with no admin approval gate at the auth layer (approval is instead modeled via `sellers.application_status` checked later, but the role itself is pre-granted) [SECURITY-SENSITIVE: self-service role escalation to `seller` at signup time, decoupled from the `application_status` approval workflow — a user could sign up here and immediately pass `SellerAuthRoute`'s auth-only check to reach `/seller/dashboard`, `/seller/products/new`, etc., even while `application_status` is still `pending`]. Link to `/join` for "Log in" (should arguably link to `/seller-login`) [OBSERVED — same cross-link mismatch as `SellerLogin`].

### SellerDashboardHome (`/seller/dashboard`) — 73 lines
100% static placeholder: 4 KPI cards (Total Products "0", Total Orders "0", Revenue "₹0", Growth "—") — **no Supabase query at all**, numbers are hard-coded string literals, not computed from real zero-state data [OBSERVED, matches 11/12's "no real data" flag]. Empty-state card below KPIs ("No products yet"). **Business rule**: none real; this is a non-functional dashboard shell.

### SellerProducts (`/seller/products`) — 163 lines
Two sequential `useEffect`s: (1) resolve `sellerId` via `supabase.from('sellers').select('id').eq('user_id', user.id).maybeSingle()`; (2) once `sellerId` known, `supabase.from('products').select('id,title,price,original_price,category,status,is_available,images,created_at').eq('seller_id', sellerId).order('created_at', {ascending:false})`. Loading spinner (`Loader2`) while `loading`. Empty state: `Package` icon + "No products yet" + "Add Product" CTA. Table columns: thumbnail, Product title, Category, Price (₹ `toLocaleString('en-IN')`), Status `Badge` (color map: draft=muted, pending=yellow, live=green, rejected=red — **note "submitted" status used elsewhere in `Collections.tsx` has no color mapping here**, would render with no badge styling/undefined class) [OBSERVED — status-value inconsistency between `SellerAddProduct`'s inserted status `"submitted"` and this table's `statusColors` map which only knows `draft/pending/live/rejected`, missing a `submitted` entry — CONFLICT in status vocabulary across the app], Created date. Read/list-only — no edit/delete actions on this page.

### SellerAddProduct (`/seller/products/new`) — 393 lines, most complex seller page
Full new-product form. **Fields**: title* (text), category* (`Select`, 12 hard-coded options: dresses/tops/bottoms/outerwear/footwear/accessories/bags/sarees/lehengas/kurtas/co-ords/jumpsuits), dispatch_days (number, default "7"), description (textarea), price* (number, ₹), original_price/MRP (number, optional), sizes (multi-select button grid: XS/S/M/L/XL/XXL/Free Size), colors (multi-select swatch grid, 12 hard-coded name+hex pairs: Black #000000, White #FFFFFF, Red #DC2626, Blue #2563EB, Green #16A34A, Pink #EC4899, Yellow #EAB308, Beige #D2B48C, Brown #92400E, Navy #1E3A5F, Maroon #800000, Grey #6B7280), occasion tags (`Badge` multi-select: Wedding/Festive/Party/Casual/Work/Brunch/Date Night/Vacation), style tags (`Badge` multi-select: Boho/Minimal/Ethnic/Western/Indo-Western/Streetwear/Classic/Contemporary), material (text), fabric (text), care_instructions (textarea), is_made_to_order/is_returnable (booleans present in form state but **no visible UI toggle rendered for them** in the read portion — likely defaulted, `is_returnable` defaults `true`) [OBSERVED], images* (`ImageUploadZone`, max 9 files, max 20MB each). **Validation**: required-field check (`title`, `category`, `price`) via toast, at-least-one-image check via toast. **Submit flow**: `uploadImages()` loops files → `supabase.storage.from('product-images').upload(\`${sellerId}/${Date.now()}-${file.name}\`, file)` then `getPublicUrl()`; then `supabase.from('products').insert({..., status:'submitted', images:imageUrls, colors, sizes, occasion_tags, style_tags})`. On success: toast + `navigate('/seller/products')`. **Security**: `sellerId` resolved from the authed user's own `sellers` row before any insert/upload — scoping relies on this client-side lookup plus (presumably) RLS on `products`/`storage.objects` — not independently verified here [SECURITY-SENSITIVE: verify server-side RLS actually restricts `insert` to `seller_id = own sellers.id`, since this page trusts client state for `sellerId`].

### SellerOrders (`/seller/orders`) — 129 lines
Read-only. Resolves `sellerId` then `supabase.from('orders').select('id,order_number,status,total,created_at,customer_id').eq('seller_id', sellerId).order('created_at',{ascending:false})`. Status color map: new=blue, accepted=yellow, packed=orange, shipped=purple, delivered=green, cancelled=red. Empty state: `ShoppingCart` icon + "No orders yet". **No actions available** — sellers cannot update order status, add tracking, etc. from this page — purely a read list [OBSERVED — functional gap vs typical seller-order workflows].

### SellerSettings (`/seller/settings`) — 117 lines
Fetches own `sellers` row (`select('*')`). Editable fields: `brand_name`, `city`, `instagram_handle`, `description` (all plain text inputs mutating local `seller` object state directly on each keystroke — no separate form-state object, edits the fetched row in place). "Save Changes" → `supabase.from('sellers').update({brand_name, description, city, instagram_handle}).eq('id', seller.id)`. Read-only "Application Status" card shows `application_status` and `seller_type` with **no way to see or act on rejection reasons** (unlike `AdminApprovals`'s product-level rejection reason, sellers have no visible rejection-reason field even though `AdminSellers` only ever sets `approved`, never records a reason for rejection) [OBSERVED gap].

---

## ADMIN APP PAGES (`src/pages/admin/*`)

### AdminLogin (`/admin`, `/admin/login`, catch-all) — 89 lines
Google-only sign-in (no email/password, unlike seller). Two-role-check flow: `useAuth()` for session, `useUserRole().hasRole('admin')` for authorization. If authenticated but not admin → inline "Access Restricted" card (`ShieldCheck` destructive icon, "This area is restricted to authorized administrators only.", plain `<a href="/">` link — **not a router `Link`**, causing a full page reload back to the customer app) [OBSERVED]. If authenticated AND admin → auto-redirect to `/admin/dashboard`. Also handles `?error` OAuth passthrough toast. Copy: "Authorized personnel only. Access is logged and monitored." — an access-logging claim not verified anywhere in this frontend codebase [OBSERVED: unverified security claim, no client-side logging call present here; if backend/edge-function logging exists it's out of scope of this file].

### AdminDashboardHome (`/admin/dashboard`) — 68 lines
100% placeholder, 4 KPI cards all showing `"—"` (Pending Approvals, Live Products, Total Sellers, Total Products) — no Supabase query. Copy explicitly says "Product approval workflow will be built in Phase 3" even though `/admin/approvals` **already fully implements** that workflow — stale/contradictory copy [CONFLICT, matches 11's flag exactly].

### AdminApprovals (`/admin/approvals`) — 205 lines
Fetches `supabase.from('products').select('id,title,price,category,status,images,created_at,seller_id').eq('status','pending').order('created_at',{ascending:'true'})` — **note**: this queries status `'pending'`, while `SellerAddProduct` inserts status `'submitted'` — meaning newly submitted seller products (`status='submitted'`) **will never appear in this approval queue**, which only surfaces rows with `status='pending'` [CONFLICT / functional bug: the seller-submission status value and the admin-approval query's filter value do not match, so the approval workflow as wired in the frontend cannot process products created via `SellerAddProduct` unless something else (a DB trigger/edge function) transitions `submitted`→`pending` server-side — unverified, flag for DB-layer investigation]. Actions: "Approve" (`update({status:'live'})`, removes row from local list, toast success), "Reject" opens a `Dialog` with an optional `Textarea` reason → "Confirm Reject" (`update({status:'rejected', rejection_reason})`). Empty state: `Inbox` icon + "All caught up!". Loading: `Loader2` full-page spinner.

### AdminProducts (`/admin/products`) — 148 lines
Read-only catalogue browser: `Select` status filter (all/draft/pending/live/rejected — again, **no `submitted` option**, so admin cannot filter to see seller-submitted-but-not-yet-pending products either) [same status-vocabulary gap], text `Input` search (client-side `.filter(title.includes(search))`, case-insensitive), query capped `.limit(200)`. Table: thumbnail, title, category, price, status badge, created date. No row actions (view/edit) — purely informational.

### AdminSellers (`/admin/sellers`) — 147 lines
Fetches all `sellers` rows. "Approve" button (only shown when `application_status==='pending'`) → `update({application_status:'approved', is_verified:true}).eq('id', s.id)`, toast: **"Seller approved! Seller role has been assigned."** — but this component performs **no `user_roles` insert/update** [CONFIRMED absent in this file, matches 11's flag] — meaning either (a) a DB trigger on `sellers.application_status` handles role assignment server-side [UNKNOWN, unverified — check DB triggers/functions doc], or (b) the toast message is inaccurate and no role is actually granted by this action [SECURITY-SENSITIVE / CONFLICT: UI claims a security-relevant state change (role grant) that its own client code does not perform — combined with the earlier finding that `SellerSignup` already grants `role:'seller'` at signup time regardless of `application_status`, the practical effect may be that the "Approve" button here is largely redundant for authorization purposes and only actually gates the `is_verified` flag/store-front visibility, not dashboard access]. No "Reject" action exists in the UI at all — sellers can only be approved or left pending, never explicitly rejected from this screen [OBSERVED gap].

### AdminSettings (`/admin/settings`) — 36 lines
Pure read-only display of `useAuth().user` (name, email) + a static "Administrator" role badge. No form, no mutation, no Supabase call.

---

## SMALLER / STATIC PAGES (shorter entries)

- **Brands** (`/brands`) — directory combining `useBrandStores()` (live DB-backed) + static `data/brands.ts` "Featured brands" section; public; `OptimizedImage` cards link to `/store/:slug` and `/brands/:brandId` respectively (two different link targets from what look like similar cards — confirms the dual brand-model duplication noted in 11).
- **BrandDetail** (`/brands/:brandId`) — legacy, 100% static data (`data/brands.ts` + `data/products.ts`), no Supabase; `DesignerGallery` + `ProductGrid` children; public.
- **Designers** (`/designers`) — `useDesigners()` hook (Supabase `designers` table) + a live `postgres_changes` realtime subscription (auto-updates list on DB changes) + 300ms-debounced search + category filter; public.
- **DesignerDetail** (`/designers/:designerId`) — legacy simpler designer page via `useDesigner(id)` hook; parallel/duplicate of `DesignerProfilePage`.
- **DesignerProfilePage** (`/designer/:slug`) — richer storefront: `useDesignerBySlug`, `useDesignerProducts`, `useDesignerCategories` hooks; filters + "Load more" pagination (client-driven, not true infinite scroll); mobile filters in a `Sheet`.
- **Occasions** (`/occasions`) — static grid from `data/occasions.ts`, links to `/occasions/:occasionId`; public, no data fetch.
- **OccasionDetail** (`/occasions/:occasionId`) — filters static `data/products.ts` by `product.occasions` array membership; uses global `FilterContext` for additional client-side filter state; `FilterBar` + `Breadcrumb`.
- **Stores** (`/stores`) — static `data/stores.ts` physical-store cards with a map link and a WhatsApp deep link (`wa.me/...` presumably; confirm exact number format if reconstructing — [MISSING] exact WhatsApp number not read in this pass).
- **JoinUs** (`/join`, shared by both customer and seller apps) — multi-step funnel: hero → auth (login/signup tabs, Supabase Auth) → apply form → success; performs Storage upload + `seller_applications`-style insert in the apply step; 342 lines; largest hybrid flow.
- **SellerApply** (`/join/apply`) — standalone application form usable without login; zod-validated; `supabase.storage.from('product-images').upload` + `supabase.from('seller_applications').insert`; success state not gated by auth.
- **Contact** (`/contact`) — `CustomerLayout`; zod-validated form; **no backend call** — "submission" opens a `mailto:` link in the user's email client, meaning form data is never stored server-side and delivery depends entirely on the user having a configured mail client [OBSERVED: not a true backend contact form].
- **Careers** (`/careers`) — `CustomerLayout`; 931 lines, largest static page; zod schema defined for an application form but target is described as `careers@ogura.in` (mailto-style intent, same caveat as Contact); accordion-based per-role listings, entirely static content.
- **PrivacyPolicy** / **TermsOfUse** (`/privacy`, `/terms`) — `CustomerLayout`, fully static legal text, no data, no forms.
- **Wishlist** (`/wishlist`) — `ProtectedRoute`; reads `WishlistContext` (localStorage-backed per 11); "move to cart" action moves only the **first available size/color** of a wishlist item rather than prompting the user to choose [OBSERVED — UX/business-rule shortcut, potential mismatch between wishlisted variant and what's actually added to cart].
- **PinterestCallback** (`/auth/pinterest/callback`) — public; reads `?code=`; calls `supabase.functions.invoke('pinterest-token-exchange')`; stores `pinterest_token`/`pinterest_connected`/`pinterest_code` in `localStorage` (not httpOnly) [SECURITY-SENSITIVE, per 11]; hard-codes a stale preview `redirect_uri` (`https://coy-clone-studio.lovable.app/...`) [SECURITY-SENSITIVE / CONFLICT: production OAuth redirect URI does not match production domain]; auto-redirects to `/` after 2s.
- **OAuthConsent** (`/.lovable/oauth/consent`) — hidden/internal; implements a full OAuth **provider-side** consent screen using beta Supabase Auth APIs (`getAuthorizationDetails`, `approveAuthorization`, `denyAuthorization`); redirects unauthenticated users to `/login?next=...`; approves third-party app access to the user's OGURA account based on server-provided scopes [SECURITY-SENSITIVE, per 11 — this is the most sensitive customer-facing page in the app since it grants external app access].
- **NotFound** (`*`, CustomerApp only) — logs the attempted path via `console.error`, renders a plain unstyled 404 (no `Header`/`Footer`, not wrapped in the app shell) [OBSERVED].

---

## Cross-page conflicts and gaps summary (for quick reference)
1. **Status-vocabulary mismatch** [CONFLICT, SECURITY-SENSITIVE]: `SellerAddProduct` inserts `status:'submitted'`; `AdminApprovals` only queries/filters `status:'pending'`; `Collections`/PDP customer-facing queries treat `['live','submitted']` as publicly visible. Net effect: newly submitted products may be **publicly visible immediately** (via `Collections`'s `in('status',['live','submitted'])` filter) **before** any admin approval step can even see them (since Admin only looks at `pending`). This is the single most significant cross-page business-logic conflict found in this pass.
2. **Role-grant timing**: `SellerSignup` grants `role:'seller'` at signup (pre-approval); `AdminSellers`'s "Approve" toast claims to grant the seller role but the code doesn't do it — actual authorization gate for `/seller/*` dashboard routes is only "any authenticated user" (`SellerAuthRoute`), not "approved seller."
3. **Dead/mismatched links**: `Dashboard`'s "My Orders" → `/orders` (unregistered); "Track Order" on `OrderConfirmation` → `/dashboard` (which has no order data); `SellerLanding`'s "Apply as Partner" → `/seller/login` (not an application flow); `SellerLogin`/`SellerSignup` cross-link to `/join` instead of each other.
4. **Duplicate/parallel concepts**: `BrandDetail` (static) vs `BrandStore` (live) for "brands"; `DesignerDetail` vs `DesignerProfilePage` for "designers"; `JoinUs`/`SellerApply`/`SellerLanding`/`BrandWaitlist` as four overlapping seller-acquisition entry points.
5. **No true 404s** for `/seller/*` or `/admin/*` — both fall back to landing/login.
