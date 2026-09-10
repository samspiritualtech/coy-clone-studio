# 72 — Dependency Inventory

(Versions exactly as pinned in `package.json`; `^` = caret range, actual installed patch may float.)

## Frontend runtime dependencies

| Package | Version | Purpose | Criticality | Evidence | External service? | Notes |
|---|---|---|---|---|---|---|
| react / react-dom | ^18.3.1 | UI runtime | hard | used everywhere | no | **Pinned to React 18**, not 19 — relevant for any future upgrade of Radix/react-query majors that may require React 19. |
| react-router-dom | ^6.30.1 | routing | hard | `src/apps/*App.tsx` `<Routes>` | no | v6 API (not v7 data routers). |
| @supabase/supabase-js | ^2.76.1 | backend client | hard | `src/integrations/supabase/client.ts` | yes (Supabase) | |
| @tanstack/react-query | ^5.83.0 | server-state cache | hard | `App.tsx` `QueryClientProvider` | no | |
| @lovable.dev/cloud-auth-js | ^1.0.0 | Google/Apple OAuth brokering | hard (for social login) | `src/integrations/lovable/index.ts` | yes (Lovable Cloud) | **Vendor lock-in**: no raw Google/Apple SDK fallback exists. |
| @lovable.dev/mcp-js | ^0.24.0 | MCP tool server + Vite plugin | soft (platform tooling) | `vite.config.ts`, `supabase/functions/mcp` | yes (Lovable) | **Vendor lock-in**. |
| algoliasearch | ^5.47.0 | search client | hard for search UX | `src/lib/algoliaClient.ts` | yes (Algolia) | |
| react-instantsearch | ^7.22.1 | Algolia React bindings | hard for `search/` components | `src/components/search/*` | yes (Algolia) | |
| framer-motion | ^12.40.0 | animation | soft | many components | no | |
| gsap | ^3.15.0 | animation | soft | likely luxury3d/parallax components | no | duplicate-purpose with framer-motion (see overlap note) |
| lenis | ^1.3.23 | smooth scroll | soft | cosmetic | no | |
| zod | ^3.23.8 | schema validation | hard where used | `react-hook-form` resolvers, MCP tool defs | no | **Pinned to Zod v3** — v3 vs v4 API differs (v4 changes error customization, `.and`, some type-inference behavior); any dependency upgrade or copy-pasted v4-era code would break silently. MCP's bundled function also references `zod@^3.23.8` explicitly. |
| react-hook-form + @hookform/resolvers | ^7.61.1 / ^3.10.0 | forms | hard | Address/Discount/Auth forms | no | |
| @radix-ui/* (25 packages) | various ^1.x/^2.x | headless UI primitives (shadcn/ui base) | hard | `src/components/ui/*` | no | large surface area, all first-party Radix, no obvious duplicates among them. |
| tailwind-merge, clsx, class-variance-authority | current | className utilities for shadcn pattern | hard | `src/lib/utils.ts` (cn helper) pattern | no | |
| sonner | ^1.7.4 | toast notifications | soft | `App.tsx` `<Sonner/>` | no | **Overlaps** with Radix's own `@radix-ui/react-toast` + shadcn's `use-toast` hook (`toast()` used in `useVirtualTryOn.ts` etc.) — two toast systems (`sonner` and Radix-toast-based `use-toast`) appear to coexist. [Potential duplicate/overlapping UI feedback systems — verify which is authoritative before further UI work.] |
| embla-carousel-react | ^8.6.0 | carousels | soft | ProductCarousel, hero carousels | no | |
| recharts | ^2.15.4 | charts | soft, seller/admin dashboards only | `DashboardAnalytics.tsx` likely | no | |
| date-fns | ^3.6.0 | date utils | soft | forms/calendars | no | |
| next-themes | ^0.3.0 | theme (dark/light) toggling | soft | [UNKNOWN usage extent — package present but this is a fashion e-commerce app; verify if dark mode is actually exposed to users or vestigial from the shadcn template] | no | possibly unused/template leftover — flag for review |
| input-otp | ^1.4.2 | OTP input UI | hard for OTP login screens | Login/verify-otp UI | no | |
| vaul | ^0.9.9 | drawer/bottom-sheet | soft | mobile filters/menus | no | |
| react-resizable-panels | ^2.1.9 | resizable panel UI | soft | likely admin/seller dashboard panels or `ui/resizable.tsx` | no | |
| react-day-picker | ^8.10.1 | calendar picker | soft | date-of-birth/date filters | no | |
| cmdk | ^1.1.1 | command palette | soft | `ui/command.tsx` (search dropdown?) | no | |
| lucide-react | ^0.462.0 | icon set | hard (visual) | everywhere | no | |

## Dev dependencies (build/tooling only, not shipped)
`typescript ^5.8.3`, `vite ^5.4.19`, `@vitejs/plugin-react-swc ^3.11.0`, `eslint ^9.32.0` + `typescript-eslint ^8.38.0` + `eslint-plugin-react-hooks ^5.2.0` + `eslint-plugin-react-refresh ^0.4.20` + `@eslint/js ^9.32.0` + `globals ^15.15.0`, `tailwindcss ^3.4.17` (**Tailwind 3, not 4** — v4's CSS-first config and engine changes are not in play here; any AI-suggested Tailwind v4 syntax would be incompatible), `@tailwindcss/typography ^0.5.16`, `autoprefixer ^10.4.21`, `postcss ^8.5.6`, `lovable-tagger ^1.1.11` (Lovable-specific, dev-mode component tagging — **vendor lock-in**, harmless to remove for a non-Lovable rebuild), `@types/node`, `@types/react`, `@types/react-dom`.

## Deno-side imports (edge functions) — pinned versions
| Import | Version | Used in |
|---|---|---|
| `https://deno.land/std@0.168.0/http/server.ts` | 0.168.0 | all edge functions (`serve()`) |
| `https://deno.land/std@0.168.0/encoding/base64.ts` | 0.168.0 | pinterest-token-exchange |
| `https://esm.sh/@supabase/supabase-js@2` | 2.x (unpinned patch) | razorpay-verify-payment, send-otp, verify-otp |
| `https://esm.sh/@supabase/supabase-js@2.76.0` | 2.76.0 (exact) | sync-algolia |
| `npm:@supabase/supabase-js@^2.76.1` | ^2.76.1 | mcp (auto-generated) |
| `npm:@lovable.dev/mcp-js@0.24.0` | 0.24.0 | mcp function |
| `npm:zod@^3.23.8` | ^3.23.8 | mcp tool schema (search-products) |

**Version drift risk**: `deno.land/std@0.168.0` is a very old std-lib pin (deno.land/std has had many breaking releases since); `@supabase/supabase-js` is pinned inconsistently across functions (`@2` unpinned vs `@2.76.0` exact vs `^2.76.1`), meaning different edge functions could silently diverge in Supabase client behavior over time as `esm.sh`/`npm:` resolve differing minor/patch versions at each redeploy.

## Unused / questionable packages (candidates for review, not confirmed dead)
- `next-themes` — no confirmed dark-mode UI toggle found in this pass; likely a shadcn-template leftover.
- `gsap` vs `framer-motion` — two full animation libraries present; likely overlapping responsibility, worth auditing for consolidation.
- `sonner` vs Radix `@radix-ui/react-toast`-based `use-toast` — two toast/notification systems present simultaneously.

## Vendor lock-in summary
Hard-tied to the **Lovable platform**: `@lovable.dev/cloud-auth-js` (Google/Apple OAuth), `@lovable.dev/mcp-js` (MCP tooling + auto-generated edge function), `lovable-tagger` (dev-only, low lock-in), and the **Lovable AI Gateway** (`ai.gateway.lovable.dev`) used by three edge functions with no alternative-provider fallback coded. A migration off Lovable Cloud would require: reimplementing OAuth via standard Supabase `signInWithOAuth`, removing/replacing the MCP plugin and function, and re-pointing the three AI edge functions at a different OpenAI-compatible endpoint (e.g. OpenAI, Anthropic-via-proxy, or self-hosted Gemini access) with new API keys and equivalent model IDs.

## APPLICATION → PACKAGE → SERVICE → DATABASE → EXTERNAL PROVIDER chain
```
Customer/Seller/Admin React apps (react, react-router-dom, @tanstack/react-query)
  → @supabase/supabase-js  → Supabase project yudzgkrjsstqbfrrrrly (Postgres, Auth, Storage)
  → supabase.functions.invoke(...)  → Deno edge functions
        → razorpay-create-order/verify-payment → Razorpay API (api.razorpay.com)
        → virtual-tryon → Hugging Face Space (yisol-idm-vton.hf.space)
        → ai-recommendations / image-analysis / generate-banner-image → Lovable AI Gateway (ai.gateway.lovable.dev, model google/gemini-2.5-*)
        → pincode-lookup → api.postalpincode.in
        → ip-geolocation → ip-api.com
        → pinterest-token-exchange → api.pinterest.com/v5
        → social-post-webhook → Make.com (env MAKE_WEBHOOK_URL)
        → sync-algolia → Algolia (algoliasearch)
  → algoliasearch (frontend, lite client) → Algolia index ogura-products
  → @lovable.dev/cloud-auth-js → Lovable Cloud Auth → Google OAuth
  → fetch() (raw, no package) → external "Seller Center" Supabase project (pyesltzkemtranachpne.supabase.co)
```
