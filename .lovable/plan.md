

# Fix Seller Auth & Routing Flow

## Problem
The `/join` page currently shows the `SellerDashboardShowcase` component (a full dashboard preview) alongside the hero section. The user wants `/join` to be **auth-only** (login/signup forms), with the dashboard exclusively behind protected routes.

## Changes

### 1. Redesign `src/pages/JoinUs.tsx` — Auth-only page
- Remove the `SellerDashboardShowcase` import and its section entirely
- Replace the hero + "Apply" button with a **login/signup tabbed form** (email/password + Google sign-in)
- If user is already authenticated, auto-redirect to `/seller/dashboard`
- Use the existing `useAuth` context for auth state checks

### 2. Update `src/components/auth/SellerAuthRoute.tsx` — Redirect to `/join`
- Change the redirect target from `/seller-login` to `/join` so unauthenticated users hitting any `/seller/dashboard` route land on the new auth page

### 3. Update `src/apps/SellerApp.tsx` — Add `/join` route
- Add a route for `/join` pointing to `JoinUs` so it works in the seller domain context too
- Keep existing protected dashboard routes unchanged

### 4. Update `src/pages/seller/SellerLogin.tsx` and `src/pages/seller/SellerSignup.tsx`
- Update redirect-after-auth from `/seller/dashboard` to `/seller/dashboard` (already correct)
- Update "Don't have account?" / "Already have account?" links to point to `/join` instead of `/seller-signup` / `/seller-login`

## Auth Flow Summary

```text
/join (not logged in)  →  Shows login/signup forms
/join (logged in)      →  Redirects to /seller/dashboard
/seller/dashboard      →  Protected; redirects to /join if not logged in
Login/Signup success   →  Redirects to /seller/dashboard
Logout                 →  Redirects to /join
```

## Files
- **Modify**: `src/pages/JoinUs.tsx` — remove dashboard showcase, add auth forms with tabs
- **Modify**: `src/components/auth/SellerAuthRoute.tsx` — redirect to `/join`
- **Modify**: `src/apps/SellerApp.tsx` — add `/join` route alias
- **Modify**: `src/pages/seller/SellerLogin.tsx`, `src/pages/seller/SellerSignup.tsx` — update cross-links

