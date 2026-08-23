# OGURA — Complete Website Structure & Content Map

Stack: React 18 + Vite 5 + TypeScript + Tailwind + shadcn/ui, React Router, TanStack Query, Lovable Cloud backend (Postgres + Auth + Storage + Edge Functions), Framer Motion / GSAP / Lenis for the luxury 3D layer.

Live domains: `ogura.in` (customer), `admin.ogura.in` (admin, provisioning), seller subdomain (seller portal). Domain is resolved in `src/lib/domainDetection.ts` and `src/App.tsx` renders one of three apps.

---

## 1. Application Shell

| File | Role |
|---|---|
| `src/main.tsx` | React root mount |
| `src/App.tsx` | Providers: QueryClient → Tooltip → Auth → Location → Cart → Filter → Wishlist → Toasters → BrowserRouter → `AppRouter` |
| `src/apps/CustomerApp.tsx` | All customer routes + global location modals |
| `src/apps/SellerApp.tsx` | Seller portal routes |
| `src/apps/AdminApp.tsx` | Admin routes (role-protected) |
| `src/layouts/CustomerLayout.tsx` | Header + main + LuxuryFooter |
| `src/layouts/SellerPublicLayout.tsx` / `SellerDashboardLayout.tsx` / `AdminDashboardLayout.tsx` | Portal shells (sidebar + header) |
| `index.html` | SEO title/description, OpenGraph + Twitter card, `og-image.jpg`, `og:video` hero reel, favicon (pink “O”) |
| `src/index.css` | Design tokens, `--ogura-pink` brand tokens, museum/“Atelier of Light” cinematic utilities, editorial typography classes |

---

## 2. Customer Site (`ogura.in`)

### `/` — Home (`src/pages/Index.tsx`)
Section order:
1. `LuxuryHeader` — logo image (pink OGURA wordmark, 1.5x), mega menu (Women / Men / Brands / Designers / Occasions / Stores / **Careers**), location indicator, wishlist, cart, user menu. No global search input (project constraint).
2. `LuxuryHero` — full-bleed cinematic hero, “Fashion that defines you.”
3. `Premium3DCategorySection` — 3D tilt category cards.
4. `SellerNewArrivals` — **New Arrivals** carousel, fetched live from the Seller Center API (`https://pyesltzkemtranachpne.supabase.co/functions/v1/products`), newest seller products with image/name/price.
5. **Museum band** (`museum-surface` + gold glow, grain, vignette, cursor spotlight):
   - `HiddenGemsSection` — “Hidden Gems / OGURA Social”, large featured couture image + 3D mouse-follow tilt & gold light sweep.
   - `CategoryShowcase` — Dresses / Footwear / Bags / Bottoms / Outerwear hero cards, each clickable → `/collections/:slug`.
   - `DesignersSpotlight` → `AzaDesignerCarousel` — designer cards from the `designers` table with glass overlays and 3D transforms.
   - `LuxuryTrustBadges` — authenticity / delivery / returns trust row.
   - `LuxuryBrands` — brand logo wall.
   - `LuxuryGiftCard` — gift card promo block.
   - `LuxuryStoreLocator` — store cards with map/WhatsApp links.
6. `LuxuryFooter` — logo, link columns, legal links, social.

### Catalog & discovery
| Route | File | Content |
|---|---|---|
| `/collections`, `/collections/:category` | `Collections.tsx` | Breadcrumb (Home / Collections), filter chips + “Clear all”, responsive product card grid (image, name, brand, price, wishlist, Buy Now). Data: seller products from Lovable Cloud `products` merged with external Seller Center API; skeleton-card loading state; empty state “No products available — Try adjusting your filters or check back later.” |
| `/product/:id` | `ProductDetail.tsx` (681 lines) | Gallery (`ProductImageGallery`), optional `<video>` player when `videoUrl` present, name, brand, price + “Inclusive of all taxes”, Color / Size selectors + `SizeGuideModal`, quantity, Add to Cart / Buy Now, wishlist, `DeliveryChecker` + address modal, trust rows (Free Delivery over ₹999, Easy Returns, COD under ₹10,000), `ProductDetailsAccordion` (description, material & care; “Description is pending review” when status = submitted), `VirtualTryOnDialog`, `ViewSimilarModal`, `SimilarProductsGrid`, `RecommendationCarousel`. Error state “Product not found → Browse Collections”. |
| `/category/:slug` | `CategoryPage.tsx` | Category hero (image or video), sub-category scroll, featured collection grids, Luxe Edit section, product grid. Slugs: `celebrity-fashion` (adds `CelebrityIconsSection`), `occasion-wear`, `co-ord-sets`, `street-casual`, `footwear-edit`, `bags-accessories`, `limited-drops`, `made-to-order` (delegates to `MadeToOrderPage`). |
| `/search` | `Search.tsx` | “Search Results” — Algolia components (search box, refinement lists, price range, product hits, mobile filters, no-results, trending). |
| `/brands`, `/brands/:brandId` | `Brands.tsx`, `BrandDetail.tsx` | “All Brands” card grid (logo, description, product count, Instagram badge + follower count). Detail: banner, badges, gallery, product grid; “Brand not found” fallback. |
| `/designers`, `/designers/:designerId`, `/designer/:slug` | `Designers.tsx`, `DesignerDetail.tsx`, `DesignerProfilePage.tsx` | “Curated Selection / Designer Labels” with debounced search + category filter and realtime `designers` subscription. Detail: profile, city, category, price range, Instagram followers, gallery. Profile page: designer products grid + filter sheet. |
| `/occasions`, `/occasions/:occasionId` | `Occasions.tsx`, `OccasionDetail.tsx` | “Shop by Occasion” image tiles; detail page = filter bar + product grid + wishlist. |
| `/stores` | `Stores.tsx` | “Our Stores — Visit us at any of our locations”: name, address, city, phone, hours, map link, WhatsApp. |
| `/category/made-to-order` | `MadeToOrderPage.tsx` | 6-step designer-led customization: hero, entry paths, inspiration upload, base design gallery, designer selector, customization panel, progress indicator (state in `MadeToOrderContext`). |

### Commerce (protected)
| Route | File | Content |
|---|---|---|
| `/cart` | `Cart.tsx` | Line items, delivery address card/selector, Order Summary (Subtotal, Delivery, Tax 18% GST, Total). Empty: “Your cart is empty — Add some items to get started → Browse Collections”. |
| `/checkout` | `Checkout.tsx` (504 lines) | Stepper Cart → Checkout → Confirmation; delivery address block, item review, Payment Summary, Razorpay payment, “Free delivery on orders above ₹999”, “Easy 7-day returns”, accepted payment methods. |
| `/order-confirmation` | `OrderConfirmation.tsx` | “Order Confirmed!”, order number, payment ID, total, delivery address, What’s Next (confirmation email, ship in 2–3 business days, SMS/email tracking). |
| `/wishlist` | `Wishlist.tsx` | Saved product grid, remove/move-to-cart. |
| `/dashboard` | `Dashboard.tsx` | Customer account overview: avatar, name/email/phone, “Explore New Arrivals”. |
| `/profile` | `Profile.tsx` | Full name, email, phone, Google Sign-In state, saved addresses (“No saved addresses yet”), notification prefs (Order Updates / Promotional Emails — “Coming soon”). |
| `/onboarding` | `Onboarding.tsx` | Interests picker (“What interests you?”) + “Stay Updated” opt-in. |

### Auth, marketing & legal
| Route | File | Content |
|---|---|---|
| `/login` | `Login.tsx` | Split screen — brand panel with stats (Designers / Products / Cities) + “Welcome Back”, Google sign-in (canonical origin strips `www.`), email/password. |
| `/join` | `JoinUs.tsx` | Seller pitch + journey timeline + gated Seller Application form (Full Name, Brand Name, Email, Phone, City, Category, Portfolio/Instagram, sample images) → “Application Submitted!”. Sign-in gate: Log In / Sign Up tabs. |
| `/join/apply` | `SellerApply.tsx` | Standalone application: name, brand/studio, email, phone, city, category (Fashion Designer / Boutique / Custom Tailor), portfolio link, sample design uploads (Zod validated). |
| `/careers` | `Careers.tsx` (931 lines) | “Careers at OGURA”, work model chips (Remote · Internship · Flexible hours), Fashion Commerce + Tech departments, 16 role accordions (About the role, What you’ll do, Preferred background/qualifications, Who can apply), and Apply Now form (name, email, phone, portfolio/LinkedIn, role, message) → `careers@ogura.in`. Pink brand accents. |
| `/contact` | `Contact.tsx` | “Contact Us” — Email `brands@ogura.in`, Phone `9897014111`, Studio / India; form: first name, mobile number, email, message + consent checkbox. |
| `/privacy` | `PrivacyPolicy.tsx` | Effective March 17, 2025 — Information We Collect, How We Use It, Communication Consent (TRAI), Sharing, Security, Cookies, Your Rights, Retention, Changes, Contact. |
| `/terms` | `TermsOfUse.tsx` | Terms of Use — usage, orders, IP, liability, governing law (India). |
| `/auth/pinterest/callback` | `PinterestCallback.tsx` | “Connecting Pinterest…” → Connected / Failed → redirect home. |
| `/.lovable/oauth/consent` | `OAuthConsent.tsx` | MCP OAuth 2.1 consent: app identity, “Permissions requested:”, approve/deny, error state. |
| `*` | `NotFound.tsx` | “Oops! Page not found”. |

---

## 3. Seller Portal (`src/apps/SellerApp.tsx`)

| Route | File | Content |
|---|---|---|
| `/seller`, `/seller/join` | `SellerLanding.tsx` | “Why Sell on Ogura?”, transparent commission tiers (Standard / Growth / Premium), testimonials, “Ready to Start Selling?”, Seller Login CTA. |
| `/seller-login`, `/seller/login` | `SellerLogin.tsx` | “Sign in to your seller dashboard” — email/password + Google. |
| `/seller-signup` | `SellerSignup.tsx` | “Create your seller account”. |
| `/seller/dashboard` | `SellerDashboardHome.tsx` | KPI cards: Total Products, Total Orders, Revenue (this month), Growth; empty states. |
| `/seller/products` | `SellerProducts.tsx` | Table: Product, Category, Price, Status, Created; “No products yet — Add your first product to get started.” |
| `/seller/products/new` | `SellerAddProduct.tsx` | Shopify-style form: Product Images*, Basic Details (Title*, Category*, Dispatch Days, Description), Pricing (Selling Price*, MRP), Available Sizes, Available Colors, Tags / Occasion Tags / Style Tags, Material & Care (Material, Fabric, Care Instructions). Products are created as `submitted`. |
| `/seller/orders` | `SellerOrders.tsx` | Table: Order #, Status, Total, Date. |
| `/seller/settings` | `SellerSettings.tsx` | Store Profile (Brand Name, City, Instagram Handle, Description) + Application Status / Seller Type. |
| Extra dashboard modules | `src/components/seller-dashboard/pages/*` | Home, Products, Add Product, Inventory, Collections, Orders, Customers, Discounts, Gift Cards, Marketing, Markets, Transfers, Analytics, Content, Settings. |

Guard: `SellerAuthRoute` (dev mode falls back to `DEV_SELLER_ID`).

---

## 4. Admin Portal (`admin.ogura.in`)

| Route | File | Content |
|---|---|---|
| `/admin`, `/admin/login` | `AdminLogin.tsx` | “Access Restricted” + Google sign-in, role checked via `useUserRole`. |
| `/admin/dashboard` | `AdminDashboardHome.tsx` | Platform KPI cards. |
| `/admin/approvals` | `AdminApprovals.tsx` | Approval Queue — approve/reject submitted products & sellers. |
| `/admin/products` | `AdminProducts.tsx` | All Products table (Product, Category, Price, Status, Created) with status filter: Draft / Pending / Live / Rejected. |
| `/admin/sellers` | `AdminSellers.tsx` | Seller Management table (Brand, City, Type, Status, Applied, Actions); “No sellers yet”. |
| `/admin/settings` | `AdminSettings.tsx` | Account: Name, Email, Role. |

Guard: `RoleProtectedRoute requiredRole="admin"`.

---

## 5. Shared Components (by domain)

- **Chrome:** `LuxuryHeader`, `Header`, `MegaMenu`, `MegaMenuMobile`, `NykaaStyleMegaMenu`, `LuxuryFooter`, `Footer`, `HeaderLocationIndicator`.
- **Product:** `PLPProductCard/Grid/FilterSidebar/SortDropdown`, `ProductGrid`, `ProductCarousel`, `ProductImageGallery`, `ProductDetailsAccordion`, `SimilarProductsGrid`, `RecommendationCarousel`, `OptimizedImage`.
- **Luxury 3D:** `luxury3d/Tilt3D`, `luxury3d/ParallaxLayer`, `Spline3DBackground`, `CinematicHeroBanner`, `FullScreenHeroCarousel`.
- **Category:** `category/CategoryHeroBanner`, `SubCategoryScroll`, `FeaturedCollectionGrid`, `LuxeEditSection`, `CategoryProductGrid`, `CelebrityIconsSection`.
- **Made to order:** `made-to-order/*` (hero, entry paths, inspiration upload, base gallery, designer selector, customization panel, progress).
- **Search:** `search/Algolia*` set.
- **Location & delivery:** `LocationPermissionModal`, `ManualLocationSelector`, `DeliveryChecker`, `AddressCard`, `AddressForm`, `AddressSelectionModal`.
- **AI / social:** `VirtualTryOn(+Dialog)`, `TryOnHistory`, `TryOnResult`, `ModelGallery`, `ModelPresetSelector`, `AIStylistCTA`, `ImageSearchDialog`, Pinterest components (`ConnectPinterestButton`, `PinterestBoardModal`, `UserPinterestBoards`), `SocialShareButtons`, `SaveToPinterestButton`.
- **Auth:** `auth/GoogleSignInButton`, `ProtectedRoute`, `RoleProtectedRoute`, `SellerAuthRoute`, `UserMenu`.
- **UI kit:** full shadcn set in `src/components/ui/` (48 primitives).

## 6. State, Hooks, Data

- **Contexts:** `AuthContext` (shared users/sellers, Google OAuth, canonical origin), `CartContext`, `WishlistContext`, `FilterContext`, `LocationContext` (IP + PIN detection), `MadeToOrderContext`.
- **Hooks:** `useDesigners`, `useDesignerBySlug`, `useDesignerProducts`, `useRecommendations`, `useVirtualTryOn`, `useUserRole`, `useLenis`, `useGsapReveal`, `useScrollAnimation`, `use-mobile`, `use-toast`.
- **Static data:** `products.ts`, `brands.ts`, `menuData.ts` (women/men menus, featured + all brands, top nav, filters), `oguraCategories.ts` (8 categories + celebrities), `occasions.ts`, `stores.ts`, `indianLocations.ts` (states/cities/pincodes), `modelPresets.ts`, `pinterestMockData.ts`.
- **Types:** `src/types/index.ts` — `Product` (incl. `videoUrl`, `colorVariants`), `CartItem`, `User`, `FilterState`, `Brand`, `Occasion`, `Store`, `Designer`, `DesignerProduct`, `ProductFilters`, `UserAddress`.

## 7. Backend (Lovable Cloud)

**Tables:** `profiles`, `user_roles` (+`has_role()`), `sellers`, `seller_applications`, `vendors`, `products`, `product_variants`, `categories`, `orders`, `order_items`, `payouts`, `discounts`, `designers`, `influencer_videos`, `user_addresses`, `delivery_zones`, `otp_verifications`, `tryon_history`, `support_tickets` — all RLS-enabled with explicit grants.

**Edge functions:** `ai-recommendations`, `image-analysis`, `generate-banner-image`, `virtual-tryon`, `ip-geolocation`, `pincode-lookup`, `pinterest-token-exchange`, `razorpay-create-order`, `razorpay-verify-payment`, `send-otp`, `verify-otp`, `social-post-webhook`, `sync-algolia`, `mcp`.

**External API:** Seller Center products endpoint `https://pyesltzkemtranachpne.supabase.co/functions/v1/products` used by Collections, Product Detail fallback, and homepage New Arrivals.

**Agent integrations (MCP):** `src/lib/mcp/*` tools — `search-products`, `get-product`, `list-my-orders`; OAuth 2.1 consent screen; manifest at `.lovable/mcp/manifest.json`.

## 8. Product Lifecycle & Roles

`submitted` → admin review → `live` | `rejected` (DB constraint enforces initial `submitted`). Roles: `consumer`, `seller`, `admin` stored in `user_roles` only.
