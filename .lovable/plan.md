

# Seller Auth System with Email + Google Login

## Overview
Create a complete seller authentication system with email/password signup+login and Google OAuth. Add `/seller-login` and `/seller-signup` routes. Auto-create a seller record on signup. Remove the role-based protection from dashboard routes and replace with simple auth check. Update the dashboard header to show login/signup links or avatar+logout.

## Changes

### 1. Add `signInWithEmail` and `signUpWithEmail` to AuthContext
Add two new methods to `AuthContextType` and implement them:
- `signInWithEmail(email, password)` — calls `supabase.auth.signInWithPassword`
- `signUpWithEmail(email, password)` — calls `supabase.auth.signUp`, then auto-creates a seller record

### 2. Create `/pages/seller/SellerSignup.tsx`
Clean, centered card with:
- OGURA logo + "Seller" badge
- Email + Password fields
- "Create Account" button
- Google sign-up button (reuse `GoogleSignInButton`)
- Link to `/seller-login`
- On successful signup: insert into `sellers` table with `application_status: 'approved'`, assign `seller` role in `user_roles`, redirect to `/seller/dashboard`

### 3. Rewrite `/pages/seller/SellerLogin.tsx`
Clean, centered card (Shopify-style) with:
- OGURA logo + "Seller" badge
- Email + Password fields
- "Login" button
- Google login button
- Link to `/seller-signup`
- On successful login: redirect to `/seller/dashboard`

### 4. Update `SellerApp.tsx` routes
- Add `/seller-login` and `/seller-signup` routes
- Replace `RoleProtectedRoute` with a simple `SellerAuthRoute` that only checks `isAuthenticated` (no role check), redirecting to `/seller-login` if not logged in

### 5. Create `SellerAuthRoute` component
Simple wrapper: if authenticated → render children, else → redirect to `/seller-login`. No role check.

### 6. Update `SellerDashboardLayout` header
Add to the top-right header area:
- If not logged in: "Login | Signup" links
- If logged in: Avatar + Logout button

### 7. Auto-create seller record
In `SellerSignup.tsx`, after successful `signUp`:
```typescript
await supabase.from("sellers").insert({
  user_id: user.id,
  brand_name: email.split("@")[0],
  city: "Unknown",
  seller_type: "individual",
  application_status: "approved"
});
await supabase.from("user_roles").insert({
  user_id: user.id,
  role: "seller"
});
```

### 8. Database: Enable email auth
Use `configure_auth` tool to enable email signups with auto-confirm (for dev convenience).

### Files to create
- `src/pages/seller/SellerSignup.tsx`
- `src/components/auth/SellerAuthRoute.tsx`

### Files to modify
- `src/contexts/AuthContext.tsx` — add `signInWithEmail`, `signUpWithEmail`
- `src/pages/seller/SellerLogin.tsx` — rewrite with email+password form
- `src/apps/SellerApp.tsx` — add routes, swap `RoleProtectedRoute` for `SellerAuthRoute`
- `src/layouts/SellerDashboardLayout.tsx` — add auth UI to header

