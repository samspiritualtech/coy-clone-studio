

## Fix: sellers.ogura.in Redirects to ogura.in/join

### Problem
When `sellers.ogura.in` is opened, it loads the main `ogura.in` homepage instead of the designer onboarding page. The internal routing approach hasn't resolved this in production, likely due to how DNS/hosting serves the subdomain.

### Solution: Early Redirect in main.tsx

Add a redirect check that runs **before React mounts**, so it executes immediately when the page loads:

**File: `src/main.tsx`**

Add this block at the very top of the file (before any imports or React rendering):

```
if (
  window.location.hostname.includes("sellers.") &&
  window.location.pathname === "/"
) {
  window.location.href = "https://ogura.in/join";
}
```

This ensures:
- Only affects `sellers.*` hostnames
- Only triggers on the root path `/`
- Does NOT affect `admin.ogura.in` or `ogura.in`
- Does NOT modify any UI, authentication, or dashboard routing
- Dashboard routes like `/dashboard`, `/products`, `/orders` on `sellers.ogura.in` continue to work normally (they don't match pathname `"/"`)

### What stays the same
- No changes to `SellerApp.tsx`, `domainDetection.ts`, or `App.tsx`
- No changes to the `JoinUs` component
- No changes to authentication logic
- No changes to admin or customer routing

