

# Plan: Fix Collections Page Category Filtering

## Current State Analysis

After thorough investigation, I've verified that:

**What's Working Correctly:**
- Product click routing uses product IDs exclusively (`/product/${product.id}`)
- All product cards correctly navigate to their respective product detail pages
- Bags (IDs: `bags-1` to `bags-45`) correctly route to bag product pages
- Accessories (IDs: `acce-1` to `acce-110`) correctly route to accessory pages
- No category-based redirects or fallbacks exist in the codebase

**Root Issue Identified:**
The Collections page at `/collections?category=accessories&subcategory=bags-backpacks` **ignores the URL query parameters**. The page shows ALL 700+ products regardless of the `category` and `subcategory` params in the URL.

This causes confusion because users navigating from category menus see URLs with filters but get unfiltered results.

---

## Implementation Steps

### Step 1: Add Query Parameter Filtering to Collections Page
**File:** `src/pages/Collections.tsx`

Add support for URL-based filtering:
- Parse `category` and `subcategory` query parameters using `useSearchParams`
- Filter the products array based on these parameters
- Show filtered count in the header

```text
Key Changes:
1. Import useSearchParams from react-router-dom
2. Parse category and subcategory params
3. Filter products based on params
4. Update page title to reflect filter
5. Add breadcrumb showing current filter
```

### Step 2: Add Category Filter UI
**File:** `src/pages/Collections.tsx`

Provide visual filter pills/chips for quick category switching:
- Display active filter chips at the top
- Allow clearing filters with "X" button
- Link filter options to update URL params

### Step 3: Ensure Consistent Product Filtering
**File:** `src/pages/Collections.tsx`

Map URL parameters to actual product categories:
- `category=accessories` → filters for `accessories` and `bags` categories
- `subcategory=bags-backpacks` → filters specifically for `bags` category

---

## Technical Implementation Details

### Collections Page Updates

```typescript
// Add at the top of the component
const [searchParams] = useSearchParams();
const categoryParam = searchParams.get("category");
const subcategoryParam = searchParams.get("subcategory");

// Filter products based on URL params
const filteredProducts = useMemo(() => {
  if (!categoryParam && !subcategoryParam) {
    return products; // Show all if no filters
  }
  
  return products.filter((product) => {
    // Map URL params to product categories
    if (subcategoryParam === "bags-backpacks") {
      return product.category === "bags";
    }
    if (categoryParam === "accessories") {
      return ["accessories", "bags"].includes(product.category);
    }
    return product.category === categoryParam;
  });
}, [categoryParam, subcategoryParam]);
```

### Category Mapping Table

| URL Parameter | Product Categories Shown |
|---------------|-------------------------|
| `category=accessories` | accessories, bags |
| `subcategory=bags-backpacks` | bags only |
| `category=dresses` | dresses |
| `category=tops` | tops |
| (none) | all products |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Collections.tsx` | Add query param parsing, filtering logic, filter UI |

---

## Expected Outcome

After implementation:
- `/collections` → Shows all 700+ products
- `/collections?category=accessories` → Shows 155 products (110 accessories + 45 bags)
- `/collections?category=accessories&subcategory=bags-backpacks` → Shows 45 bag products only
- Clicking any product correctly routes to its product detail page
- Filter chips show active filters with clear option

---

## Verification Steps

1. Navigate to `/collections?category=accessories&subcategory=bags-backpacks`
2. Verify only bag products are displayed
3. Click a bag product
4. Confirm URL is `/product/bags-{id}` and correct bag is shown
5. Test with other category combinations

