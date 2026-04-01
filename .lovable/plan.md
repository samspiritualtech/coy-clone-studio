

# Separate Customer and Seller Authentication

## Approach

Create a dedicated `SellerAuthContext` that wraps the same Supabase session but adds a seller-specific gate: it only considers a user "seller-authenticated" if they have a record in the `sellers` table with `application_status = 'approved'`. This keeps customer auth untouched while giving the seller portal its own independent state (`sellerUser`, `isSellerAuthenticated`).

Both contexts share the underlying Supabase session (one session per browser), but they expose different state and different login/signup methods.

## Changes

### 1. Create `src/contexts/SellerAuthContext.tsx`
- Own state: `sellerUser`, `isSellerAuthenticated`, `isSellerLoading`
- On auth state change, check if user has an approved seller record; only then set `sellerUser`
- Provide `sellerSignInWithEmail`, `sellerSignUpWithEmail`, `sellerSignInWithGoogle`, `sellerLogout`
- `sellerSignUpWithEmail` creates seller record + role (moved from `AuthContext.signUpWithEmail`)
- Export `useSellerAuth()` hook

### 2. Remove seller-specific logic from `src/contexts/AuthContext.tsx`
- Remove seller record creation and role assignment from `signUpWithEmail` — that method becomes a generic customer signup
- No other changes to customer auth

### 3. Update `src/App.tsx`
- Wrap app with `SellerAuthProvider` alongside existing `AuthProvider`

### 4. Update seller components to use `useSellerAuth()` instead of `useAuth()`
- `src/components/auth/SellerAuthRoute.tsx` — use `useSellerAuth`, redirect to `/join` instead of `/seller-login`
- `src/pages/seller/SellerLogin.tsx` — use `useSellerAuth`
- `src/pages/seller/SellerSignup.tsx` — use `useSellerAuth`
- `src/layouts/SellerDashboardLayout.tsx` — use `useSellerAuth`
- `src/components/seller-dashboard/DashboardHeader.tsx` — use `useSellerAuth`
- `src/pages/JoinUs.tsx` — use `useSellerAuth` (`sellerUser`) for conditional dashboard rendering

### 5. Update seller dashboard pages that reference `useAuth()`
- `src/pages/seller/SellerDashboardHome.tsx`
- `src/pages/seller/SellerSettings.tsx`
- Any dashboard page using `useAuth()` switches to `useSellerAuth()`

## Files
- **Create**: `src/contexts/SellerAuthContext.tsx`
- **Modify**: `src/contexts/AuthContext.tsx`, `src/App.tsx`, `src/components/auth/SellerAuthRoute.tsx`, `src/pages/seller/SellerLogin.tsx`, `src/pages/seller/SellerSignup.tsx`, `src/layouts/SellerDashboardLayout.tsx`, `src/components/seller-dashboard/DashboardHeader.tsx`, `src/pages/JoinUs.tsx`, `src/pages/seller/SellerDashboardHome.tsx`, `src/pages/seller/SellerSettings.tsx`

