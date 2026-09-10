# 19 — FRONTEND STATE

## 1. AuthContext (src/contexts/AuthContext.tsx)
Exported: `user, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, isAuthenticated, isLoading, isNewUser, completeOnboarding` (AuthContext.tsx:7-17). Backed by internal `session` state (not exposed).
- Init: `supabase.auth.onAuthStateChange` subscription set up first (line 41), then `supabase.auth.getSession()` (line 59) — standard Supabase SSR-safe pattern.
- On session present: `fetchUserProfile` queries `profiles` table by id (line 73-77); falls back to session metadata if no profile row; sets `isNewUser = profile.is_onboarded === false`.
- `signInWithEmail`/`signUpWithEmail` call `supabase.auth.signInWithPassword` / `signUp` directly (lines 160,170). Signup **client-side auto-inserts** `sellers` row (line 175, `application_status: 'approved'` hardcoded) and `user_roles` row (`role: 'seller'`) (line 184) — [SECURITY-SENSITIVE] every self-registered user is auto-approved as a seller from the client with no server-side check.
- `logout()`: `supabase.auth.signOut()` then clears `user`, `session`, `isNewUser` (lines 195-200). No explicit localStorage/cart/wishlist clear — cart and wishlist persist across logout (see §7).
- `sessionStorage` key `ogura_post_auth_path` (line 21,123) stores intended post-login redirect path; read in `src/pages/Login.tsx:20,44` and removed after use.
- Cross-tab: relies entirely on Supabase's own storage-key sync (see `previewAuthStorage.ts`, auto-generated, not documented further per instructions); no custom `storage` event listeners for auth in this context.
- Race condition: `fetchUserProfile` is invoked from `onAuthStateChange` via `setTimeout(...,0)` (line 47-49) specifically to avoid Supabase client deadlock — a known Supabase pattern; if `getSession()` resolves after `onAuthStateChange` fires, `setIsLoading(false)` could be called twice but is idempotent.

```text
[unauthenticated] --signInWithEmail/signUpWithEmail/signInWithGoogle--> [session set via onAuthStateChange]
        |                                                                        |
        |                                                          fetchUserProfile(userId)
        |                                                                        |
        |                                              profile found? --yes--> user set, isNewUser=profile.is_onboarded===false
        |                                                     |no
        |                                                     v
        |                                       user set from session metadata, isNewUser=true
        v
[isAuthenticated=false] <--logout()-- [isAuthenticated=true, user set]
```

## 2. CartContext (src/contexts/CartContext.tsx)
Shape: `items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, tax, total` (lines 4-14).
- Persistence: `localStorage['cart']` (lines 20,25) — plain JSON array of `{product, size, color, quantity}`. **Guest and authenticated carts share the same key; no per-user namespacing** — [SECURITY-SENSITIVE] cart persists after logout and is visible to next user of shared browser.
- `tax = subtotal * 0.18` (18% GST) computed **entirely client-side** (line 67); `total = subtotal + tax` (line 68) — no server recomputation observed in CartContext; Checkout.tsx recomputes independently (see doc 20).
- No cross-tab sync via `storage` event listener — a second tab won't see updates until reload/remount.
- No React Query involvement; pure `useState` + `useEffect` write-through to localStorage.

```text
mount: items = JSON.parse(localStorage['cart']) || []
addItem(product,size,color,qty) -> find matching line -> merge qty or push new line -> setItems -> useEffect -> localStorage['cart']=items
removeItem/updateQuantity(qty<=0) -> filter out line -> same persistence
clearCart() -> items=[] -> localStorage['cart']="[]"
(logout does NOT call clearCart — cart survives auth transitions)
```

## 3. WishlistContext (src/contexts/WishlistContext.tsx, 64 lines)
- Persistence: `localStorage['wishlist']` (code.txt:16,21), same pattern as Cart — JSON array, write-through `useEffect`.
- No per-user namespacing; survives logout — same [SECURITY-SENSITIVE] shared-browser concern as cart.
- Consumers: Search.tsx / Collections.tsx / ProductCard-type components use `useWishlist()` to toggle heart icon state.

## 4. FilterContext (src/contexts/FilterContext.tsx)
Shape: `filters: {category, search, sortBy, priceRange, sizes, colors, tags}`, actions `setCategory, setSearch, setSortBy, setPriceRange, toggleSize, toggleColor, toggleTag, clearFilters` (lines 4-24).
- Pure in-memory `useState`, **no persistence** — filters reset on page reload/navigation away and back. Default: `category:'All', search:'', sortBy:'newest', priceRange:[0,50000], sizes:[], colors:[], tags:[]` (lines 16-24).
- Not connected to URL query params in this context (PLP pages may separately read `useSearchParams` — see §6); no evidence this FilterContext syncs to/from the URL.

```text
clearFilters() -> filters = defaultFilters (category:'All', search:'', sortBy:'newest', priceRange:[0,50000], sizes:[], colors:[], tags:[])
toggleSize/toggleColor/toggleTag -> array include-check -> push or filter -> setFilters(prev=>({...prev, list}))
```

## 5. LocationContext (src/contexts/LocationContext.tsx, 373 lines)
Shape (lines 29-53): `location, isLoading, permissionStatus, requestLocation, setManualLocation, detectLocationByIP, checkDelivery, lookupPincode, showPermissionModal/setShowPermissionModal, showManualSelector/setShowManualSelector, showAddressModal/setShowAddressModal, selectedAddress/setSelectedAddress`.
- Persistence keys: `ogura_user_location` (`LOCATION_STORAGE_KEY`, line 58) and `ogura_selected_address` (`SELECTED_ADDRESS_KEY`, line 59). Also `ogura_location_asked` set by `LocationPermissionModal.tsx:31` (separate flag, "have we asked yet").
- Load order on mount (lines ~104-140): (1) read `localStorage[LOCATION_STORAGE_KEY]` synchronously if present → set immediately; (2) if `isAuthenticated`, query DB (likely a `profiles`/`addresses` table) for a saved location, overwrite localStorage+state if found; (3) fallback to `detectLocationByIP()` which calls the `ip-geolocation` edge function (line 76) and defaults to Delhi on failure (lines 90-100).
- `detectLocationByIP` is silent-fail-safe: on error it still sets a hardcoded `{city:'Delhi', state:'Delhi', country:'India', pincode:''}` default (lines 93-100) so the app is never without a location.
- `checkDelivery`/`lookupPincode` call `pincode-lookup` edge function (line 325) for delivery-zone checks against `delivery_zones` table server-side.
- `selectedAddress` (checkout delivery address) persists to `SELECTED_ADDRESS_KEY` (line 168) — used by Checkout.tsx.
- Cross-tab: none (no storage event listener). Race condition: localStorage read and DB read both mutate `location` state independently; if DB read resolves after localStorage read, DB value wins (last-write) — order-dependent but not guarded against out-of-order async resolution explicitly.

```text
mount -> localStorage[ogura_user_location]? --yes--> setLocation(stored)
                                            --no---> (skip)
      -> isAuthenticated? --yes--> query DB location --found--> setLocation(dbLocation); localStorage[..]=dbLocation
                          --no/not found--> detectLocationByIP()
                                              -> functions.invoke('ip-geolocation')
                                                   success -> setLocation(ipLocation); localStorage[..]=ipLocation
                                                   failure -> setLocation(defaultDelhi); localStorage[..]=defaultDelhi
```

## 6. MadeToOrderContext (src/contexts/MadeToOrderContext.tsx)
Shape: single `state: MTOState` object covering the entire wizard (currentStep, entryPath, inspirationImages: File[], occasion, budget, notes, selectedDesigner, selectedBaseDesign, customizations, generatedPreviews, selectedPreview, designerReviewStatus, designerComments, estimatedPrice, consentToSocialShare) plus setters and `resetJourney()` (lines 19-52).
- **No persistence** — pure in-memory `useState`; a page refresh mid-wizard loses all progress including uploaded `File[]` objects (Files cannot be serialized to localStorage anyway).
- `setEntryPath` also forces `currentStep = 1` as a side effect (line 83) — coupled transition.
- `resetJourney()` resets to `initialState` (defaults: `budget:[25000,500000]`, `customizations:{dressType:'Lehenga', fabric:'Silk', color:'#8B0000', embroideryLevel:'Moderate'}`, `estimatedPrice:[45000,65000]`) (lines 54-75).

```text
[null entryPath, step 0] --setEntryPath(path)--> [entryPath=path, step=1]
  --setSelectedDesigner/setSelectedBaseDesign--> [step 2]
  --setCustomizations(partial merge)--> [step N, customizations updated]
  --setGeneratedPreviews/setSelectedPreview--> [preview review]
  --resetJourney()--> [back to initialState]
```

## 7. @tanstack/react-query usage
Confirmed call sites (code.txt):
- `src/hooks/useDesigners.ts:7` `queryKey:['designers', filters]`; `:43` `queryKey:['designer', id]`
- `src/hooks/useDesignerProducts.ts:13` `queryKey:['designer-products', designerId, filters, page]`; `:88` `queryKey:['designer-categories', designerId]`
- `src/hooks/useDesignerBySlug.ts:7` `queryKey:['designer','slug',slug]`
- `src/components/LoveOguraSection.tsx:18` `queryKey:['influencer-videos']`

No explicit `invalidateQueries`/`useMutation` call sites were found in the grepped set — all observed usage is read-only `useQuery`, meaning writes elsewhere (product uploads, discount inserts, order writes) do **not** invalidate any of these query caches; stale designer/product lists after a seller edits their own product are possible until natural refetch (default `staleTime`) or full navigation remount. [OBSERVED/INFERRED — no global QueryClient config file inspected in this pass]

## 8. URL/query state
`src/pages/Collections.tsx` and `src/pages/Search.tsx` use `useSearchParams` (Collections.tsx pattern inferred from category/subcategory mapping constants at top of file) to drive category filters from the URL; Algolia's InstantSearch (`Search.tsx`) manages its own internal search-state (query, refinements, page) independent of `FilterContext`. [OBSERVED/INFERRED]

## 9. Auth/session persistence (informational only — files below are auto-generated, not to be edited)
`src/integrations/supabase/client.ts` and `src/integrations/supabase/previewAuthStorage.ts` implement the Supabase client and a custom storage adapter: in framed/preview mode, session tokens are relayed via `postMessage` so preview surfaces share one login; otherwise falls back to `localStorage` (previewAuthStorage.ts:18,74-84). Actual Supabase session storage key name is managed internally by the generated client and not restated here per instructions.

## 10. Seller/admin session state
No separate seller/admin session context exists; seller/admin identity is derived per-request via `supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle()` (e.g. DashboardProducts.tsx:45, DashboardDiscounts.tsx:57, DashboardAddProduct.tsx:56) and `src/hooks/useUserRole.ts` (role lookup, presumably against `user_roles` table) — i.e., role/seller-scoping state is **re-fetched per component**, not centralized in AuthContext. [OBSERVED] This means role changes elsewhere are not reactively propagated to already-mounted components using a stale `useUserRole` result until they refetch.

## 11. Other localStorage/sessionStorage keys (misc, non-context)
- `pinterest_connected`, `pinterest_token`, `pinterest_code` — set/read in `ConnectPinterestButton.tsx`, `UserPinterestBoards.tsx`, `PinterestCallback.tsx`. [SECURITY-SENSITIVE] `pinterest_token` (an OAuth access token) is stored in plain localStorage (PinterestCallback.tsx:35), readable by any script/XSS on the origin.
- `ogura_location_asked` — `LocationPermissionModal.tsx:31`, one-time "don't ask again" flag.
- `sidebar:state` cookie (`SIDEBAR_COOKIE_NAME`, `src/components/ui/sidebar.tsx:68`) — shadcn sidebar UI persistence, non-sensitive.

## 12. Security-sensitive summary
- [SECURITY-SENSITIVE] Cart/Wishlist localStorage not cleared on logout — cross-user leakage risk on shared devices.
- [SECURITY-SENSITIVE] Pinterest OAuth token stored in plain localStorage (XSS-exfiltratable).
- [SECURITY-SENSITIVE] `signUpWithEmail` client-side auto-approves every signup as a `seller` with `application_status:'approved'` and assigns `role:'seller'` directly from the browser (AuthContext.tsx:175-187) — trust boundary violation if not backed by strict RLS insert policies limiting what a self-insert can set.
