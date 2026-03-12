

# Fix Product Save Error — Invalid Status Value

## Root Cause
The database has a CHECK constraint `products_status_check` that only allows these values:
`draft`, `submitted`, `under_review`, `live`, `rejected`, `disabled`

Both add-product files use `status: "pending"` — which is **not** in the allowed list, causing the insert to fail.

## Fix
Change `status: "pending"` to `status: "submitted"` in both files. This is the correct lifecycle value for a newly submitted product.

### Files to modify

1. **`src/components/seller-dashboard/pages/DashboardAddProduct.tsx`** (line 114)
   - Change `status: "pending"` → `status: "submitted"`

2. **`src/pages/seller/SellerAddProduct.tsx`** (line 170)
   - Change `status: "pending"` → `status: "submitted"`

No database migration needed — the constraint is correct; only the code was using the wrong value.

