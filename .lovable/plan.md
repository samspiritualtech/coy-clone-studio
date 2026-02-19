

## Add /join Route to Seller App (Without Redirect)

### Problem
The requested `main.tsx` change would cause an infinite redirect loop because `window.location.hostname` remains `sellers.ogura.in` after redirecting to `/join`, re-triggering the redirect endlessly.

### Current Behavior (Already Working)
- `sellers.ogura.in` (or `/seller` in preview) renders the `SellerLanding` page directly -- no redirect needed
- The SPA router handles this internally without changing the URL

### What We'll Do Instead
Add `/seller/join` as an explicit route in `SellerApp.tsx` that also renders the landing page. This way both `/seller` and `/seller/join` show the partner onboarding page.

### Technical Change

**File: `src/apps/SellerApp.tsx`**
- Add a route for `/seller/join` pointing to the same `SellerLanding` component
- No changes to `main.tsx` (avoids the infinite loop)

```
Route additions:
  /seller       → SellerLanding (existing)
  /seller/join  → SellerLanding (new alias)
```

This is a single-line addition that achieves the goal safely.

