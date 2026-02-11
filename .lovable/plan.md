

# Plan: Myntra-Style Product Rendering

## Overview
Add a second product (Colorful Printed Co-ord Set) to the catalog, upgrade the product detail page to a Myntra-style two-column layout with vertical thumbnails, size selector, Add to Bag, and Wishlist buttons, and enhance the product card with image fallback support.

---

## 1. Update Product Catalog

### Modify: `src/data/productCatalog.ts`

Add `sizes` field to the `CatalogProduct` interface and add the second product entry:

```text
Interface addition:
  sizes: string[]   (e.g. ["S", "M", "L", "XL"])

New product:
{
  id: "colorful-coord",
  title: "Colorful Printed Co-ord Set",
  price: 2499,
  category: "co-ord-sets",
  showInAllShop: true,
  showInExplore: true,
  featured: true,
  sizes: ["S", "M", "L", "XL"],
  images: [
    "/user-uploads/imgi_19_HASnCL0O_0064ba7d42224827b21bb798565d4b2e.jpg",
    "/user-uploads/imgi_20_v6kcUeDj_243f3eae7fca4b8c964b4843dff9418b.jpg",
    "/user-uploads/imgi_21_z2etZUrt_ec4bbb6073784d899f9c0d004236bbe7.jpg",
  ],
  description: "A vibrant printed co-ord set with traditional motifs..."
}
```

Also add `sizes` to the existing black-gold-coord product.

---

## 2. Upgrade Product Detail Page (Myntra Layout)

### Modify: `src/pages/ProductDetail.tsx`

Replace the current simple layout with a Myntra-style two-column design:

**Left Column -- Image Gallery (Myntra style):**
- Vertical thumbnail column on the left side (hidden on mobile, shown on desktop)
- Large main image next to thumbnails
- Clicking a thumbnail swaps the main image with a 0.3s fade
- Clicking the main image opens the existing lightbox (reuse ProductGallery lightbox logic)
- Hover zoom effect on main image (scale 1.05)
- Image `onError` fallback to `/placeholder.svg`
- On mobile: horizontal thumbnail strip below main image (same as current ProductGallery)

**Right Column -- Product Info:**
- Product title (text-2xl font-bold)
- Price in INR (text-xl, with horizontal rule below)
- Size selector: row of pill buttons (S, M, L, XL) with selected state (border-primary bg-primary/10)
- "ADD TO BAG" button: full-width, tall, pink/primary background, uppercase
  - Uses existing CartContext.addItem() -- converts CatalogProduct to the Product type needed by cart
- Wishlist heart button: outline button with heart icon
  - Uses existing WishlistContext.toggleItem()
- Product description section
- Delivery checker (optional, can reuse DeliveryChecker component)

---

## 3. Enhance CatalogProductCard with Fallback

### Modify: `src/components/CatalogProductCard.tsx`

- Add `onError` handler on the image to swap to `/placeholder.svg` if the image fails to load
- Keep existing hover zoom and shadow effects

---

## 4. No Changes Needed To

These pages/components already work correctly with the catalog system:
- `src/pages/Collections.tsx` -- already uses `getAllShopProducts()`, will pick up both products
- `src/pages/CategoryPage.tsx` -- already uses `getProductsByCategory()`, will show both for "co-ord-sets"
- `src/components/FeaturedProducts.tsx` -- already uses `getExploreProducts()`, will show both
- `src/components/LuxuryHero.tsx` -- already scrolls to `#featured-products`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/data/productCatalog.ts` | Add colorful-coord product + sizes field |
| Modify | `src/pages/ProductDetail.tsx` | Myntra-style 2-column layout with size selector, add to bag, wishlist |
| Modify | `src/components/CatalogProductCard.tsx` | Add image fallback |

