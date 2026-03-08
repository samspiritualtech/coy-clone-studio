

# Fix Seller Application Image Upload

## Problem
The `seller_applications` table INSERT works fine (confirmed by the 201 response in network logs). The failure is in **storage uploads** -- when uploading sample design images to the `product-images` bucket, the RLS policy only allows `authenticated` users, but the application form is used by unauthenticated (anonymous) visitors.

Error: `"new row violates row-level security policy"` on `storage.objects` INSERT.

## Solution

### 1. Database Migration -- Allow anonymous storage uploads for applications
Add a new storage RLS policy that permits anonymous uploads specifically to the `applications/` folder in the `product-images` bucket:

```sql
CREATE POLICY "Anyone can upload application images"
ON storage.objects FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = 'applications'
);
```

This is scoped narrowly -- only the `applications/` prefix is open to anonymous uploads, keeping all other folders restricted to authenticated users.

### 2. No code changes needed
- The `SellerApply.tsx` form already handles validation, image upload, DB insert, success state, and error handling correctly.
- The table schema already stores all the relevant fields (`full_name`, `brand_name`, `email`, `phone`, `city`, `category`, `portfolio_link`, `sample_images`, `status`, `created_at`).
- The INSERT policy on `seller_applications` already allows anonymous inserts and works (confirmed 201 response).

### Files changed
- 1 new database migration (storage RLS policy for anon uploads to `applications/` prefix)

