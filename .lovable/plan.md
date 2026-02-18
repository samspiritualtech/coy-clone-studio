

## Remove Redirect, Render JoinUs Internally on sellers.ogura.in

### Problem
`src/main.tsx` contains an early browser redirect (lines 1-6) that sends `sellers.ogura.in/` to `https://ogura.in/join` before React mounts. This overrides the correct routing already present in `SellerApp.tsx`.

### Changes

**1. `src/main.tsx`** -- Remove the redirect block (lines 1-6)

Delete the `if (window.location.hostname.includes("sellers.") ...)` block entirely. The React app will now mount normally and `SellerApp` will handle routing.

**2. `src/apps/SellerApp.tsx`** -- Add `/join` route

Add a route for `/join` that also renders `<JoinUs />`, so both `sellers.ogura.in/` and `sellers.ogura.in/join` show the onboarding page.

### What stays the same
- JoinUs component -- no changes
- Dashboard routes and authentication -- unchanged
- Admin and customer routing -- unchanged
- Domain detection logic -- unchanged
