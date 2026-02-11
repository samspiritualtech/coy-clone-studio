

# Plan: Product Visibility System with Featured Products

## Overview
Create a centralized product catalog data file, a Featured Products section on the homepage, update the All Shop page and Co-ord Sets category page to display products dynamically, and wire the "Explore Collection" button to scroll to the Featured Products section.

---

## 1. Create Product Catalog Data File

### New file: `src/data/productCatalog.ts`

Define a `CatalogProduct` interface and a single product array:

```text
CatalogProduct interface:
  id: string
  title: string
  price: number
  category: string
  showInAllShop: boolean
  showInExplore: boolean
  featured: boolean
  images: string[]
  description?: string
```

Initial product entry:
```text
{
  id: "black-gold-coord",
  title: "Black & Gold Stripe Co-ord Set",
  price: 2999,
  category: "co-ord-sets",
  showInAllShop: true,
  showInExplore: true,
  featured: true,
  images: [all 5 Design A uploaded images]
}
```

Export helper filter functions:
- `getAllShopProducts()` -- returns products where `showInAllShop === true`
- `getProductsByCategory(category)` -- filters by `category`
- `getExploreProducts()` -- returns products where `showInExplore === true` OR `featured === true`
- `getProductById(id)` -- returns a single product

---

## 2. Create Reusable Product Card Component

### New file: `src/components/CatalogProductCard.tsx`

A responsive product card that:
- Shows the first image from the product's images array
- Displays title, price (formatted as INR)
- Links to `/product/{id}`
- Has hover scale effect (1.03) and shadow transition
- Aspect ratio 3:4 for the image area
- Rounded corners, clean typography

---

## 3. Create Featured Products Section on Homepage

### New file: `src/components/FeaturedProducts.tsx`

- Section with `id="featured-products"` (for scroll targeting)
- Title: "Featured Products" or "Explore Our Collection"
- Uses `getExploreProducts()` from the catalog
- Renders a responsive grid: 2 columns mobile, 3 tablet, 4 desktop
- Uses `CatalogProductCard` for each product
- Proper spacing and padding

### Modify: `src/pages/Index.tsx`

- Import and add `FeaturedProducts` section between `CategoryShowcase` and `DesignersSpotlight` (or after the hero -- logical placement for "explore")

---

## 4. Update "Explore Collection" Button (Hero)

### Modify: `src/components/LuxuryHero.tsx`

- Change the "Explore Collection" button from `Link to="/collections"` to a scroll-to-section action
- On click: smooth scroll to `#featured-products` section on the same page
- Remove the `Link` wrapper, use a `Button` with `onClick` that calls `document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })`

---

## 5. Update All Shop / Collections Page

### Modify: `src/pages/Collections.tsx`

- Replace "Coming Soon" placeholder with a real product grid
- Import `getAllShopProducts()` from catalog
- Display products using `CatalogProductCard` in a responsive grid
- Add page title "All Shop" or "Shop All"
- Keep Header and Footer

---

## 6. Update Category Page for Co-ord Sets

### Modify: `src/pages/CategoryPage.tsx`

- For `slug === "co-ord-sets"` (and other slugs with products), query `getProductsByCategory(slug)`
- If products exist, render the category hero info + product grid using `CatalogProductCard`
- If no products, keep the existing "Coming Soon" placeholder
- Keep existing `made-to-order` redirect logic

---

## 7. Update Product Detail Page

### Modify: `src/pages/ProductDetail.tsx`

- Extract product `id` from URL params
- Look up product via `getProductById(id)`
- If found: show the product gallery (reuse `ProductGallery` component), title, price, and description
- If not found: show "Product not found" with back button
- Keep Header and Footer

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/data/productCatalog.ts` | Central product data + filter helpers |
| Create | `src/components/CatalogProductCard.tsx` | Reusable product card |
| Create | `src/components/FeaturedProducts.tsx` | Homepage featured section |
| Modify | `src/pages/Index.tsx` | Add FeaturedProducts section |
| Modify | `src/components/LuxuryHero.tsx` | Scroll to featured instead of /collections |
| Modify | `src/pages/Collections.tsx` | Show all shop products |
| Modify | `src/pages/CategoryPage.tsx` | Show category-filtered products |
| Modify | `src/pages/ProductDetail.tsx` | Show real product detail |

