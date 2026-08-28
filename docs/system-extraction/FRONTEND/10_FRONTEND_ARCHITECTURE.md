# 10 — Frontend Architecture (OGURA)

## 1. Stack [CONFIRMED]
- React 18.3.1 + TypeScript, bundled with Vite (`vite.config.ts`), SWC react plugin (`@vitejs/plugin-react-swc`).
- Styling: Tailwind CSS (`tailwind.config.ts`) + shadcn/ui (Radix primitives) + `tailwindcss-animate`.
- Data/state: `@tanstack/react-query` (QueryClient created once in `src/App.tsx`, but most pages use raw `useEffect` + `supabase` calls rather than React Query — see 14/15).
- Routing: `react-router-dom` v6 (`BrowserRouter`, nested `<Routes>` per "app").
- Backend: Lovable Cloud / Supabase (`@supabase/supabase-js`, client at `src/integrations/supabase/client.ts`), typed via generated `src/integrations/supabase/types.ts`.
- Search: Algolia (`algoliasearch`, `react-instantsearch`), client in `src/lib/algoliaClient.ts`.
- Auth: `@lovable.dev/cloud-auth-js` wrapper (`src/integrations/lovable/index.ts`) used for Google OAuth sign-in; Supabase Auth for session/password.
- MCP: `@lovable.dev/mcp-js` Vite plugin (`mcpPlugin()` in `vite.config.ts`) and `src/lib/mcp/*` tool definitions (get-product, list-my-orders, search-products) — exposes an MCP surface over Supabase, not used by the UI directly.
- Animation libs: `framer-motion`, `gsap` (+ `ScrollTrigger`), `lenis` (smooth scroll, `useLenis`).
- Misc: `zod` (form validation on a few forms), `date-fns`, `embla-carousel-react`, `recharts` (seller dashboard analytics, currently unused legacy `seller-dashboard/*` components), `sonner` + shadcn `toast` (two toast systems coexist — see 15).

## 2. Entry Point [CONFIRMED] — `src/main.tsx`
```
createRoot(document.getElementById("root")!).render(<App />);
```
No StrictMode wrapper. No error boundary at the root. Imports `./index.css` (Tailwind base + CSS custom properties for the design tokens consumed by `tailwind.config.ts`).

## 3. `src/App.tsx` — Provider Nesting [CONFIRMED]
Order (outer → inner):
1. `QueryClientProvider` (`new QueryClient()`, default options, module-scope singleton)
2. `TooltipProvider` (shadcn/radix tooltip context)
3. `AuthProvider` (`src/contexts/AuthContext.tsx`)
4. `LocationProvider` (`src/contexts/LocationContext.tsx`)
5. `CartProvider` (`src/contexts/CartContext.tsx`)
6. `FilterProvider` (`src/contexts/FilterContext.tsx`)
7. `WishlistProvider` (`src/contexts/WishlistContext.tsx`)
8. `<Toaster />` (shadcn) and `<Sonner />` (sonner) — both toast systems mounted globally, siblings, **not** nested inside `BrowserRouter`.
9. `BrowserRouter` → `AppRouter()`

`AppRouter` calls `detectDomain()` and switches between `CustomerApp`, `SellerApp`, `AdminApp` (see below). Only one of the three route trees is ever mounted at a time; there is no shared top-level `<Routes>`.

`MadeToOrderProvider` (`src/contexts/MadeToOrderContext.tsx`) is **not** global — it is mounted locally inside `src/pages/MadeToOrderPage.tsx` only, wrapping `MadeToOrderContent`.

## 4. Domain-based App Split [CONFIRMED] — `src/lib/domainDetection.ts`
```ts
export function detectDomain(): AppDomain // 'customer' | 'seller' | 'admin'
```
Logic:
- Hostname starts with `sellers.` → `'seller'`
- Hostname starts with `admin.` → `'admin'`
- Else, path-based fallback (dev/preview only): pathname starts with `/seller` → `'seller'`; starts with `/admin` → `'admin'`
- Otherwise → `'customer'`

`getBasePath(domain)` is exported (returns `/seller`, `/admin`, or `''`) but is **not used anywhere** in `AppRouter`, `CustomerApp`, `SellerApp`, or `AdminApp` — the three route trees register absolute paths (e.g. `/seller/dashboard`) directly rather than stripping a base path, so it is dead/unused helper code. [OBSERVED]

This means: in production, `sellers.ogura.in/dashboard` would render `SellerApp`, but `SellerApp`'s own routes are declared as `/seller/dashboard` etc. — i.e. the subdomain strategy and the path strategy are **inconsistent**: on `sellers.ogura.in` the app would need requests to `/seller/dashboard`, not `/dashboard`, to match a route. [CONFLICT] This is a structural risk worth flagging for reconstruction: either the subdomain deploy needs a path rewrite, or `SellerApp`'s routes need to be domain-relative.

### 4.1 `src/apps/CustomerApp.tsx` [CONFIRMED]
- Renders `<Routes>` with all customer-facing routes (see 11_ROUTE_MAP.md).
- No shared layout wrapper at the router level — each page imports its own `<Header/>`/`<Footer/>` or `<LuxuryHeader/>`/`<LuxuryFooter/>` combination directly (layout is NOT centralized; `CustomerLayout` exists but is only used by a handful of pages: `PrivacyPolicy`, `TermsOfUse`, `Contact`, `Careers`).
- Mounts `<LocationPermissionModal/>` and `<ManualLocationSelector/>` globally as siblings to `<Routes>` (always in the DOM, controlled by `LocationContext` state).

### 4.2 `src/apps/SellerApp.tsx` [CONFIRMED]
- Declares a local `WrappedRoute` helper: `<SellerAuthRoute><SellerDashboardLayout>{children}</SellerDashboardLayout></SellerAuthRoute>`.
- Public seller routes (`/seller`, `/seller/join`) use `<SellerPublicLayout>` inline.
- `/seller/login`, `/seller-login`, `/seller/signup`(`/seller-signup`) render bare (no layout wrapper).
- Catch-all `/seller/*` → `SellerPublicLayout` + `SellerLanding` (acts as a 404-to-landing fallback, not a real 404 page).

### 4.3 `src/apps/AdminApp.tsx` [CONFIRMED]
- `WrappedRoute` = `<RoleProtectedRoute requiredRole="admin" loginPath="/admin/login" unauthorizedRedirect="/"><AdminDashboardLayout>{children}</AdminDashboardLayout></RoleProtectedRoute>`.
- `/admin` and `/admin/login` both render `AdminLogin`. Catch-all `/admin/*` → `AdminLogin` (also not a true 404).

## 5. Layouts [CONFIRMED] — `src/layouts/*`
| File | Used by | Structure |
|---|---|---|
| `CustomerLayout.tsx` | `Contact`, `Careers`, `PrivacyPolicy`, `TermsOfUse` | `<Header/>` (optional) + `<main>` + `<LuxuryFooter/>` (optional), props `hideHeader`/`hideFooter` |
| `SellerPublicLayout.tsx` | seller marketing pages (`/seller`, `/seller/join`, seller catch-all) | Minimal sticky header (OGURA + "Partners" badge, Login/Apply links) + `<main>` + minimal footer with links back to customer site |
| `SellerDashboardLayout.tsx` | all authenticated seller dashboard routes | Fixed left sidebar (desktop) / slide-over sidebar (mobile) with nav items Dashboard/Products/Add Product/Orders/Settings, `<DashboardHeader/>` top bar, `useAuth().logout` wired to Sign Out |
| `AdminDashboardLayout.tsx` | all authenticated admin routes | Same visual pattern as seller layout but nav items Dashboard/Approvals/Products/Sellers/Settings, "Admin" badge in destructive color |

Most **customer** pages do NOT use `CustomerLayout` — they directly compose `<Header/>`/`<Footer/>` (classic e-commerce pages: Collections, ProductDetail, Cart, Checkout, Wishlist, Search, Brands, Stores, Occasions, BrandDetail, DesignerDetail) or `<LuxuryHeader/>`/`<LuxuryFooter/>` (editorial/marketing-styled pages: Index, CategoryPage, MadeToOrderPage, Dashboard, Profile, JoinUs, SellerApply, BrandWaitlist). This is a duplicated-header/footer pattern (`Header` vs `LuxuryHeader`, `Footer` vs `LuxuryFooter`) rather than one canonical shell — see 15_COMPONENT_RELATIONSHIPS.md for the duplication list. [OBSERVED]

## 6. Auth/Role Guards [CONFIRMED] — `src/components/auth/*`
- `ProtectedRoute.tsx`: requires `useAuth().isAuthenticated`; shows spinner while `isLoading`; redirects to `/login` with `state={{from: location}}` if unauthenticated. Used only in `CustomerApp`.
- `SellerAuthRoute.tsx`: requires `isAuthenticated`; redirects to `/join` (not `/seller/login`) if not. Used only in `SellerApp`. Does **not** check any seller-specific role or `sellers` table row — any authenticated user can reach `/seller/dashboard` even if they have no seller profile. [SECURITY-SENSITIVE]
- `RoleProtectedRoute.tsx`: requires `isAuthenticated` AND `useUserRole().hasRole(requiredRole)`; configurable `loginPath`/`unauthorizedRedirect`; shows an inline "Access Denied" card (not a redirect) when authenticated but wrong role. Used only in `AdminApp` with `requiredRole="admin"`.
- `useUserRole.ts` (`src/hooks/useUserRole.ts`): queries `public.user_roles` table for `role` rows matching `user.id`; returns `{roles, hasRole, isLoading}`. Roles observed in code: `'consumer' | 'seller' | 'admin'`.

## 7. Code Splitting [OBSERVED]
- **No `React.lazy` / `Suspense`-based route splitting anywhere in the app.** All three app trees (`CustomerApp`, `SellerApp`, `AdminApp`) statically import every page component at module top-level, and `App.tsx` statically imports all three app trees. This means the initial JS bundle contains customer, seller, and admin route code simultaneously regardless of which domain is detected at runtime. [MISSING: route-level code splitting]
- `vite-plugin-react-swc` + esbuild/rollup default chunking is the only automatic splitting; no manual `manualChunks` config in `vite.config.ts`.
- `lovable-tagger`'s `componentTagger()` plugin only runs in `mode === "development"`.

## 8. Build Configuration [CONFIRMED]
### `vite.config.ts`
- Dev server: `host: "::"`, `port: 8080`.
- Plugins: `react()` (SWC), `componentTagger()` (dev only, Lovable component tagging for the visual editor), `mcpPlugin()` (Lovable MCP/Supabase stack integration, unconditional).
- `resolve.dedupe: ["react", "react-dom"]`.
- Path alias: `"@" → ./src`.

### `tailwind.config.ts`
- `darkMode: ["class"]`, no `prefix`.
- `content` globs: `./pages/**`, `./components/**`, `./app/**`, `./src/**` (the first three globs are legacy Next.js-style paths that don't exist in this project — dead globs, harmless but imprecise). [OBSERVED]
- Design tokens are all HSL CSS variables consumed via `hsl(var(--x))` (border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card, sidebar-*), plus a custom `brand` color keyed to `--ogura-pink`/`--ogura-pink-light`.
- Custom keyframes/animations: `accordion-down/up`, `fade-in`, `fade-in-slow`, `scale-in`, `slide-up`, `kenburns` (used for hero image Ken Burns effect).
- `container` centered, max `1400px` at `2xl`.
- Plugin: `tailwindcss-animate`.

### `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
- Root `tsconfig.json` is a solution file with `references` to `tsconfig.app.json` and `tsconfig.node.json`; itself declares `paths: {"@/*": ["./src/*"]}`, `allowJs: true`, `noImplicitAny: false`, `noUnusedLocals: false`, `noUnusedParameters: false`, `strictNullChecks: false`, `skipLibCheck: true`. Type strictness is intentionally loose project-wide. [OBSERVED]

### `package.json` scripts [CONFIRMED]
`dev` (vite), `build` (vite build), `build:dev` (vite build --mode development), `lint` (eslint .), `preview` (vite preview). No test script defined.

## 9. Global CSS [OBSERVED]
`src/index.css` (not fully enumerated here) defines the CSS custom properties consumed by Tailwind and additional bespoke classes referenced ad hoc in components (`museum-surface`, `museum-gold-glow`, `museum-grain-strong`, `museum-vignette-strong`, `waitlist-page`, `editorial-label`, `instagram-gradient`, `font-body`, `font-serif` custom utility classes) — these are one-off theming classes for specific marketing sections (Index page "Museum Band", BrandWaitlist page) rather than a systematic design system layer beyond the shadcn tokens.

## 10. Notable Structural Observations
- Three independent SPA route trees are bundled into one JS artifact and switched at runtime by hostname/path sniffing — there is no server-side routing/split-bundling per subdomain. [OBSERVED]
- `getBasePath()` dead code combined with hard-coded `/seller/*` and `/admin/*` paths in the sub-app routers is a latent bug for the subdomain-based production deploy described in `domainDetection.ts`'s own comment. [CONFLICT] [SECURITY-SENSITIVE: could cause admin/seller UI to 404 in production if subdomains are used without a path prefix, potentially prompting operators to work around it in ways that weaken guards]
- No centralized `NotFound`/404 handling for `/seller/*` or `/admin/*` — both fall back to their landing/login pages instead of an explicit 404, which can mask broken links.
