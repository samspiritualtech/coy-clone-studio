

# Add Pinterest OAuth Callback Route

## Changes

### 1. Create `src/pages/PinterestCallback.tsx`
- Extract `code` from URL query params using `useSearchParams`
- Store in `localStorage` as `pinterest_code`
- Also set `pinterest_connected = "true"` and dispatch `pinterest_connection_change` event
- Display the code on screen and "Pinterest connected successfully" message
- "Go to Home" button using `useNavigate`
- Clean centered card UI

### 2. Update `src/apps/CustomerApp.tsx`
- Add route: `<Route path="/auth/pinterest/callback" element={<PinterestCallback />} />`

### Files
- **Create**: `src/pages/PinterestCallback.tsx`
- **Modify**: `src/apps/CustomerApp.tsx` — add route

