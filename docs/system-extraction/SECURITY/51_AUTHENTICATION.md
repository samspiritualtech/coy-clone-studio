# 51 — Authentication

## 0. Identity ID map [CONFIRMED]

```
auth.users.id  (Supabase Auth, GoTrue)
   |
   +--> profiles.id            (1:1, PK = auth.users.id, no separate FK column, joined by equality)
   +--> sellers.user_id        (1:N in schema, business logic treats as 1:1 per user)
   +--> user_roles.user_id     (1:N — a user can hold multiple app_role rows)
   +--> tryon_history.user_id  (nullable FK, guest try-on allowed)
   +--> user_addresses.user_id
   +--> orders.customer_id     (= auth.users.id of buyer)
```
No table stores a separate "identity" or "account" concept unifying phone/email/Google logins — **auth.users.id is the sole identity anchor**, and Supabase Auth creates a *new* `auth.users` row per distinct credential unless code explicitly links them.

## 1. Signup / Login / Logout — `src/contexts/AuthContext.tsx`

- **Email/password signup** — `signUpWithEmail()` (`AuthContext.tsx:168-193`):
  ENTRY: SellerSignup.tsx form → IDENTITY: `supabase.auth.signUp({email,password})` creates new `auth.users` row → VERIFICATION: none observed (no forced email confirmation flow in code; Supabase project setting controls this, **[UNKNOWN]** whether email confirmation is enforced server-side) → SESSION: Supabase issues session immediately on signUp response → PROFILE: **no `profiles` row is created here** — only `sellers` and `user_roles` rows are inserted (lines 175-187) → ROLE: hardcoded `role: 'seller'` inserted unconditionally → ACCESS: `isAuthenticated = !!session` true immediately.
  **[CONFLICT]** This signup path is only exposed via seller entry points (`SellerSignup.tsx`) but lives in the shared `AuthContext`, so any consumer of `signUpWithEmail` gets a seller record — there's no consumer/customer email-password signup path in the codebase; customers only get Google or phone OTP. **[OBSERVED]**

- **Email/password login** — `signInWithEmail()` (`AuthContext.tsx:158-166`): thin wrapper over `supabase.auth.signInWithPassword`. No MFA, no lockout, no phone/role branching.

- **Logout** — `AuthContext.tsx:195-200`: `supabase.auth.signOut()` + local state clear. No server-side session revocation list, no explicit "revoke all sessions" — matches Supabase default behavior (refresh token invalidated).

## 2. Session storage & refresh

- **[OBSERVED]** Session persistence is delegated to `@supabase/supabase-js`'s default (localStorage) *except* on Lovable preview surfaces, where `src/integrations/supabase/previewAuthStorage.ts` (auto-generated, "Do not edit it directly") brokers the auth token via `postMessage` to the parent editor frame so multiple preview iframes share one login (`brokeredPreviewStorage()`).
  - Restricts target origins to a strict allow-list regex (`lovable.dev`, `gptengineer.app`, plus dev localhost:3000) and validates the project ID only from a non-user-controlled hostname position — designed to prevent token exfiltration to an untrusted embedding origin. [CONFIRMED, by code reading]
  - Falls back to plain `localStorage` off preview zones or when not framed — i.e., **in production the session token is stored in localStorage**, susceptible to XSS-based token theft if any XSS exists elsewhere in the app (see 55/83).
- Refresh: handled transparently by supabase-js's `onAuthStateChange`/auto-refresh; `AuthContext.tsx:41-56` just re-fetches the profile on every auth event.

## 3. Google OAuth — canonical origin logic

- `AuthContext.tsx:27-31` `getCanonicalAuthOrigin()`: strips a leading `www.` from `window.location.hostname` before constructing `redirect_uri`, because "`www.` hosts are not allow-listed" in the OAuth app config. **[OBSERVED, SECURITY-SENSITIVE-adjacent]**: this is a workaround for an incomplete redirect allow-list rather than a security control; if the allow-list itself is misconfigured (e.g., wildcarded), OAuth redirect could be hijacked. The code does not sanitize `protocol`/`port`, trusting `window.location` fully — normal for browser-run OAuth redirects, but worth flagging since it constructs the redirect URI from client-controlled `window.location`, and relies entirely on Supabase/Google's server-side allow-list to reject mismatches (`errorMsg.includes('redirect_uri_mismatch')` handling at line 137 shows failures are expected/handled, not prevented).
- Flow: ENTRY (GoogleSignInButton) → IDENTITY: `lovable.auth.signInWithOAuth("google", {redirect_uri})` (`src/integrations/lovable/index.ts`) → VERIFICATION: Google + Supabase Auth server-side → SESSION: `supabase.auth.setSession(result.tokens)` (`src/integrations/lovable/index.ts:23`) → PROFILE: `fetchUserProfile` creates UI state from `profiles` row if present, else falls back to `session.user.user_metadata` and marks `isNewUser=true` → ROLE: none assigned automatically by Google login (no code inserts `user_roles` on Google sign-in) → ACCESS: `isAuthenticated=true`.
  **[CONFLICT]** No `profiles` row is programmatically created on any auth path shown (`signUpWithEmail` doesn't insert one; Google path doesn't either) — profile creation must occur elsewhere (e.g., `Onboarding.tsx`, not read in this scope) or a DB trigger. **[UNKNOWN — needs Onboarding.tsx/trigger check]**. If no trigger exists, RLS policy `profiles: Users can insert own profile (auth.uid()=id)` implies the client is expected to insert its own profile row, but this insert call site was not found in the AuthContext.

## 4. Phone OTP — `send-otp` / `verify-otp` edge functions + `otp_verifications` table

ENTRY: some UI phone-login component (not in AuthContext; only Checkout/other phone-collection code call OTP APIs per file grep) → IDENTITY: `send-otp` (`supabase/functions/send-otp/index.ts`) validates `^[6-9]\d{9}$`, generates 6-digit OTP, SHA-256 hashes `otp+phone`, stores in `otp_verifications` with 5-min expiry, **returns `demoOtp` in the JSON response** (`index.ts` return payload: `demoOtp: otp // Remove in production`) — **[SECURITY-SENSITIVE][CRITICAL]**: the OTP is exposed to any caller of the function, defeating OTP verification as an identity check entirely, since `verify_jwt=false` on this function and CORS is `*`.
VERIFICATION: `verify-otp` (`supabase/functions/verify-otp/index.ts`) checks hash match, expiry, attempts<5 (delete-and-fail beyond that).
SESSION: On success, function looks up/creates a `auth.users` record keyed by synthetic email `${phone}@ogura.phone.auth` via `supabase.auth.admin` (service role), uses `generateLink({type:'magiclink'})` + `supabase.auth.verifyOtp({token_hash,type:'magiclink'})` server-side to mint a real session, or returns `session: null` with the raw `existingUser.id` for the client to (presumably) exchange for a session — code past line ~150 not fully re-read but architecture is clear.
PROFILE: updates `profiles.name/phone` if a name is supplied, only for existing users.
ROLE: not assigned in visible code.
IDENTITY LINKAGE: **[CONFLICT]** — a phone login creates/uses a *separate* `auth.users` row (email `<phone>@ogura.phone.auth`) distinct from any Google or email/password account for the same real person. There is no lookup-by-phone-across-providers or account-merge logic anywhere in the read code. **The intended "Google + phone OTP + email/password converge into one identity" model is NOT implemented** — each auth method produces an independent `auth.users.id`, and `profiles`/`sellers`/`orders` will fragment per method unless a human manually reconciles by phone/email string matching. [CONFLICT — this is the single biggest identity-model gap.]
"Phone verified at checkout" model: **[UNKNOWN/MISSING]** — no code observed gating checkout on phone OTP verification status; `Checkout.tsx` collects `shipping_address.mobile` from `user_addresses` records without any OTP re-verification step at that point.

## 5. Password reset / email verification

- **[MISSING]** No `resetPasswordForEmail`/`updateUser` password-reset flow was found via the Supabase call inventory (`/tmp/extract/code.txt` SUPABASE CALLS list) — no password-reset UI or function call exists in the scanned code. Recovery must rely on Supabase's default email link if enabled in project settings, but the app has no dedicated reset page routed in `CustomerApp.tsx`/`SellerApp.tsx`.
- **[UNKNOWN]** Whether Supabase project enforces email confirmation before allowing login (a project-level Auth setting not visible in code).

## 6. Account linking / duplicate prevention

- **[MISSING]** No code performs identity linking (e.g., `supabase.auth.linkIdentity`) or duplicate-account detection by email/phone across providers. Given `signUpWithEmail` also silently attaches `seller`/`sellers` rows, a user who signs up via email, then later logs in via Google with the same email, will get **two separate `auth.users` records** unless Supabase's own "same email different provider" merge setting is active at the project level (behavior not observable from code).

## 7. Guest sessions

- **[OBSERVED]** `VirtualTryOn.tsx`/`useVirtualTryOn.ts` call `supabase.auth.getUser()` before optionally inserting into `tryon_history`; `tryon_history.user_id` is nullable, so guest (unauthenticated) try-ons are supported and simply store `user_id = null`. Cart/Wishlist use `localStorage`-only guest state (`WishlistContext.tsx`), not Supabase, so those are pure client-side guest sessions with no server persistence and no security relevance beyond XSS-readable localStorage.

## 8. Session expiry

- **[INFERRED]** Standard Supabase JWT expiry + refresh-token rotation (supabase-js default: ~1 hour access token, auto-refreshed). No custom expiry/idle-timeout logic found in app code.

## 9. Protected Routes

| Guard | File | Behavior |
|---|---|---|
| `ProtectedRoute` | `src/components/auth/ProtectedRoute.tsx` | Redirects to `/login` if `!isAuthenticated`. No role check. Used for `/dashboard,/onboarding,/profile,/wishlist,/cart,/checkout,/order-confirmation` (`CustomerApp.tsx:75-81`). |
| `RoleProtectedRoute` | `src/components/auth/RoleProtectedRoute.tsx` | Redirects to `loginPath` if unauthenticated; shows "Access Denied" UI (does not navigate away) if `!hasRole(requiredRole)`. **Client-side only** — the underlying route content still mounts unless the component itself blocks rendering, which it does here by returning the denial UI instead of children — but this is enforced purely in React, not by any server check. |
| `SellerAuthRoute` | `src/components/auth/SellerAuthRoute.tsx` | Redirects unauthenticated users to `/join`. **Does not check seller role at all** — any authenticated user (including a pure `consumer`) passes this guard. Actual seller-page routes in `SellerApp.tsx` use `WrappedRoute` (not this component per grep of AdminApp/SellerApp `WrappedRoute` uses) — **[UNKNOWN]** exact wiring of `SellerAuthRoute` vs `WrappedRoute`; needs cross-check with `WrappedRoute` definition. |

`AdminApp.tsx` routes use a `WrappedRoute` wrapper (not `RoleProtectedRoute` by name) around all `/admin/*` pages except `/admin/login`; `AdminLogin.tsx` itself checks `hasRole('admin')` client-side after auth to redirect or show "Access Restricted" (`AdminLogin.tsx:22-29,38-56`). This is again a **UI convenience gate** — the true admin authorization boundary is the RLS `has_role(auth.uid(),'admin')` predicate on each admin-managed table.

## 10. Admin auth — `src/pages/admin/AdminLogin.tsx`

Google OAuth only (`GoogleSignInButton`), no separate admin credential system, no separate admin session type. Any Google-authenticated user reaching `/admin/login` who happens to hold an `admin` `user_roles` row is redirected in; there is no invite-only signup restriction for admin — an admin role must be granted by a human/DB operation (`user_roles` INSERT), since there is no self-service admin signup path (correct design), but also no code enforces MFA for this highly privileged path. [OBSERVED]

## 11. Seller auth — `SellerLogin.tsx` / `SellerSignup.tsx`

Email/password (`signInWithEmail`/`signUpWithEmail`) + Google. `SellerSignup` calls the shared `signUpWithEmail`, which (per §1) auto-creates a `sellers` row with `application_status: 'approved'` and a `seller` `user_roles` row — **[SECURITY-SENSITIVE]**: **any person who signs up with email/password anywhere `signUpWithEmail` is reachable becomes an approved seller with no admin review**, bypassing the `seller_applications` admin-approval workflow that exists elsewhere in the schema (`seller_applications.status`, RLS `Admins can update applications`). This directly conflicts with the apparent intended flow (apply → admin review → approval) documented by the `seller_applications` table and its RLS policies. **[CONFLICT][HIGH]**

## 12. MCP OAuth — `src/lib/mcp/index.ts`, `src/pages/OAuthConsent.tsx`

- `mcp/index.ts` defines an MCP server (`@lovable.dev/mcp-js`) with `auth: auth.oauth.issuer({issuer: https://<project>.supabase.co/auth/v1, acceptedAudiences: "authenticated"})` — delegates OAuth issuance entirely to Supabase Auth as the issuer; MCP tools (`search-products`, `get-product`, `list-my-orders`) presumably run with the caller's Supabase JWT, so `list-my-orders` is bounded by the same `orders` RLS as the SPA. [INFERRED — tool implementations not read]
- `OAuthConsent.tsx` (route `/.lovable/oauth/consent`) implements the user-facing consent screen for third-party MCP clients: requires an existing Supabase session (redirects to `/login?next=...` if none), then calls beta `supabase.auth.oauth.{getAuthorizationDetails,approveAuthorization,denyAuthorization}`. Consent decisions are delegated server-side to Supabase Auth; the SPA does not itself mint tokens. Reasonable trust model: [CONFIRMED] no visible flaw, but the `OAuthApi` type is hand-cast (`as unknown as {oauth: OAuthApi}`), indicating this is an unstable/beta API — **[UNKNOWN]** guarantees provided by Supabase here.

## 13. Summary of CONFLICTs vs. intended identity model

| Intended | Actual |
|---|---|
| Google + phone OTP + email/password converge into one identity | **[CONFLICT]** Each method creates a distinct `auth.users` row; no linking/merge logic exists. |
| Phone verified at checkout | **[CONFLICT/MISSING]** No OTP re-verification observed at checkout; phone number is just a free-text field on `user_addresses`. |
| Seller accounts go through application + admin approval | **[CONFLICT]** `signUpWithEmail` self-approves sellers, bypassing `seller_applications` review. |
| OTP is a real second factor / identity proof | **[CONFLICT/CRITICAL]** `send-otp` returns the OTP value directly in its JSON response (`demoOtp`), making it usable by anyone who can call the (unauthenticated, CORS `*`) function. |
