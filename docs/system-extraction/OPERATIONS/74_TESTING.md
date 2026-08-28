# 74 — Testing Reality

## What exists
[CONFIRMED — effectively nothing.] A repo-wide search for test files (`*.test.*`, `*.spec.*`), test runner configs (`vitest.config.*`, `playwright.config.*`, `jest.config.*`), fixtures, and seed-data scripts returned **zero results** outside `node_modules`. `package.json` contains no `test` script and no test-framework devDependency (`vitest`, `jest`, `@testing-library/*`, `playwright`, `cypress` are all absent). There is no CI configuration (`.github/workflows/` not present) that would run tests on push/PR either.

**Conclusion: this application has no automated test coverage of any kind — no unit tests, no integration tests, no end-to-end tests, no visual regression tests, and no seeded test fixtures.**

## Risk register — critical untested functionality

| Area | Current coverage | Risk if broken silently | Recommended coverage [PROPOSED] |
|---|---|---|---|
| Checkout total computation (`Checkout.tsx`) | None | Wrong charges to customers; already has a confirmed [SECURITY-SENSITIVE] client-trust bug (see `61_PAYMENT.md`) that tests would likely have caught | [PROPOSED] Unit tests for `deliveryFee`/`discountAmount`/`finalTotal` math; [PROPOSED] integration test asserting server rejects a client `amount` that doesn't match server-recomputed cart total (requires fixing the underlying bug first). |
| Razorpay signature verification | None | A regression here silently disables fraud protection or bricks all payments | [PROPOSED] Unit test with known Razorpay test-mode order/payment/signature triples to assert `verifySignature()` correctness (positive + tampered-signature negative case). |
| Order/order_items insert on payment success | None | Partial-state bug (`order_saved:false`) already exists and is unmonitored | [PROPOSED] Integration test simulating a DB insert failure to assert the correct partial-failure response shape is returned and (once implemented) an alert fires. |
| Inventory/stock decrement | None (feature itself is [MISSING]) | Overselling once inventory tracking is implemented | [PROPOSED] Once built: concurrency test for two simultaneous purchases of the last unit. |
| RLS policies (all tables) | None | Cross-tenant data leaks (customer sees another customer's address/order; seller sees another seller's products) | [PROPOSED] Automated RLS test suite (e.g. pgTAP or scripted Supabase client calls under different JWTs) asserting `user_addresses`, `orders`, `discounts`, `sellers`-scoped tables enforce `auth.uid()`/role checks per the policies defined in migrations. |
| Seller isolation (products, discounts, orders visibility) | None | A seller editing/deleting another seller's discount or product | [PROPOSED] Multi-seller fixture test verifying `discounts` policy `seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid())` actually blocks cross-seller writes. |
| Admin permissions (`has_role(auth.uid(),'admin')` checks) | None | Privilege escalation if a role-check migration is ever reverted/mis-ordered | [PROPOSED] Test asserting non-admin authenticated users cannot `INSERT/UPDATE/DELETE` on `designers`, `vendors`, `influencer_videos`, or view `brand_waitlist_applications`. |
| Refunds | N/A — feature is [MISSING] entirely | N/A | [PROPOSED] Build the feature with tests from day one given the payment-integrity issues already present. |
| Auth (email/password, Google OAuth, phone OTP) | None | Login regressions block all commerce | [PROPOSED] E2E smoke test per auth method; [PROPOSED] specifically test the phone-OTP magic-link exchange path (`verify-otp/index.ts`) which has nontrivial branching (existing vs new user, session vs no-session fallback). |
| OTP flow security | None | The current stub (OTP returned in API response, logged in plaintext) is a **known, present** vulnerability, not just an untested edge case — see `63_EMAIL_WHATSAPP_SMS.md` and `73_MONITORING_LOGGING.md` | [PROPOSED] Once a real SMS provider is wired in, add a test asserting `demoOtp`/plaintext OTP is never present in either the log stream or the HTTP response outside a clearly gated dev-only build flag. |
| AI flows (try-on, recommendations, image-analysis, banner gen) | None | Silent prompt/parsing regressions (e.g., the regex-based JSON extraction from LLM responses breaking on a subtly different model output format) | [PROPOSED] Contract tests mocking the Lovable AI Gateway / HF Space responses to verify the JSON-array/attribute-parsing logic handles malformed/markdown-wrapped responses (already partially defensive in code, but unverified). |
| Domain-based app routing (`detectDomain()`) | None | The [CONFLICT] noted in `70_DEPLOYMENT.md` (possible `/admin` path exposing AdminApp on the main customer domain) is exactly the kind of regression a routing test would catch | [PROPOSED] Unit tests for `detectDomain()` across hostname/path combinations, explicitly asserting production-hostname behavior differs from dev-path-fallback behavior if that's the intended design. |

## Recommended baseline setup [PROPOSED]
- `vitest` + `@testing-library/react` for component/unit tests (fits the existing Vite toolchain with minimal config).
- `playwright` for E2E smoke tests of checkout, login, and seller/admin route boundaries.
- A dedicated Supabase test project (or local `supabase start`) with the same 24 migrations applied, seeded with fixture users/sellers/products, to safely test RLS policies without touching production data.
