# Fix: Seller product descriptions not showing on consumer PDP

## Root cause

Two different data sources are in play:

- **Seller Portal** (`src/pages/seller/SellerAddProduct.tsx`) writes products — including `description` — to **our** Lovable Cloud project (`yudzgkrjsstqbfrrrrly`), table `public.products`.
- **Consumer Collections + Product Detail** fetch from a **different** external Supabase project edge function: `https://pyesltzkemtranachpne.supabase.co/functions/v1/products`.

I hit that external endpoint directly. The response only contains:
```
{ id, name, price, category (null), image_urls, video_url }
```
No `description`, no `title`, no `material`, etc. So even if mapping were perfect, the description field isn't being returned at all — because the consumer is reading from a different database than the one sellers write to.

This also explains why "No description available" always shows: the field is literally absent in the API payload.

## Fix strategy

Switch the consumer product fetch to read from **our** Lovable Cloud `products` table (where sellers save data), filtered to `status = 'live' AND is_available = true` (RLS already allows anonymous SELECT for that). Keep the external API as a secondary/fallback merge so currently-listed external items don't disappear.

## Changes

### 1. `src/pages/ProductDetail.tsx`
- Replace the external `fetch(...)` with a query against our DB:
  ```ts
  supabase.from('products').select('*').eq('id', id).maybeSingle()
  ```
- Map DB row → `Product`:
  - `title` → `name`
  - `description` → `description`
  - `category` → `category`
  - `images` (jsonb array) → `images` (fallback to `["/placeholder.svg"]` if empty)
  - `price` → `price`
  - `original_price` → `originalPrice`
  - `colors`, `sizes`, `style_tags`, `occasion_tags`, `material`, `fabric` → corresponding Product fields
- Keep the existing external API call only as a fallback when the local query returns no row (preserves legacy external products).
- Add a temporary `console.log("[PDP] product row:", row)` to confirm `description` is received.

### 2. `src/pages/Collections.tsx`
- Add a parallel query to local DB live products and merge them into the grid alongside external API results. (Local items take precedence on duplicate ids.) This ensures newly-added seller products appear immediately on `ogura.in`.

### 3. `src/components/ProductDetailsAccordion.tsx`
- Verify it reads `product.description` and only falls back to "No description available" when the string is null/undefined/empty after trim. (Will adjust if currently using a looser check.)

### 4. Cache / freshness
- The PDP and Collections use plain `useEffect` + `fetch` (no React Query for these). No cache invalidation needed; each navigation re-queries. After seller edits, a page reload on the consumer side will show the new description immediately.
- If we later wrap these in React Query, add `staleTime: 0` and `queryKey: ['product', id]` with `invalidateQueries` on seller save — out of scope for this fix.

### 5. Temporary logging
- Add `console.log` lines in PDP fetch + mapping. Will remove once confirmed working.

## Files to modify
- `src/pages/ProductDetail.tsx`
- `src/pages/Collections.tsx`
- `src/components/ProductDetailsAccordion.tsx` (only if its empty-check is wrong)

## Out of scope
- Modifying the external `pyesltzkemtranachpne` edge function (different project, not ours).
- Migrating existing external products into our DB.
- Adding React Query.
