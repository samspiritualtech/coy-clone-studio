

# Fix Pinterest Connect Button OAuth URL

## Problem
The button uses `window.location.origin` for the redirect URI (which resolves to the preview URL, not the published URL) and reads the client ID from an env variable that may be empty. Pinterest rejects the request because the redirect URI doesn't match what's registered.

## Fix — `src/components/ConnectPinterestButton.tsx`

Hardcode the client ID and redirect URI to match the registered Pinterest app:

**Lines 6-8**: Replace the env variable with a hardcoded client ID:
```typescript
const PINTEREST_CLIENT_ID = "1556665";
```

**Lines 18-26**: Update `handleConnect` to use the exact published redirect URI:
```typescript
const handleConnect = () => {
  const redirectUri = "https://coy-clone-studio.lovable.app/auth/pinterest/callback";
  const oauthUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=boards:read,pins:read`;
  window.location.href = oauthUrl;
};
```

This ensures the redirect URI always matches the one registered in the Pinterest developer app, regardless of whether the user is on the preview or published URL.

