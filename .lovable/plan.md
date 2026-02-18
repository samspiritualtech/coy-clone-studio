

## Fix: sellers.ogura.in Root Shows JoinUs Page (Not Login)

### Root Cause

The `SellerApp.tsx` routing already maps `/` to `<JoinUs />`, so the root route definition is correct. However, the `WrappedRoute` component uses a hardcoded `loginPath="/seller/login"`, which is the path-based dev route. On the production subdomain (`sellers.ogura.in`), the correct login path should be `/login` (without the `/seller` prefix).

Additionally, to make this more robust, we should make the `WrappedRoute` dynamically choose the correct login path based on whether the app is accessed via subdomain or path-based routing.

### Changes

**1. `src/apps/SellerApp.tsx`** -- Make WrappedRoute subdomain-aware

- Import `detectDomain` to check if we're on a subdomain or using path-based routing
- If subdomain (`sellers.*`), use `/login` as loginPath and `/` as unauthorizedRedirect
- If path-based (dev/preview), keep `/seller/login` and `/seller` as before
- This prevents any edge case where auth middleware redirects to a wrong path on the subdomain

**2. `src/lib/domainDetection.ts`** -- Add a helper to check if we're on a subdomain

- Add an `isSubdomain()` utility function that returns `true` when the hostname starts with `sellers.` or `admin.`
- This makes it easy for any component to decide between subdomain-style paths (`/login`) and dev-style paths (`/seller/login`)

### What stays the same
- `JoinUs` component -- no changes
- Dashboard routes and their protection -- unchanged
- Domain detection logic for choosing which app to render -- unchanged
- Admin and Customer routing -- unchanged

