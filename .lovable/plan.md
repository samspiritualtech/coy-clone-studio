

# Make Seller Dashboard Fully Functional

## Overview
Convert the static showcase dashboard into a working system: functional image upload, product save to database, live product listing, and a working discount system with a new `discounts` table.

## Database Changes

### New `discounts` table (migration)
```sql
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  code text NOT NULL,
  type text NOT NULL, -- 'percentage_product', 'fixed_product', 'buy_x_get_y', 'percentage_order', 'fixed_order', 'free_shipping'
  value numeric NOT NULL DEFAULT 0,
  applies_to text DEFAULT 'all', -- 'all', 'specific_products', 'specific_collections'
  min_quantity integer DEFAULT 0,
  min_purchase integer DEFAULT 0,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can manage own discounts" ON public.discounts FOR ALL
  USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view active discounts" ON public.discounts FOR SELECT
  USING (status = 'active' AND (end_date IS NULL OR end_date > now()));
```

## File Changes

### 1. `src/components/seller-dashboard/pages/DashboardAddProduct.tsx` — Full rewrite
- Add `useAuth` to get current user, fetch `seller_id` from `sellers` table
- Add form state for all fields: title, description, price, original_price, category, vendor, tags, sizes, colors
- Integrate `ImageUploadZone` component for drag-drop image upload
- On "Save product":
  1. Upload images to `product-images` storage bucket under `seller_id/` prefix
  2. Get public URLs
  3. Insert into `products` table with `status: 'pending'`, `seller_id`, all form fields
  4. Show success toast, call `onBack()` to return to products list
- Validate required fields (title, price, category, at least 1 image)

### 2. `src/components/seller-dashboard/pages/DashboardProducts.tsx` — Fetch real data
- Replace static `products` array with live database query
- Fetch from `supabase.from('products').select('*').eq('seller_id', sellerId)` 
- Use `useAuth` + seller lookup pattern (same as SellerAddProduct page)
- Show loading state, empty state with CTA
- Display real product images, status, category

### 3. `src/components/seller-dashboard/pages/DashboardDiscounts.tsx` — Full rewrite
- Add state management for creating discounts with a form dialog/view
- Discount creation form with: code, type selector, value, applies_to, min_quantity, min_purchase, dates, usage_limit
- Fetch existing discounts from database for the seller
- Save new discounts to `discounts` table
- Toggle discount status (active/expired)
- Four discount type cards open the creation form pre-configured for that type

### 4. `src/components/seller-dashboard/SellerDashboardShowcase.tsx` — Minor update
- Pass `onProductSaved` callback so products list refreshes after save

### 5. `src/pages/Checkout.tsx` — Discount application
- Add discount code input field
- On apply: query `discounts` table for matching active code
- Calculate discount based on type (percentage/fixed/free-shipping)
- Deduct from total, increment `usage_count`

## Key Implementation Details

- **Auth gate**: The dashboard already lives on `/join`. All DB operations require the user to be authenticated with a seller role. If not authenticated, form shows a "Sign in to manage products" prompt instead of the save button.
- **Image upload**: Reuses existing `ImageUploadZone` component. Upload path: `product-images/{seller_id}/{timestamp}-{filename}`.
- **Product visibility**: Products insert with `status: 'pending'`. They already appear on the storefront once admin approves them to `status: 'live'` (existing RLS policy handles this). The seller sees all their own products regardless of status.
- **No schema changes to `products` table** — all needed columns already exist.

