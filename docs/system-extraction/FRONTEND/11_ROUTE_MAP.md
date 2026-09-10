# 11 — Route Map (all three app routers)

Router library: `react-router-dom` v6, three independent `<Routes>` trees selected at runtime by `detectDomain()` (`src/lib/domainDetection.ts`). See 10_FRONTEND_ARCHITECTURE.md for how the trees are selected.

Legend for **Access**: `public` (no auth check), `auth` (any logged-in user via `ProtectedRoute`/`SellerAuthRoute`), `admin` (role-gated via `RoleProtectedRoute requiredRole="admin"`).

## A. CustomerApp (`src/apps/CustomerApp.tsx`) — default domain

| Path | Static/Dynamic | Params | Component (file) | Access | Guard | Data / Edge Fns | Notes |
|---|---|---|---|---|---|---|---|
| `/` | static | – | `Index` (`src/pages/Index.tsx`) | public | none | none directly (children fetch their own data) | Composes many marketing sections (`LuxuryHero`, `Premium3DCategorySection`, `SellerNewArrivals`, `HiddenGemsSection`, `CategoryShowcase`, `DesignersSpotlight`, `LuxuryTrustBadges`, `LuxuryBrands`, `LuxuryGiftCard`, `LuxuryStoreLocator`). Uses `useLenis()` smooth scroll. |
| `/login` | static | – | `Login` (`src/pages/Login.tsx`) | public | none | Supabase Auth via `AuthContext` | Redirects authenticated users to `/onboarding` (new users) or `from`/`next`/stored path/`/dashboard`. |
| `/collections` | static | – | `Collections` (`src/pages/Collections.tsx`) | public | none | `supabase.from('products')` (status in `[live,submitted]`, `is_available=true`) + fallback `fetch()` to `https://pyesltzkemtranachpne.supabase.co/functions/v1/products` + static `data/products.ts` | Filters via `?category=`/`?subcategory=` query params, client-side merge of DB + external API + static fallback (dedup by id, DB wins). |
| `/collections/:category` | dynamic | `category` (path param, unused — component reads `?category=` query instead) | `Collections` | public | none | same as above | The `:category` path param is declared in the route but the component only reads `useSearchParams`, not `useParams` — dead route param. [OBSERVED] |
| `/product/:id` | dynamic | `id` | `ProductDetail` (`src/pages/ProductDetail.tsx`) | public | none | `supabase.from('products').eq('id',id).maybeSingle()`, fallback `fetch()` external products API, static fallback | Color/size selection, `useCart().addItem`, `useWishlist().toggleItem`, `?debug=1` dumps product JSON. |
| `/brands` | static | – | `Brands` (`src/pages/Brands.tsx`) | public | none | `useBrandStores()` hook (Supabase-backed live brand stores) + static `data/brands.ts` | Two sections: live "Brand stores" + static "Featured brands". |
| `/store/:slug` | dynamic | `slug` | `BrandStore` (`src/pages/BrandStore.tsx`) | public | none | `fetchBrandStores()` (`src/lib/brandStores.ts`) | Same component and slug space as `/brand/:slug`. |
| `/brand/:slug` | dynamic | `slug` | `BrandStore` | public | none | same | Duplicate route to `/store/:slug`, identical component. |
| `/brands/:brandId` | dynamic | `brandId` | `BrandDetail` (`src/pages/BrandDetail.tsx`) | public | none | static `data/brands.ts` + `data/products.ts` (no DB) | Legacy static-data brand page, distinct from `/store/:slug`/`/brand/:slug`live brand stores — two parallel "brand" concepts. [OBSERVED] |
| `/designers` | static | – | `Designers` (`src/pages/Designers.tsx`) | public | none | `useDesigners()` hook (`supabase.from('designers')`) + realtime subscription `postgres_changes` on `designers` table | Search + category filter, debounced 300ms. |
| `/designers/:designerId` | dynamic | `designerId` | `DesignerDetail` (`src/pages/DesignerDetail.tsx`) | public | none | `useDesigner(id)` hook | Legacy/simple designer detail (Instagram-style), distinct from `/designer/:slug`. |
| `/designer/:slug` | dynamic | `slug` | `DesignerProfilePage` (`src/pages/DesignerProfilePage.tsx`) | public | none | `useDesignerBySlug`, `useDesignerProducts`, `useDesignerCategories` hooks | Richer designer storefront with filters/pagination ("Load more"). Two parallel designer detail routes/components exist. [OBSERVED] |
| `/occasions` | static | – | `Occasions` (`src/pages/Occasions.tsx`) | public | none | static `data/occasions.ts` | Grid linking to `/occasions/:occasionId`. |
| `/occasions/:occasionId` | dynamic | `occasionId` | `OccasionDetail` (`src/pages/OccasionDetail.tsx`) | public | none | static `data/products.ts` filtered by `product.occasions` + `FilterContext` | |
| `/stores` | static | – | `Stores` (`src/pages/Stores.tsx`) | public | none | static `data/stores.ts` | Physical store locator cards (map link, WhatsApp). |
| `/search` | static | – | `Search` (`src/pages/Search.tsx`) | public | none | Algolia `InstantSearch` (`src/lib/algoliaClient.ts`), `?q=` seeds initial query | Also renders `BrandSearchResults` (Supabase-backed brand stores) alongside Algolia hits. |
| `/category/:slug` | dynamic | `slug` | `CategoryPage` (`src/pages/CategoryPage.tsx`) | public | none | `getCategoryBySlug()` (`data/oguraCategories.ts`) static config | Special-case: `slug==='made-to-order'` renders `MadeToOrderPage` instead. Unknown slug → `<Navigate to="/" replace/>`. |
| `/join` | static | – | `JoinUs` (`src/pages/JoinUs.tsx`) | public | none | `supabase.auth` (signup/login), `supabase.from('seller_applications')`-style insert (in later step), Storage upload | Multi-step: hero → auth (login/signup tabs) → apply form → success. |
| `/join/apply` | static | – | `SellerApply` (`src/pages/SellerApply.tsx`) | public | none | `supabase.storage.from('product-images').upload`, `supabase.from('seller_applications').insert` | zod-validated form; standalone (no login required to apply). |
| `/privacy` | static | – | `PrivacyPolicy` (`src/pages/PrivacyPolicy.tsx`) | public | none | none (static content) | Wrapped in `CustomerLayout`. |
| `/terms` | static | – | `TermsOfUse` (`src/pages/TermsOfUse.tsx`) | public | none | none (static content) | Wrapped in `CustomerLayout`. |
| `/contact` | static | – | `Contact` (`src/pages/Contact.tsx`) | public | none | none — submits via `mailto:` link (no backend call) | zod-validated form; "submission" opens the user's email client. |
| `/careers` | static | – | `Careers` (`src/pages/Careers.tsx`) | public | none | none — form target is `careers@ogura.in` (mailto-style intended) | zod schema defined; 931-line static content page with accordions per role. |
| `/seller-program` | static | – | `BrandWaitlist` (`src/pages/BrandWaitlist.tsx`) | public | none | `WaitlistForm`/`WaitlistSection` components (likely Supabase insert — see 14) | Sets `document.title` and meta description manually (page-level SEO). |
| `/waitlist` | static (redirect) | – | `<Navigate to="/seller-program" replace/>` | public | none | – | Legacy redirect. |
| `/apply-to-join` | static (redirect) | – | `<Navigate to="/seller-program" replace/>` | public | none | – | Legacy redirect. |
| `/auth/pinterest/callback` | static | – | `PinterestCallback` (`src/pages/PinterestCallback.tsx`) | public | none | `supabase.functions.invoke('pinterest-token-exchange')` | Reads `?code=`, stores token in `localStorage` (`pinterest_token`, `pinterest_connected`, `pinterest_code`), auto-redirects to `/` after 2s. Hard-codes redirect_uri `https://coy-clone-studio.lovable.app/auth/pinterest/callback` (stale preview domain). [SECURITY-SENSITIVE: hardcoded external redirect URI, token stored in localStorage not httpOnly] |
| `/.lovable/oauth/consent` | static, internal | – | `OAuthConsent` (`src/pages/OAuthConsent.tsx`) | public route, but functionally requires session | none (manual session check inside component) | `supabase.auth.oauth.getAuthorizationDetails/approveAuthorization/denyAuthorization` (beta Supabase Auth OAuth-provider API), `supabase.auth.getSession()` | Hidden/internal route (not linked from nav) implementing an OAuth **authorization server** consent screen — OGURA acting as an OAuth provider for third-party MCP/app integrations. Redirects unauthenticated users to `/login?next=...`. [SECURITY-SENSITIVE: approves third-party app access to the user's OGURA account/data based on scopes returned by the authorization server] |
| `/dashboard` | static | – | `Dashboard` (`src/pages/Dashboard.tsx`) | auth | `ProtectedRoute` | none directly (reads `useAuth().user`) | Customer account home; quick links to Orders (`/orders` — **not a registered route**, dead link [OBSERVED]), Wishlist, Cart, `/profile#addresses`. |
| `/onboarding` | static | – | `Onboarding` (`src/pages/Onboarding.tsx`) | auth | `ProtectedRoute` | `completeOnboarding()` → `supabase.from('profiles').update({is_onboarded:true})` | Category/notification preference UI is **local state only** — preferences are never persisted to Supabase, only the `is_onboarded` flag is. [OBSERVED] |
| `/profile` | static | – | `Profile` (`src/pages/Profile.tsx`) | auth | `ProtectedRoute` | `supabase.from('profiles').update(...)` | Also a stub "Saved Addresses" section (always shows empty state; no `user_addresses` fetch here) and disabled "coming soon" notification toggles. |
| `/wishlist` | static | – | `Wishlist` (`src/pages/Wishlist.tsx`) | auth | `ProtectedRoute` | `WishlistContext` (localStorage-backed, see 15) | Move-to-cart moves first size/color only. |
| `/cart` | static | – | `Cart` (`src/pages/Cart.tsx`) | auth | `ProtectedRoute` | `CartContext`, `LocationContext` (address) | Empty-state screen when `items.length===0`. |
| `/checkout` | static | – | `Checkout` (`src/pages/Checkout.tsx`) | auth | `ProtectedRoute` | `supabase.from('discounts')` (code validation), `supabase.functions.invoke('razorpay-create-order')`, `supabase.functions.invoke('razorpay-verify-payment')`, Razorpay Checkout.js (loaded via injected `<script>`) | Redirects to `/cart` if cart empty. On success navigates to `/order-confirmation` with order state in router `location.state` (not persisted in URL — refresh loses data). |
| `/order-confirmation` | static | – | `OrderConfirmation` (`src/pages/OrderConfirmation.tsx`) | auth | `ProtectedRoute` | none (reads `location.state` only) | Redirects to `/` if no `state.orderNumber` (e.g. on refresh/direct nav) — success page cannot be reloaded or deep-linked. [OBSERVED] |
| `*` (catch-all) | static | – | `NotFound` (`src/pages/NotFound.tsx`) | public | none | none | Logs `console.error` with attempted path; plain 404 (not styled with app shell). |

### Also referenced but declared inside other route components (not top-level `Route`s)
- `MadeToOrderPage` (`src/pages/MadeToOrderPage.tsx`) is reached only via `/category/made-to-order` (conditional render inside `CategoryPage`), not its own `<Route>`. [OBSERVED]

## B. SellerApp (`src/apps/SellerApp.tsx`) — `sellers.` subdomain or `/seller*` path

| Path | Static/Dynamic | Component (file) | Access | Guard | Layout | Data | Notes |
|---|---|---|---|---|---|---|---|
| `/join` | static | `JoinUs` (shared with customer app) | public | none | none | see above | Seller app also serves the customer `/join` marketing/apply flow. |
| `/seller` | static | `SellerLanding` (`src/pages/seller/SellerLanding.tsx`) | public | none | `SellerPublicLayout` | none (static marketing content: benefits, commission tiers, testimonials) | |
| `/seller/join` | static | `SellerLanding` | public | none | `SellerPublicLayout` | same | Alias of `/seller`. |
| `/seller-login` | static | `SellerLogin` (`src/pages/seller/SellerLogin.tsx`) | public | none | none (bare) | `signInWithEmail` (Supabase Auth), `GoogleSignInButton` | Duplicate of `/seller/login` with a different URL shape. |
| `/seller-signup` | static | `SellerSignup` (`src/pages/seller/SellerSignup.tsx`) | public | none | none | `signUpWithEmail` (auto-inserts `sellers` row + `user_roles` row with `role:'seller'`) | Duplicate of implicit signup flow; `/seller/signup` is NOT registered (only `/seller-signup`). [OBSERVED] |
| `/seller/login` | static | `SellerLogin` | public | none | none | same as `/seller-login` | |
| `/seller/dashboard` | static | `SellerDashboardHome` (`src/pages/seller/SellerDashboardHome.tsx`) | auth | `SellerAuthRoute` (no role/seller-row check) | `SellerDashboardLayout` | none (all stats hard-coded to 0/—, static placeholder) | |
| `/seller/products` | static | `SellerProducts` (`src/pages/seller/SellerProducts.tsx`) | auth | `SellerAuthRoute` | `SellerDashboardLayout` | `supabase.from('sellers').eq('user_id',user.id)` → `supabase.from('products').eq('seller_id', sellerId)` | Table view w/ status badges. |
| `/seller/products/new` | static | `SellerAddProduct` (`src/pages/seller/SellerAddProduct.tsx`) | auth | `SellerAuthRoute` | `SellerDashboardLayout` | `supabase.storage.from('product-images').upload`, `supabase.from('products').insert(status:'submitted')` | Full product form: sizes, colors, occasion/style tags, material/care. |
| `/seller/orders` | static | `SellerOrders` (`src/pages/seller/SellerOrders.tsx`) | auth | `SellerAuthRoute` | `SellerDashboardLayout` | `supabase.from('sellers')` → `supabase.from('orders').eq('seller_id',...)` | Read-only order list. |
| `/seller/settings` | static | `SellerSettings` (`src/pages/seller/SellerSettings.tsx`) | auth | `SellerAuthRoute` | `SellerDashboardLayout` | `supabase.from('sellers').select('*')/.update(...)` | Edits `brand_name`, `city`, `instagram_handle`, `description`; shows read-only `application_status`/`seller_type`. |
| `/seller/*` (catch-all) | static | `SellerLanding` | public | none | `SellerPublicLayout` | none | No real 404 for the seller app — any unmatched `/seller/...` path renders the landing page. |

## C. AdminApp (`src/apps/AdminApp.tsx`) — `admin.` subdomain or `/admin*` path

| Path | Static/Dynamic | Component (file) | Access | Guard | Layout | Data | Notes |
|---|---|---|---|---|---|---|---|
| `/admin` | static | `AdminLogin` (`src/pages/admin/AdminLogin.tsx`) | public | none | none | `useAuth`, `useUserRole` | Shows "Access Restricted" inline if authenticated but not admin role; otherwise Google sign-in only (no email/password on admin). |
| `/admin/login` | static | `AdminLogin` | public | none | none | same | Duplicate of `/admin`. |
| `/admin/dashboard` | static | `AdminDashboardHome` (`src/pages/admin/AdminDashboardHome.tsx`) | admin | `RoleProtectedRoute requiredRole="admin"` | `AdminDashboardLayout` | none — all KPI cards render `—` placeholders | "Approval Queue" section says workflow "will be built in Phase 3" though `/admin/approvals` already implements it — stale copy. [OBSERVED] |
| `/admin/approvals` | static | `AdminApprovals` (`src/pages/admin/AdminApprovals.tsx`) | admin | `RoleProtectedRoute` | `AdminDashboardLayout` | `supabase.from('products').eq('status','pending')`, `.update({status:'live'})` / `.update({status:'rejected', rejection_reason})` | Approve/Reject actions with a reject-reason dialog. |
| `/admin/products` | static | `AdminProducts` (`src/pages/admin/AdminProducts.tsx`) | admin | `RoleProtectedRoute` | `AdminDashboardLayout` | `supabase.from('products')` with status filter + client-side title search, `.limit(200)` | Read-only catalogue browser. |
| `/admin/sellers` | static | `AdminSellers` (`src/pages/admin/AdminSellers.tsx`) | admin | `RoleProtectedRoute` | `AdminDashboardLayout` | `supabase.from('sellers').select(...)`, `.update({application_status:'approved', is_verified:true})` | Approve action's toast claims "Seller role has been assigned" but the client code does **not** insert into `user_roles`— role assignment must happen via a DB trigger/edge function not visible in this component. [OBSERVED — verify against DB triggers] |
| `/admin/settings` | static | `AdminSettings` (`src/pages/admin/AdminSettings.tsx`) | admin | `RoleProtectedRoute` | `AdminDashboardLayout` | none (reads `useAuth().user` only) | Read-only account info display. |
| `/admin/*` (catch-all) | static | `AdminLogin` | public | none | none | – | No true 404; unmatched paths render login. |

## D. Route Count Summary

| Category | Count |
|---|---|
| TOTAL distinct `<Route>` declarations (all 3 routers) | 52 |
| PUBLIC (no auth required) | 34 |
| AUTH (any logged-in user) | 7 |
| SELLER (authenticated, seller layout, no role check) | 6 |
| ADMIN (role-gated `admin`) | 6 |
| HIDDEN / not in nav (`/.lovable/oauth/consent`, `/auth/pinterest/callback`, `/apply-to-join`, `/waitlist`, seller/admin catch-alls) | 6 |
| LEGACY REDIRECTS (`Navigate` to another route) | 2 (`/waitlist`, `/apply-to-join`) |
| UNKNOWN / ambiguous access (duplicate brand/designer routes, dead `:category` param) | 4 (`/brand/:slug` vs `/store/:slug` duplication, `/designers/:designerId` vs `/designer/:slug` duplication, `/collections/:category` dead param) |

Note: counts overlap by category (e.g., a hidden route is also public); totals are informational, not mutually exclusive partitions except TOTAL.
