

# Upgrade Pinterest Integration to Real API

## Overview
Replace all mock Pinterest data with real Pinterest API v5 calls. This requires:
1. A backend edge function to securely exchange the OAuth code for an access token (keeping `client_secret` server-side)
2. Frontend components updated to call Pinterest API v5 endpoints directly using the stored access token
3. Pinterest developer app credentials (client ID + client secret)

## Prerequisites — Pinterest API Credentials
You need a Pinterest developer app to get a **Client ID** and **Client Secret**:
1. Go to [developers.pinterest.com](https://developers.pinterest.com) and create an app
2. Set the redirect URI to your site's callback URL (e.g. `https://coy-clone-studio.lovable.app/auth/pinterest/callback`)
3. Request scopes: `boards:read`, `pins:read`
4. Copy the **App ID** (client ID) and **App Secret** (client secret)

Once you have these, I'll securely store the client secret as a backend secret and put the client ID in the codebase (it's a public/publishable key).

## Technical Plan

### 1. Store Pinterest secrets
- Add `PINTEREST_CLIENT_ID` to codebase (public key, safe to embed)
- Add `PINTEREST_CLIENT_SECRET` as a backend secret via the secrets tool

### 2. Create edge function `supabase/functions/pinterest-token-exchange/index.ts`
- Receives `{ code, redirect_uri }` from frontend
- Calls Pinterest token endpoint: `POST https://api.pinterest.com/v5/oauth/token` with `grant_type=authorization_code`, `code`, `redirect_uri`, and Basic auth header (`client_id:client_secret` base64)
- Returns `{ access_token }` to frontend
- Includes CORS headers

### 3. Update `src/components/ConnectPinterestButton.tsx`
- `handleConnect()` redirects to real Pinterest OAuth URL:
  `https://www.pinterest.com/oauth/?response_type=code&redirect_uri=...&client_id=...&scope=boards:read,pins:read`
- Remove mock localStorage writes

### 4. Update `src/pages/PinterestCallback.tsx`
- On mount, if `code` exists, call the `pinterest-token-exchange` edge function
- Store the returned real `access_token` in localStorage as `pinterest_token`
- Show loading state during exchange, error state if it fails
- On success, set `pinterest_connected = "true"` and redirect to home after 2s

### 5. Update `src/components/UserPinterestBoards.tsx`
- On mount (when connected), call `GET https://api.pinterest.com/v5/boards` with `Authorization: Bearer {token}`
- Map response to board cards: `id`, `name`, `media.image_cover_url`, `pin_count`
- Add loading skeleton and error states
- Remove mock data import

### 6. Update `src/components/PinterestBoardModal.tsx`
- When a board is selected, fetch pins: `GET https://api.pinterest.com/v5/boards/{board_id}/pins`
- Map response: `id`, `media.images.originals.url`, `description`
- Extract keywords from `description` for "Shop Similar" (first 2-3 words)
- Add loading state inside modal
- Remove mock data dependency

### 7. Update types
- Update or replace `src/data/pinterestMockData.ts` — keep only the TypeScript interfaces (remove mock data arrays), adapt interfaces to match Pinterest API v5 response shapes

## Files Summary
- **Create**: `supabase/functions/pinterest-token-exchange/index.ts`
- **Modify**: `ConnectPinterestButton.tsx`, `PinterestCallback.tsx`, `UserPinterestBoards.tsx`, `PinterestBoardModal.tsx`, `pinterestMockData.ts`
- **Secrets needed**: `PINTEREST_CLIENT_SECRET` (backend secret), `PINTEREST_CLIENT_ID` (in codebase)

## Next Step
I need you to provide your Pinterest App ID (client ID) and App Secret (client secret) from your Pinterest developer account. Do you have these credentials ready?

