-- Rollback for seed batch: ogura-catalog-seed-v1 (40 brands, 311 products, 437 images)
-- Run in this order. Storage objects and auth users are removed at the end.

-- 1. Variants of seeded products
DELETE FROM public.product_variants
WHERE product_id IN (
  SELECT p.id FROM public.products p
  JOIN public.sellers s ON s.id = p.seller_id
  JOIN auth.users u ON u.id = s.user_id
  WHERE u.email LIKE 'seed-%@ogura.in'
);

-- 2. Seeded products
DELETE FROM public.products
WHERE seller_id IN (
  SELECT s.id FROM public.sellers s
  JOIN auth.users u ON u.id = s.user_id
  WHERE u.email LIKE 'seed-%@ogura.in'
);

-- 3. Seeded images in storage
DELETE FROM storage.objects
WHERE bucket_id = 'product-images'
  AND name LIKE 'seed/ogura-catalog-seed-v1/%';

-- 4. Seeded seller stores
DELETE FROM public.sellers
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'seed-%@ogura.in');

-- 5. Roles, profiles and auth users for seeded brand logins
DELETE FROM public.user_roles
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'seed-%@ogura.in');

DELETE FROM public.profiles
WHERE id IN (SELECT id FROM auth.users WHERE email LIKE 'seed-%@ogura.in');

DELETE FROM auth.users WHERE email LIKE 'seed-%@ogura.in';

-- 6. Optional: import audit trail
-- DELETE FROM public.seed_import_runs WHERE seed_batch_key = 'ogura-catalog-seed-v1';
