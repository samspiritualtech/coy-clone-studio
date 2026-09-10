# 70 — Deployment

## Hosting model
- **Platform**: Lovable (Lovable Cloud), which bundles a Vite-built SPA plus a Supabase-managed backend (project `yudzgkrjsstqbfrrrrly`) and Deno edge functions, all deployed together as part of Lovable's "publish" pipeline. [CONFIRMED via project structure and `lovable-tagger`/`@lovable.dev/*` packages]
- **Preview URL**: Lovable provides an auto-generated `*.lovable.app` (or similar) preview URL per project during development — the exact preview hostname is runtime-assigned and not hardcoded anywhere in this repo (no `*.lovable.app` string found in source, only `ogura.in`).
- **Published/custom domain**: `og ura.in` is the canonical production domain, hardcoded into SEO metadata: `index.html:12` (`<link rel="canonical" href="https://ogura.in/" />`), and Open Graph/Twitter meta tags (`og:url`, `og:image` all reference `https://ogura.in`).
- **admin.ogura.in status**: [CONFIRMED referenced in code, status of DNS/live cutover UNKNOWN]. `src/lib/domainDetection.ts` explicitly branches on `hostname.startsWith('admin.')` → renders `AdminApp`, and `hostname.startsWith('sellers.')` → renders `SellerApp` (note: `sellers.` plural, not `seller.`). Whether these subdomains are actually provisioned in DNS and pointed at the deployed app is **not verifiable from source code alone** — [UNKNOWN, requires checking Lovable project domain settings / DNS records directly].

## Domain-based app split (src/lib/domainDetection.ts)
Single Vite build serves three "apps" (`CustomerApp`, `SellerApp`, `AdminApp` in `src/apps/`) selected at runtime by `detectDomain()` in `App.tsx:19-27`, based on `window.location.hostname`:
- `sellers.*` → SellerApp
- `admin.*` → AdminApp
- everything else → CustomerApp
- **Dev/preview fallback**: since preview URLs don't have `sellers.`/`admin.` subdomains, the same function falls back to **path-based** detection (`pathname.startsWith('/seller')` / `/admin`) so that `/admin/*` and `/seller/*` routes work in a single-hostname preview environment. [CONFIRMED] This means: **in production (real subdomains), `/admin` paths on the main `ogura.in` host would NOT render AdminApp** (since `detectDomain()` checks hostname first, but path fallback only matters when hostname doesn't match a known subdomain — on `ogura.in` with path `/admin`, hostname doesn't start with `admin.`, so it falls through to the path check, which **does** match `/admin` — so actually both hostname- and path-based admin access coexist even in production unless explicitly guarded elsewhere). [CONFLICT RISK — SECURITY-SENSITIVE]: this implies `ogura.in/admin` may render `AdminApp` in production too, not just `admin.ogura.in`, effectively exposing the admin app shell (though presumably still behind `AdminLogin`/role checks) on the main customer domain. Recommend explicit verification against live DNS + a code path that disables path-based fallback outside dev/preview.

## Build
- Vite 5.4.19, `@vitejs/plugin-react-swc`, `lovable-tagger` (dev-mode only component tagging for the Lovable visual editor), `@lovable.dev/mcp-js` Vite plugin (auto-generates the `mcp` edge function from `src/lib/mcp/**` at build time — see `60_INTEGRATIONS.md` §14).
- `npm run build` → `vite build`; `build:dev` → `vite build --mode development` (used for Lovable's dev/preview builds, keeping `componentTagger()` active since it's gated on `mode === "development"`).
- Path alias `@` → `./src` (`vite.config.ts:14-16`).

## Edge function deployment model
- Edge functions live in `supabase/functions/*/index.ts`, each a standalone Deno script using `https://deno.land/std@0.168.0/http/server.ts` and (where DB access is needed) `https://esm.sh/@supabase/supabase-js@2` (pinned to major version 2, not an exact patch in most files; `sync-algolia` pins `@2.76.0` exactly, `mcp` pins `npm:@supabase/supabase-js@^2.76.1`).
- `supabase/config.toml` declares `verify_jwt = false` for **every** listed function (`virtual-tryon`, `generate-banner-image`, `ai-recommendations`, `image-analysis`, `pincode-lookup`, `sync-algolia`, `social-post-webhook`, `razorpay-create-order`, `razorpay-verify-payment`, `pinterest-token-exchange`). This means **all of these functions are publicly invocable without a Supabase auth JWT** — this is by design for public-facing functions like `pincode-lookup`, but for functions like `razorpay-create-order`/`razorpay-verify-payment` and `sync-algolia` this materially widens the attack surface (see `61_PAYMENT.md` for the payment-specific exploitation path this enables). `send-otp` and `verify-otp` are **not listed** in `config.toml` at all — meaning they use Supabase's **default** `verify_jwt` setting (default is `true` for functions without an explicit `false` override), so those two likely **do** require a valid JWT unless anonymous sessions are used — [UNKNOWN, recommend confirming default project-level setting].
- Deployment of edge functions is presumed automatic as part of Lovable's publish flow (no separate `supabase functions deploy` CI step found in this repo — no CI/CD config files like `.github/workflows` were located).

## Migration flow
- `supabase/migrations/*.sql`, timestamp-prefixed, applied in order — 24 migration files spanning Oct 2025 through Aug 2026 timestamps (note: some filenames carry dates in 2026, consistent with a sandboxed/simulated clock rather than literal future dates — treat as sequence order, not literal calendar dates).
- No rollback/down-migration files exist (Supabase CLI migrations here are forward-only `.sql` files) — **rollback = [MISSING]**, would require manually authoring a reverse migration.

## Environment separation
[CONFLICT / SINGLE-BACKEND RISK]: only **one** Supabase project (`yudzgkrjsstqbfrrrrly`) and one `.env` are present in this repo — there is no evidence of separate staging/production Supabase projects. Combined with the domain-split logic serving Customer/Seller/Admin apps from the *same* codebase and (implicitly) the same backend, **all three "apps" and any preview/production builds share one live database** unless Lovable's platform-level environment promotion introduces separation invisibly (not verifiable from source).

## Rollback / manual steps / publish limits
- Rollback: [MISSING] no documented or coded rollback mechanism; would rely on Lovable's platform-level "revert to previous version" feature (external to this repo) plus manual SQL for any already-applied migration that needs reversing.
- Manual steps: edge function secrets (`RAZORPAY_KEY_SECRET`, `LOVABLE_API_KEY`, `HUGGINGFACE_API_TOKEN`, `PINTEREST_CLIENT_SECRET`, `MAKE_WEBHOOK_URL`, `SUPABASE_SERVICE_ROLE_KEY`) must be configured as Supabase function secrets manually/via Lovable Cloud UI — none are committed to `.env` in this repo (only public `VITE_*` values are).
- Publish output limits: [UNKNOWN] — Lovable platform-specific build/publish size or function-count limits are not documented in this repo.

## Trace: code change → build → deploy → migration → edge functions → production
1. Developer edits `src/**` or `supabase/**` inside the Lovable environment (or via this sandbox).
2. Lovable's build pipeline runs `vite build` for the frontend bundle.
3. New/changed SQL files under `supabase/migrations/` are applied to the single shared Supabase project.
4. New/changed edge functions under `supabase/functions/` are deployed to that same project, with `verify_jwt` per `supabase/config.toml`.
5. Lovable publishes the built frontend bundle to the `ogura.in` domain (and, if configured, `sellers.ogura.in`/`admin.ogura.in`) — all pointing at the same backend project, so migrations/edge-function changes take effect for Customer/Seller/Admin apps simultaneously with no independent environment gating.
