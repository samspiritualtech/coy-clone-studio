

# Plan: Remove All Product Data, Search, and Algolia Integration

## Overview
Completely remove Algolia, the static product catalog, and all search functionality. Replace all product-dependent pages with "Coming Soon" placeholders.

---

## Phase 1: Delete Algolia Files

### Delete these files entirely (13 files):
- `src/lib/algoliaClient.ts`
- `src/components/search/AlgoliaFilterSidebar.tsx`
- `src/components/search/AlgoliaMobileFilters.tsx`
- `src/components/search/AlgoliaMobileSearch.tsx`
- `src/components/search/AlgoliaNoResults.tsx`
- `src/components/search/AlgoliaPriceRange.tsx`
- `src/components/search/AlgoliaProductHit.tsx`
- `src/components/search/AlgoliaRefinementList.tsx`
- `src/components/search/AlgoliaSearchBox.tsx`
- `src/components/search/AlgoliaSearchDropdown.tsx`
- `src/components/search/AlgoliaSearchResults.tsx`
- `src/components/search/AlgoliaTrendingProducts.tsx`
- `supabase/functions/sync-algolia/index.ts` (delete entire folder + remove deployed function)

### Delete the search barrel file:
- `src/components/search/index.ts`

---

## Phase 2: Delete Product Data Files

### Delete:
- `src/data/products.ts` -- the 700+ item static catalog

---

## Phase 3: Remove Dependencies

### From `package.json`, remove:
- `algoliasearch`
- `react-instantsearch`

---

## Phase 4: Replace Product-Dependent Pages with "Coming Soon"

Each page below will be simplified to show Header + a centered "Coming Soon" placeholder + Footer.

### Pages to replace:

| Page | File | What it currently does |
|------|------|----------------------|
| Collections | `src/pages/Collections.tsx` | Shows all 700+ products with filtering |
| Product Detail | `src/pages/ProductDetail.tsx` | Shows individual product with recommendations |
| Brand Detail | `src/pages/BrandDetail.tsx` | Shows brand info + filtered products |
| Occasion Detail | `src/pages/OccasionDetail.tsx` | Shows occasion-themed products |
| Search | `src/pages/Search.tsx` | Algolia-powered search results |
| Category Page | `src/pages/CategoryPage.tsx` | Category hero + product grid |

### "Coming Soon" template for each page:
```text
[Header]
  Centered icon + "Coming Soon" heading
  "We're working on something amazing. Stay tuned!"
  [Back to Home button]
[Footer]
```

---

## Phase 5: Remove Search from Headers

### `src/components/Header.tsx`
- Remove import of `AlgoliaSearchDropdown` and `AlgoliaMobileSearch`
- Remove the desktop search div and mobile search div
- Keep everything else (logo, nav, cart, user menu)

### `src/components/LuxuryHeader.tsx`
- Remove import of `AlgoliaSearchDropdown` and `AlgoliaMobileSearch`
- Remove desktop search block (lines 117-120)
- Remove mobile search block (lines 168-171)
- Keep all other navigation, location bar, and cart

---

## Phase 6: Update Product-Dependent Components

### Components that import `products` from `@/data/products`:

| Component | Action |
|-----------|--------|
| `src/components/HeroCarousels.tsx` | Replace with empty/coming soon state |
| `src/components/ProductGrid.tsx` | Remove `products` import, keep component for future use with passed-in data |
| `src/components/category/CategoryProductGrid.tsx` | Replace with "Coming Soon" message |
| `src/services/recommendationService.ts` | Return empty arrays instead of querying product catalog |

### Components using recommendations (keep but will show empty):
- `src/components/RecommendationCarousel.tsx` -- already handles empty state
- `src/components/SimilarProductsGrid.tsx` -- will receive empty array
- `src/hooks/useRecommendations.ts` -- will get empty results from service

---

## Phase 7: Update App Router

### `src/App.tsx`
- Keep all routes (they'll show "Coming Soon" placeholders)
- No route deletions needed

---

## Phase 8: Cleanup and Deploy

- Delete the deployed `sync-algolia` edge function
- Verify no imports reference deleted files
- No Algolia API keys or network requests remain

---

## Files Summary

| Action | Count | Files |
|--------|-------|-------|
| Delete | 15 | 12 Algolia components + algoliaClient + search/index.ts + products.ts |
| Delete edge function | 1 | sync-algolia |
| Replace with placeholder | 6 | Collections, ProductDetail, BrandDetail, OccasionDetail, Search, CategoryPage |
| Modify (remove search) | 2 | Header.tsx, LuxuryHeader.tsx |
| Modify (remove product imports) | 4 | HeroCarousels, ProductGrid, CategoryProductGrid, recommendationService |
| Remove deps | 2 | algoliasearch, react-instantsearch |

---

## What Remains Untouched
- Cart and Wishlist contexts (keep for future use, will just be empty)
- Designer products from database (these are NOT from the static catalog)
- All non-product pages (Home, Brands listing, Designers, Stores, etc.)
- Image search dialog component (will have no products to show but kept)
- Edge functions other than sync-algolia

