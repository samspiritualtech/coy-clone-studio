

# Remove Dashboard from Join Page, Ensure Separate Dashboard Route

## Problem
The `/join` page currently embeds `SellerDashboardShowcase` inline when `sellerUser` exists. The user wants it on a dedicated `/seller/dashboard` page only.

## Current State
- `/seller/dashboard` already exists in `SellerApp.tsx` with full auth protection (WrappedRoute → SellerAuthRoute → SellerDashboardLayout)
- `SellerLogin` and `SellerSignup` already `navigate("/seller/dashboard")` after success
- `SellerAuthRoute` already redirects to `/join` when unauthenticated

## Changes

### 1. `src/pages/JoinUs.tsx` — Remove dashboard section
- Remove the `sellerUser` import and conditional `<SellerDashboardShowcase />` block (lines 4-5, 8, 44-51)
- Remove unused imports (`SellerDashboardShowcase`, `useSellerAuth`)
- Keep the rest of the page exactly as-is

### 2. No other changes needed
- Routing in `SellerApp.tsx` is already correct (`/seller/dashboard` → protected WrappedRoute)
- Login/Signup pages already redirect to `/seller/dashboard` on success
- `SellerAuthRoute` already redirects unauthenticated users to `/join`

## Files
- **Modify**: `src/pages/JoinUs.tsx` (remove 2 imports + conditional dashboard block)

