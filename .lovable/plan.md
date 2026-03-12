

# Fix Product Save Constraint Error

## Root Cause
The `products` table has a check constraint:
```sql
CHECK ((designer_id IS NOT NULL) OR (vendor_id IS NOT NULL))
```
This was created before `seller_id` was added. Seller-uploaded products set `seller_id` but not `designer_id` or `vendor_id`, so the constraint rejects them.

## Fix

### 1. Database Migration — Update the check constraint
Drop the old constraint and replace it with one that also accepts `seller_id`:
```sql
ALTER TABLE public.products DROP CONSTRAINT product_must_have_owner;
ALTER TABLE public.products ADD CONSTRAINT product_must_have_owner
  CHECK (designer_id IS NOT NULL OR vendor_id IS NOT NULL OR seller_id IS NOT NULL);
```

### 2. No code changes needed
The `DashboardAddProduct.tsx` already correctly sets `seller_id: sellerId` in the insert. The DEV_SELLER_ID (`07edb482-...`) exists in the `sellers` table. Once the constraint is updated, saves will work.

