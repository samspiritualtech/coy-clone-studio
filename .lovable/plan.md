

# Fix Product Detail Page for External API Products

## Problem
The PDP currently looks up products only from the static `products` array (`src/data/products.ts`). When a user clicks an API product from Collections, the ID won't match any static product, so they see "Product not found."

## Solution
Add an API fetch to the ProductDetail page that mirrors the Collections page pattern. On mount, fetch all products from the external API, find the one matching the URL `id`, and merge with the static catalog as fallback.

## Changes — `src/pages/ProductDetail.tsx`

1. **Add state**: `apiProduct` (Product | null), `isApiLoading` (boolean), `apiError` (boolean)

2. **Add useEffect** that fetches from `https://pyesltzkemtranachpne.supabase.co/functions/v1/products`, maps the response to `Product` type (reuse same mapping logic from Collections), and finds the item matching `id`

3. **Resolve product**: `currentProduct = apiProduct ?? staticProducts.find(p => p.id === id)` — API takes precedence, static is fallback

4. **Loading state**: Show skeleton/spinner while `isApiLoading` is true

5. **Error state**: If loading is done and no product found, show "Product not found" with a "Browse Collections" button (already exists)

6. **"Buy Now" button**: Already exists in the page — no changes needed

7. No other structural changes — the rest of the PDP (gallery, sizes, cart, wishlist, recommendations) continues to work with the resolved `currentProduct`

## Files to Modify
- `src/pages/ProductDetail.tsx`

