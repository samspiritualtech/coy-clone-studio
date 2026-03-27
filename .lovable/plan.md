

# Fix Pinterest Token Exchange — Redirect URI Mismatch

## Root Cause

The edge function code is already correct (uses `URLSearchParams`, proper headers, correct endpoint). The Pinterest error `{ code: 2, message: "Authentication failed." }` is caused by a **redirect URI mismatch**.

The callback page on line 22 sends:
```typescript
const redirectUri = `${window.location.origin}/auth/pinterest/callback`;
```

When accessed via the **published URL** (`https://coy-clone-studio.lovable.app`), this works. But when accessed via the **preview URL** (`https://id-preview--d4269340-...lovable.app`), the origin doesn't match what's registered with Pinterest, causing authentication failure.

Additionally, Pinterest authorization codes are single-use — if the page re-renders or `useEffect` fires twice (React StrictMode), the second attempt will fail.

## Changes

### 1. Fix `src/pages/PinterestCallback.tsx`
- **Hardcode the redirect URI** to `https://coy-clone-studio.lovable.app/auth/pinterest/callback` (same as `ConnectPinterestButton`), instead of using `window.location.origin`
- Add a `useRef` guard to prevent the token exchange from firing twice (React StrictMode double-mount)
- Add debug logging for the response

### 2. Add logging to `supabase/functions/pinterest-token-exchange/index.ts`
- Log the received `redirect_uri` and `code` length before making the Pinterest API call
- Log the full Pinterest response status and body for debugging

## Files
- **Modify**: `src/pages/PinterestCallback.tsx` — hardcode redirect URI, add double-call guard
- **Modify**: `supabase/functions/pinterest-token-exchange/index.ts` — add request/response logging

