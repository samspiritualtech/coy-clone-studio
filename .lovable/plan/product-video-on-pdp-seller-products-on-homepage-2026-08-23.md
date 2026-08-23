# Product Video on PDP + Seller Products on Homepage

## 1. Product video support

- Add optional `videoUrl?: string` to the `Product` interface in `src/types/index.ts`.
- In `src/pages/ProductDetail.tsx`, in the external Seller Center API fallback mapping (~line 116), add `videoUrl: found.video_url ?? undefined`.
- Below `ProductImageGallery` in the PDP left column, render, only when `currentProduct.videoUrl` is set:
  `<video src={currentProduct.videoUrl} controls playsInline preload="metadata" className="w-full rounded-lg aspect-video" />`
- The local Cloud DB mapping also gets `videoUrl` from its `video_url` field if present, so both sources behave the same.

## 2. New seller-products carousel on the homepage

The homepage currently has no product-listing section. Add one:

- New component `src/components/SellerNewArrivals.tsx`:
  - Fetches `https://pyesltzkemtranachpne.supabase.co/functions/v1/products` on mount.
  - Normalizes each item to the internal `Product` shape using the same field mapping as the PDP fallback (`name`/`title`, `image_urls`/`image_url`, `price`, `original_price`, `video_url`, etc.).
  - Loading: skeleton cards. Empty or failed fetch: render nothing so the homepage stays clean.
  - Renders the existing `ProductCarousel` with title "New Arrivals" (cards already link to `/product/{id}`).
- Mount it in `src/pages/Index.tsx` directly after `Premium3DCategorySection` (i.e. after Shop By Categories), outside the museum band.

## Technical notes

- No backend or schema changes; the external API is fetched directly from the client.
- Mapping stays defensive (arrays vs single image URL, missing fields) to avoid the previously-seen `undefined.includes` crash.
