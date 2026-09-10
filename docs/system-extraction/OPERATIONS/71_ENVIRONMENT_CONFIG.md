# 71 — Environment & Configuration Files

## .env (project root, present, NOT in .gitignore explicitly — `.gitignore` has no `.env` entry) [SECURITY-SENSITIVE: low, since only public keys are present, but the *pattern* of not gitignoring .env is a latent risk if a real secret is ever added there]
```
SUPABASE_PUBLISHABLE_KEY=REDACTED   # anon/public JWT, safe to expose
SUPABASE_URL=REDACTED               # https://yudzgkrjsstqbfrrrrly.supabase.co
VITE_SUPABASE_PROJECT_ID=REDACTED   # yudzgkrjsstqbfrrrrly
VITE_SUPABASE_PUBLISHABLE_KEY=REDACTED
VITE_SUPABASE_URL=REDACTED
```
All true secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `HUGGINGFACE_API_TOKEN`, `LOVABLE_API_KEY`, `PINTEREST_CLIENT_SECRET`, `MAKE_WEBHOOK_URL`) are **not** in `.env` — they exist only as Supabase Edge Function secrets (server-side, managed via Lovable Cloud), which is the correct pattern.

## supabase/config.toml
```
project_id = "yudzgkrjsstqbfrrrrly"
[functions.<name>]
verify_jwt = false
```
Listed for: virtual-tryon, generate-banner-image, ai-recommendations, image-analysis, pincode-lookup, sync-algolia, social-post-webhook, razorpay-create-order, razorpay-verify-payment, pinterest-token-exchange.

**Meaning of `verify_jwt = false`**: Supabase normally requires a valid Authorization Bearer JWT (from Supabase Auth) on every edge function invocation. Setting it to `false` allows **anonymous/unauthenticated** invocation — necessary here because: (a) some functions are meant to be public (pincode-lookup, ip-geolocation — though ip-geolocation isn't even listed, meaning it uses the default), (b) some are invoked from a payment flow before/without a logged-in session in some cases (razorpay-*), (c) `sync-algolia` is presumably meant to be triggered by an internal/admin process but as configured is **callable by anyone on the internet with the function's URL**, with no additional auth check inside the function body itself (not verified for an internal secret/token check — recommend confirming). `send-otp`/`verify-otp`/`ip-geolocation`/`mcp` are **absent** from this file, meaning they use the Supabase project's **default** `verify_jwt` setting (typically `true`) — [UNKNOWN] whether the default has been globally overridden at the project level outside this file.

## vite.config.ts
- Dev server: host `::` (all interfaces), port `8080`.
- Plugins: `@vitejs/plugin-react-swc`, `componentTagger()` (dev-mode only, Lovable visual editor support), `mcpPlugin()` (always active, generates the `mcp` edge function).
- `resolve.dedupe: ["react","react-dom"]` — prevents duplicate React copies (relevant given many Radix/animation deps).
- Alias `@` → `./src`.

## components.json
[Standard shadcn/ui config file — not read in full this pass; governs the `shadcn` CLI's component generation paths/aliases. Rebuild note: must be recreated with matching `@/components`, `@/lib/utils` aliases for shadcn tooling to keep working.]

## eslint.config.js
[Flat ESLint config, using `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` — standard Vite+React+TS lint setup per `package.json` devDependencies; not fully re-read this pass.]

## tsconfig*.json
[Not fully re-read this pass; standard Vite React-TS split-config (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` pattern is typical for this template — recommend direct read if exact `strict`/`paths` settings are needed for a rebuild.]

## tailwind.config.ts / postcss.config.js
Tailwind CSS **v3.4.17** (not v4 — confirmed via `package.json` devDependencies), with `tailwindcss-animate` and `@tailwindcss/typography` plugins. PostCSS standard `autoprefixer` + `tailwindcss` pipeline. [Not fully re-read for custom theme tokens this pass; recommend direct read if exact design-token values are needed.]

## index.html — meta/OG tags
- Title: `OGURA — Premium Fashion Marketplace | Designer Wear Online`.
- Canonical: `https://ogura.in/`.
- OG: `og:site_name=OGURA`, `og:title`, `og:description` ("Curated designer fashion, made-to-order couture and AI styling. Free delivery on orders above ₹999."), `og:type=website`, `og:url=https://ogura.in/`, `og:image=https://ogura.in/og-image.jpg?v=4` (cache-busted with `?v=4`, implying the OG image has been updated at least 4 times), full image dimensions declared (1200×630), `og:locale=en_IN`.
- Twitter: `summary_large_image` card, `@ogura_fashion` handle.
- Fonts preconnected: Google Fonts (`Cormorant Garamond`, `Manrope`, `Playfair Display`).
- Favicon: `/favicon.png` (both standard and apple-touch-icon).

## What must be recreated in a from-scratch rebuild
1. A new (or the same) Supabase project with identical schema (all 24 migrations applied in order) and identical Storage buckets (`tryon-images` at minimum).
2. All edge-function secrets re-provisioned: `RAZORPAY_KEY_ID/SECRET`, `HUGGINGFACE_API_TOKEN`, `LOVABLE_API_KEY` (or an alternative OpenAI-compatible gateway if leaving Lovable Cloud — this is a **vendor lock-in point**, see 72), `PINTEREST_CLIENT_ID/SECRET`, `MAKE_WEBHOOK_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. `.env` with `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` pointed at the new project.
4. Algolia account + index `ogura-products` + a fresh search-only API key (current one is hardcoded in `src/lib/algoliaClient.ts` and would need rotating for a genuinely independent deployment) + an admin key for `sync-algolia`.
5. Google OAuth reconfiguration — **cannot be trivially rebuilt outside Lovable Cloud** since Google credentials are held by `@lovable.dev/cloud-auth-js`, not this repo (see `60_INTEGRATIONS.md` §3) — a non-Lovable rebuild needs its own Google Cloud OAuth client + a real `signInWithOAuth` implementation via `supabase.auth.signInWithOAuth`.
6. DNS: `ogura.in`, and if used in production, `sellers.ogura.in` / `admin.ogura.in` CNAME/A records pointed at the hosting platform.
7. A real SMS provider to replace the OTP stub in `send-otp` before this can be considered production-safe.
