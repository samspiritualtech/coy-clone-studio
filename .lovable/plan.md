

# 3D Gradient Effect for Product Tiles

Add a premium 3D glassmorphism/gradient effect to all product card components across the site, making each tile visually pop with depth, shadows, and subtle gradient borders.

## Visual Effect Description

Each product tile will feature:
- A multi-layered box shadow creating a 3D "lifted" appearance
- A subtle gradient border (warm gold-to-rose tones matching the OGURA luxury aesthetic)
- On hover: the card lifts further with enhanced shadow depth and a slight Y-axis tilt (perspective transform)
- A soft gradient shimmer overlay on the image area
- Smooth 300ms transitions for all effects

## Technical Approach

### 1. Add CSS utilities in `src/index.css`

New utility classes under `@layer utilities`:

- `.product-tile-3d` -- base 3D shadow + gradient border effect using `background-image` on a wrapper with padding to simulate a gradient border, plus layered `box-shadow` for depth
- `.product-tile-3d:hover` -- enhanced shadow, `translateY(-6px)`, subtle `rotateX(2deg)` with `perspective(1000px)`
- `.product-tile-3d-shimmer` -- a pseudo-element shimmer gradient overlay on the image

### 2. Update product card components

Apply the new classes to these 5 components:

- **`src/components/PLPProductCard.tsx`** -- Add 3D wrapper around the card, gradient border, enhanced hover shadows
- **`src/components/ProductCarousel.tsx`** -- Apply 3D effect to each carousel item card
- **`src/components/ProductGrid.tsx`** -- Apply to each product Card component
- **`src/components/DesignerProductCard.tsx`** -- Apply to the Card wrapper
- **`src/components/SimilarProductsGrid.tsx`** -- Apply to each product link card

### 3. CSS Details

```text
Base state:
  - box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 10px 24px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.08)
  - border: 1px solid transparent with gradient background (gold -> rose -> purple)
  - border-radius: 12px
  - transform: translateY(0) perspective(1000px) rotateX(0deg)

Hover state:
  - box-shadow: 0 8px 16px rgba(0,0,0,0.1), 0 20px 40px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.12)
  - transform: translateY(-6px) perspective(1000px) rotateX(1.5deg)
  - border gradient intensifies

Image shimmer:
  - A subtle diagonal gradient overlay (white/transparent) for glass effect
```

### Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Add `.product-tile-3d` utility classes with shadows, gradient border, hover transforms |
| `src/components/PLPProductCard.tsx` | Wrap card in 3D styled container |
| `src/components/ProductCarousel.tsx` | Apply 3D class to product card wrapper |
| `src/components/ProductGrid.tsx` | Apply 3D class to Card component |
| `src/components/DesignerProductCard.tsx` | Apply 3D class to Card component |
| `src/components/SimilarProductsGrid.tsx` | Apply 3D class to product link cards |

