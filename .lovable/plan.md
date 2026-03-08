

# Build Tagging + Consumer Visibility

Two changes: enhance the seller Add Product form with tagging/image fields, and update the Collections page to also show approved database products.

---

## Part 1: Enhance Seller Add Product Form

**File: `src/pages/seller/SellerAddProduct.tsx`**

Add four new sections to the form:

### 1. Image Upload Section (new Card at top of form)
- Reuse the existing `ImageUploadZone` component for drag-and-drop image upload
- Store selected files in component state
- On submit, upload images to a new `product-images` storage bucket, then save the returned URLs into the `images` JSON column
- Require at least 1 image

### 2. Sizes Picker (new Card)
- Predefined size options: XS, S, M, L, XL, XXL, Free Size
- Render as toggleable chips/checkboxes the seller can click to select multiple
- Save selected sizes as JSON array to the `sizes` column

### 3. Colors Picker (new Card)
- Predefined color options with name + hex (Black, White, Red, Blue, Green, Pink, Yellow, Beige, Brown, Navy, Maroon, Grey)
- Render as clickable color swatches with labels
- Save selected colors as JSON array of `{name, hex}` objects to the `colors` column

### 4. Tags Section (new Card)
- **Occasion Tags**: Wedding, Festive, Party, Casual, Work, Brunch, Date Night, Vacation
- **Style Tags**: Boho, Minimal, Ethnic, Western, Indo-Western, Streetwear, Classic, Contemporary
- Render as toggleable badge chips grouped by type
- Save to `occasion_tags` and `style_tags` JSON columns

### Submit Logic Update
- Upload image files to storage bucket first, collect URLs
- Include `sizes`, `colors`, `occasion_tags`, `style_tags`, and `images` (URLs) in the insert payload

---

## Part 2: Show Approved DB Products on Collections Page

**File: `src/pages/Collections.tsx`**

- Add a `useEffect` + `useState` to fetch products from the database where `status = 'live'` and `is_available = true`
- Map database products to the same shape as static `Product` type (map `title` to `name`, `seller brand_name` to `brand`, `original_price` to `originalPrice`, etc.)
- Merge database products with the static catalog array
- Apply the same category filtering logic to the combined array
- Database products appear alongside static products in the same grid with the same card UI

---

## Part 3: Storage Bucket for Product Images

**Database migration:**
- Create a `product-images` public storage bucket
- Add RLS policy: authenticated users can upload to their own folder (path prefix = seller_id)
- Add RLS policy: anyone can read (public bucket)

---

## Technical Details

| Area | Detail |
|------|--------|
| New storage bucket | `product-images` (public) |
| Files modified | `SellerAddProduct.tsx`, `Collections.tsx` |
| Existing component reused | `ImageUploadZone` |
| DB columns already exist | `sizes`, `colors`, `occasion_tags`, `style_tags`, `images` -- no schema migration needed for columns |
| New dependency | None |

