

## Subdomain Routing: sellers.ogura.in loads the Designer Onboarding Page

### Problem
When `sellers.ogura.in` is opened, it currently loads the `SellerApp` which shows a generic "Seller Landing" page with a minimal header. The user wants it to load the **JoinUs page** ("Join Ogura as an Independent Fashion Designer or Fashion Studio Owner") with the same luxury header and footer as the main customer site.

### Solution

**1. Update SellerApp to use JoinUs as the root landing page**

Replace the `SellerLanding` component at the `/` route with the existing `JoinUs` component from `src/pages/JoinUs.tsx`. This page already uses `LuxuryHeader` and `LuxuryFooter`, matching the main site's look and feel -- no layout wrapper needed for the landing route.

**2. Keep dashboard routes intact**

All authenticated seller dashboard routes (`/dashboard`, `/products`, `/orders`, etc.) remain unchanged and continue using `SellerDashboardLayout`.

**3. Update the SellerPublicLayout header links**

Update the "Apply Now" button in the seller public layout to link sellers to the login page, and adjust the fallback catch-all route to also show JoinUs.

### Technical Details

**Files to modify:**

- `src/apps/SellerApp.tsx` -- Replace `SellerLanding` with `JoinUs` for the root (`/`) and `/seller` routes. Remove the `SellerPublicLayout` wrapper on those routes since `JoinUs` already includes `LuxuryHeader` and `LuxuryFooter`.

- `src/layouts/SellerPublicLayout.tsx` -- Update "Apply Now" link to point to `/seller/login` or `/login` depending on context.

### What stays the same
- The `JoinUs` page component itself -- no changes needed
- All seller dashboard routes and role protection
- Domain detection logic
- Admin routing
- Customer routing

