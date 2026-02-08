
# Plan: Integrate Bags into the Product System

## Overview
This plan adds a new "bags" product category and creates static bag products using the uploaded images, ensuring they appear in the Bags & Accessories category, all products listings, and are searchable via Algolia.

---

## Current Architecture Analysis

The platform uses a **hybrid data system**:
- **Static catalog** (`src/data/products.ts`): 691 products across 6 categories
- **Database products**: Designer-specific items in the Supabase `products` table
- **Algolia search**: Synced from both sources via the `sync-algolia` edge function

**Problem Identified:**
- The Product type only allows: `'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories'`
- The "Bags & Accessories" category config references `["accessories", "bags"]` but "bags" doesn't exist
- Bag items currently exist under "accessories" (Tote Bag, Crossbody Bag, etc.) but aren't separated

---

## Implementation Steps

### Step 1: Extend the Product Type
**File:** `src/types/index.ts`

Add "bags" to the allowed category union type:
```typescript
category: 'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories' | 'bags';
```

### Step 2: Copy Uploaded Bag Images to Project
**Copy user-uploaded images to** `public/bags/`:
- `imgi_5_default.webp` - Woven hobo bag (burgundy)
- `imgi_8_default.webp` - Buckle shoulder bag (burgundy)
- `imgi_26_default.webp` - Woven tote (cream)
- `imgi_109_w_120.webp` - Classic crossbody (black)
- `imgi_114_w_120_1.webp` - Vanity bag (black)
- `imgi_116_w_120.webp` - Fringe hobo (brown)
- `imgi_126_w_120.webp` - Moon hobo (blue)
- `imgi_130_w_1201.webp` - Striped tote

### Step 3: Create Bags Generator Function
**File:** `src/data/products.ts`

Add a new `generateBags()` function that:
- Creates ~40 bag products using the uploaded images
- Sets `category: "bags"`
- Uses premium pricing (Rs 2,999 - Rs 15,999)
- Includes proper bag-specific metadata (materials, occasions)

```text
Types to include:
- Woven Hobo Bag
- Buckle Shoulder Bag
- Woven Tote Bag
- Classic Crossbody Bag
- Vanity Top Handle Bag
- Fringe Hobo Bag
- Moon Crescent Bag
- Striped Canvas Tote
```

Update the products export to include bags:
```typescript
export const products: Product[] = [
  ...generateDresses(),
  ...generateTops(),
  ...generateBottoms(),
  ...generateOuterwear(),
  ...generateFootwear(),
  ...generateAccessories(),
  ...generateBags(),  // Add this
];
```

### Step 4: Add Bag Images to Unsplash Collection
**File:** `src/data/products.ts`

Add `bags` to the `unsplashImages` object to support color variant generation:
```typescript
bags: [
  // References to the new public/bags/ images
]
```

### Step 5: Update Algolia Sync Function
**File:** `supabase/functions/sync-algolia/index.ts`

Add bags generation logic matching the frontend:
- Add `bags` to `unsplashImages`
- Create bag types array
- Add bag generation loop (similar to accessories)
- Ensure `category: "bags"` for search filtering

### Step 6: Update Category Showcase (Optional Enhancement)
**File:** `src/components/CategoryShowcase.tsx`

Add a dedicated "Bags" section for prominent homepage visibility:
```typescript
{
  id: "bags",
  label: "Carry in Style",
  title: "Bags",
  subtitle: "Luxury handbags & designer pieces",
  ctaText: "Shop Bags",
  ctaLink: "/category/bags-accessories",
  backgroundImage: "/bags/imgi_87_screenshot.jpg",
  height: "50vh",
}
```

---

## Search Integration

Bags will automatically appear in Algolia search when:
1. The `sync-algolia` function is updated with bag products
2. The function is re-deployed and triggered

**Searchable keywords:**
- "bag", "bags"
- "handbag", "handbags"
- "tote", "crossbody", "hobo", "clutch"
- "accessories"

---

## Category Page Visibility

The "Bags & Accessories" page (`/category/bags-accessories`) already has:
```typescript
productCategories: ["accessories", "bags"]
```

Once "bags" category exists, products will automatically appear via `CategoryProductGrid`.

---

## Collections Page Visibility

The Collections page (`/collections`) displays all products from the static catalog. Since bags will be added to the main `products` array, they'll automatically appear with:
- Product image
- Name and brand
- Price display
- Wishlist functionality

---

## Technical Details

| Component | Change Required |
|-----------|-----------------|
| `src/types/index.ts` | Add 'bags' to category union |
| `public/bags/` | New folder with 8+ images |
| `src/data/products.ts` | Add `generateBags()`, update export |
| `supabase/functions/sync-algolia/index.ts` | Add bag generation for search |
| Deploy edge function | Re-deploy after changes |

---

## Files to Create/Modify

1. **Copy** 8 user-uploaded images to `public/bags/`
2. **Modify** `src/types/index.ts` - extend category type
3. **Modify** `src/data/products.ts` - add bag generation
4. **Modify** `supabase/functions/sync-algolia/index.ts` - add bags to Algolia
5. **Deploy** `sync-algolia` edge function

---

## Expected Outcome

After implementation:
- 40+ new bag products in the catalog
- Visible on `/category/bags-accessories`
- Visible on `/collections` (All Products)
- Searchable via "bag", "bags", "handbag", "tote", etc.
- Premium fashion UI with proper image quality
- No duplication or hidden products
