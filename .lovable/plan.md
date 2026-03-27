

# Fix Pinterest OAuth Token Exchange

## Root Cause
The edge function logs show: `InvalidCharacterError: Cannot encode string: string contains characters outside of the Latin1 range` at the `btoa()` call. The `PINTEREST_CLIENT_SECRET` contains characters that `btoa()` cannot handle in Deno. Additionally, the frontend is still using a mock token (`Bearer mock_access_token_xyz`) for API calls.

## Fix

### 1. Fix `supabase/functions/pinterest-token-exchange/index.ts`
Replace `btoa(clientId + ":" + clientSecret)` with a Deno-compatible base64 encoding using `TextEncoder` + Deno's `encodeBase64` from std library, which handles all byte values correctly:

```typescript
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const basicAuth = encodeBase64(new TextEncoder().encode(`${clientId}:${clientSecret}`));
```

Also add debug logging for the Pinterest API response status and body.

### 2. Fix `src/components/UserPinterestBoards.tsx`
The network requests show it's calling Pinterest API with `Bearer mock_access_token_xyz`. Ensure it reads the real token from `localStorage("pinterest_token")` and handles the case where the token is a mock/invalid value by clearing connection state.

### Files to modify
- `supabase/functions/pinterest-token-exchange/index.ts` — fix base64 encoding
- `src/components/UserPinterestBoards.tsx` — clear stale mock token

