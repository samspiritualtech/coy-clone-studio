# 12 — Page Inventory (one row per file under src/pages/**)

| Route file | Route(s) | Purpose | User type | Data source | Key components | Status |
|---|---|---|---|---|---|---|
| src/pages/Index.tsx | `/` | Marketing homepage | Public | static/child-fetched | LuxuryHeader, LuxuryHero, Premium3DCategorySection, SellerNewArrivals, HiddenGemsSection, CategoryShowcase, DesignersSpotlight, LuxuryTrustBadges, LuxuryBrands, LuxuryGiftCard, LuxuryStoreLocator, LuxuryFooter | Active |
| src/pages/Login.tsx | `/login` | Customer auth entry | Public/Auth | Supabase Auth via AuthContext | GoogleSignInButton | Active |
| src/pages/Collections.tsx | `/collections`, `/collections/:category` | Product listing (all/category) | Public | supabase `products` + external fn API + static | Header, Footer, Breadcrumb | Active, dead `:category` param |
| src/pages/ProductDetail.tsx | `/product/:id` | PDP | Public | supabase `products` + external API fallback | ProductImageGallery, VirtualTryOnDialog, RecommendationCarousel, SimilarProductsGrid, AddressSelectionModal, ProductDetailsAccordion, DeliveryChecker | Active, largest page (685 lines) |
| src/pages/Cart.tsx | `/cart` | Shopping cart | Auth | CartContext, LocationContext | AddressSelectionModal, AddressCard | Active |
| src/pages/Checkout.tsx | `/checkout` | Checkout + payment | Auth | supabase `discounts`, edge fns razorpay-create-order/verify-payment | AddressSelectionModal, AddressCard | Active |
| src/pages/OrderConfirmation.tsx | `/order-confirmation` | Post-payment confirmation | Auth | router `location.state` only | none special | Active, not deep-linkable |
| src/pages/Brands.tsx | `/brands` | Brand directory | Public | useBrandStores hook + static `data/brands.ts` | OptimizedImage | Active |
| src/pages/BrandDetail.tsx | `/brands/:brandId` | Legacy static brand page | Public | static `data/brands.ts`/`products.ts` | DesignerGallery, ProductGrid | Active but duplicate concept vs BrandStore |
| src/pages/BrandStore.tsx | `/store/:slug`, `/brand/:slug` | Live seller brand storefront | Public | `fetchBrandStores()` (Supabase) | OptimizedImage, Breadcrumb | Active |
| src/pages/BrandWaitlist.tsx | `/seller-program` | Seller-program marketing/waitlist landing | Public | WaitlistForm/WaitlistSection (likely Supabase insert) | JourneyTimeline-like sections | Active, largest marketing page (486 lines) |
| src/pages/Designers.tsx | `/designers` | Designer directory | Public | useDesigners hook + realtime subscription | AzaDesignerCard, DesignerFilters | Active |
| src/pages/DesignerDetail.tsx | `/designers/:designerId` | Legacy designer detail | Public | useDesigner hook | DesignerGallery | Active, duplicate of DesignerProfilePage |
| src/pages/DesignerProfilePage.tsx | `/designer/:slug` | Rich designer storefront | Public | useDesignerBySlug/useDesignerProducts/useDesignerCategories | DesignerProductFilters, DesignerProductGrid, Sheet (mobile filters) | Active |
| src/pages/Occasions.tsx | `/occasions` | Occasion directory | Public | static `data/occasions.ts` | OptimizedImage | Active |
| src/pages/OccasionDetail.tsx | `/occasions/:occasionId` | Occasion PLP | Public | static `data/products.ts` + FilterContext | FilterBar, Breadcrumb | Active |
| src/pages/CategoryPage.tsx | `/category/:slug` | Category landing (luxury editorial) | Public | static `data/oguraCategories.ts` | CategoryHeroBanner, SubCategoryScroll, FeaturedCollectionGrid, LuxeEditSection, CategoryProductGrid, CelebrityIconsSection | Active; delegates to MadeToOrderPage for `made-to-order` slug |
| src/pages/MadeToOrderPage.tsx | reached via `/category/made-to-order` | Made-to-order design flow | Public | MadeToOrderContext (local state) | MTOHeroSection, MTOEntryPaths, MTOProgressIndicator, MTOInspirationUpload, MTODesignerSelector, MTOBaseDesignGallery, MTOCustomizationPanel | Active, not a top-level route |
| src/pages/Stores.tsx | `/stores` | Physical store locator | Public | static `data/stores.ts` | none special | Active |
| src/pages/Search.tsx | `/search` | Search results | Public | Algolia InstantSearch + useBrandStores | AlgoliaFilterSidebar, AlgoliaMobileFilters, AlgoliaSearchResults, BrandSearchResults | Active |
| src/pages/JoinUs.tsx | `/join` (both apps) | Seller acquisition funnel (hero→auth→apply→success) | Public/Auth transition | Supabase Auth, Storage upload, seller_applications insert | GoogleSignInButton, JourneyTimeline, ImageUploadZone | Active, largest hybrid flow (342 lines) |
| src/pages/SellerApply.tsx | `/join/apply` | Standalone seller application form | Public | supabase Storage + `seller_applications` insert | ImageUploadZone | Active |
| src/pages/Contact.tsx | `/contact` | Contact form | Public | none (mailto) | CustomerLayout | Active |
| src/pages/Careers.tsx | `/careers` | Careers listing + application | Public | none (mailto intended) | Accordion, CustomerLayout | Active, largest static page (931 lines) |
| src/pages/PrivacyPolicy.tsx | `/privacy` | Legal | Public | none | CustomerLayout | Active |
| src/pages/TermsOfUse.tsx | `/terms` | Legal | Public | none | CustomerLayout | Active |
| src/pages/Dashboard.tsx | `/dashboard` | Customer account home | Auth | useAuth only | quick-link Cards | Active, links to non-existent `/orders` |
| src/pages/Onboarding.tsx | `/onboarding` | Post-signup preference collection | Auth | supabase `profiles.is_onboarded` only | Checkbox, Card | Active, preferences not persisted |
| src/pages/Profile.tsx | `/profile` | Account settings | Auth | supabase `profiles.update` | Avatar, Card | Active, addresses/notifications stubbed |
| src/pages/Wishlist.tsx | `/wishlist` | Saved items | Auth | WishlistContext (localStorage) | Card | Active |
| src/pages/PinterestCallback.tsx | `/auth/pinterest/callback` | OAuth token exchange callback | Public | edge fn `pinterest-token-exchange` | none special | Active, hardcoded stale redirect_uri |
| src/pages/OAuthConsent.tsx | `/.lovable/oauth/consent` | 3rd-party OAuth consent screen | Auth (session-gated inline) | `supabase.auth.oauth.*` (beta API) | Card | Active, internal/hidden |
| src/pages/NotFound.tsx | `*` (CustomerApp only) | 404 | Public | none | none | Active, unstyled with app shell |
| src/pages/seller/SellerLanding.tsx | `/seller`, `/seller/join`, seller catch-all | Seller marketing landing | Public | static content | Card | Active |
| src/pages/seller/SellerLogin.tsx | `/seller-login`, `/seller/login` | Seller login | Public | Supabase Auth | GoogleSignInButton | Active |
| src/pages/seller/SellerSignup.tsx | `/seller-signup` | Seller signup | Public | Supabase Auth, auto-inserts `sellers`+`user_roles` | GoogleSignInButton | Active |
| src/pages/seller/SellerDashboardHome.tsx | `/seller/dashboard` | Seller dashboard overview | Seller (auth) | none (static placeholders) | Card KPIs | Active, no real data |
| src/pages/seller/SellerProducts.tsx | `/seller/products` | Seller product list | Seller (auth) | supabase `sellers`→`products` | Table | Active |
| src/pages/seller/SellerAddProduct.tsx | `/seller/products/new` | Add product form | Seller (auth) | supabase Storage + `products.insert` | ImageUploadZone | Active |
| src/pages/seller/SellerOrders.tsx | `/seller/orders` | Seller order list | Seller (auth) | supabase `sellers`→`orders` | Table | Active, read-only |
| src/pages/seller/SellerSettings.tsx | `/seller/settings` | Seller profile settings | Seller (auth) | supabase `sellers.select/.update` | Card, Input | Active |
| src/pages/admin/AdminLogin.tsx | `/admin`, `/admin/login`, admin catch-all | Admin auth entry + access-denied state | Public | useAuth + useUserRole | GoogleSignInButton | Active |
| src/pages/admin/AdminDashboardHome.tsx | `/admin/dashboard` | Admin overview | Admin | none (placeholder KPIs) | Card | Active, stale copy re: approvals |
| src/pages/admin/AdminApprovals.tsx | `/admin/approvals` | Product approval queue | Admin | supabase `products` (status pending) | Table, Dialog | Active |
| src/pages/admin/AdminProducts.tsx | `/admin/products` | All-products browser | Admin | supabase `products` (limit 200) | Table, Select, Input | Active, read-only |
| src/pages/admin/AdminSellers.tsx | `/admin/sellers` | Seller management/approval | Admin | supabase `sellers` | Table | Active |
| src/pages/admin/AdminSettings.tsx | `/admin/settings` | Admin account info | Admin | useAuth only | Card | Active, read-only |
