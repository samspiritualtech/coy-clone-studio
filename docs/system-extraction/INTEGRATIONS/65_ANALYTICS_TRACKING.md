# 65 — Analytics & Tracking Reality Check

## What exists
- **No analytics SDK is installed.** `package.json` dependency list (see `72_DEPENDENCIES.md`) contains no `posthog-js`, `mixpanel`, `segment`, `@vercel/analytics`, `google-analytics`/`gtag`, `react-ga`, or any pixel library.
- **No `gtag`/`fbq`/pixel snippets** found in `index.html` or anywhere in `src` (searched for `gtag(`, `dataLayer`, `fbq(`, `pixel` — none present beyond unrelated CSS/asset names).
- The only "tracking-adjacent" code is **`console.*` logging** scattered through edge functions and some frontend hooks (e.g., `useVirtualTryOn.ts` logs upload/progress events, edge functions log request lifecycle) — this is developer debug output, not business analytics, and is only visible via Supabase function logs / browser devtools, not aggregated anywhere.
- SEO/meta tracking tags exist (`index.html`) — Open Graph and Twitter Card meta tags, plus `twitter:site content="@ogura_fashion"` — these affect social-share previews only, not analytics.
- `sync-algolia` and Algolia search itself provide Algolia's own built-in search-analytics dashboard **only for search queries run through Algolia** (index `ogura-products`) — this is the one piece of quasi-analytics that exists, and it's scoped narrowly to search usage, not general site/business events. [CONFIRMED, narrow scope]

## [MISSING] register of business-critical events not tracked

| Event | Tracked? | Why it matters |
|---|---|---|
| Page views | [MISSING] | No visibility into traffic volume, top pages, or bounce/drop-off across the funnel. |
| Product views (PDP impressions) | [MISSING] | Cannot measure product popularity, merchandising effectiveness, or feed real "trending"/"recommended" signals (the AI recommendation prompts use static catalog data, not actual view/click behavior). |
| Add-to-cart | [MISSING] | No cart-abandonment measurement possible; no funnel step between browse→cart is observable. |
| Checkout started / address selected / discount applied | [MISSING] | No visibility into where users drop off in checkout, which is especially risky given the payment-integrity issues documented in `61_PAYMENT.md` — failed/abandoned payments are invisible. |
| Payment success/failure | [MISSING] | Beyond `console.error` inside the edge function (server logs only, not queryable business metric), there is no dashboard-visible payment success rate, no alerting on spikes in `order_saved:false` partial-failure states. |
| Seller events (product listed, order received, payout requested) | [MISSING] | No seller-side analytics beyond whatever `DashboardAnalytics.tsx` renders directly from live DB queries (that's a live-data dashboard, not an event-tracking/analytics pipeline — different concern). |
| AI feature usage (try-on attempts, recommendation impressions/clicks, image-search usage) | [MISSING] | No way to measure adoption or ROI of the four AI features documented in `62_AI_AND_STUDIO.md`, and combined with the total absence of credit accounting, there is **no usage-based cost control or reporting at all** for AI spend. |
| Errors / client-side exceptions | [MISSING] | No error-tracking SDK (Sentry, Bugsnag, etc.); errors are only visible as `console.error` in the browser console of whichever user experienced them, or in Supabase function logs for backend errors — nothing is aggregated or alerted on. |
| Search queries & zero-result searches | Partially [CONFIRMED] via Algolia's own dashboard (if enabled on the Algolia account) — but this repo does not surface that data anywhere in-app (no admin analytics page reads Algolia's analytics API). |

**Bottom line**: this application has **no product/business analytics layer**. All "analytics"-sounding admin dashboard pages (`DashboardAnalytics.tsx`, `AdminDashboardHome.tsx`) should be assumed to be live operational queries against the Supabase DB (orders, products, sellers counts) rather than true event-tracking analytics, unless independently verified otherwise.
