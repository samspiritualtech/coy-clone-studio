

# Fetch & Display External API Products on Collections Page

## Overview
Integrate the external API (`https://pyesltzkemtranachpne.supabase.co/functions/v1/products`) into the existing Collections page, replacing the current local database fetch with API products while keeping the existing static products as a fallback/merge.

## Changes

### 1. `src/pages/Collections.tsx`
- Replace the `fetchLiveProducts` Supabase query with a `fetch()` call to the external API URL
- Map the API response fields (`image_url`, `name`, `price`) to the existing `Product` type
- Add a "Buy Now" button to each product card (navigates to cart or product detail)
- Add loading state: show skeleton/spinner while fetching
- Add empty state: "No products available" message when API returns no products
- Keep existing static products as fallback (merge with API products, API takes precedence)

### 2. Product Card Updates (inline in Collections.tsx)
- Display `image_url` as the product image
- Display `name` and `price`
- Add a "Buy Now" button below price that navigates to `/product/:id` or adds to cart

## Technical Details
- Use `fetch()` directly to the external URL (no Supabase client needed for this call)
- Handle network errors gracefully with try/catch
- Loading: show a grid of skeleton cards (reuse existing pattern)
- Empty: centered message with icon

## Files to Modify
- `src/pages/Collections.tsx`

