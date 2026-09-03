-- Revert the Brand1 / Shop All freeze test (2026-09-03)
-- Run as a single migration to restore the storefront to its pre-test state.

-- 1) Remove the 100 test SKUs
DELETE FROM public.products WHERE brand = 'Brand1' AND title LIKE 'Brand1_cloth%';

-- 2) Remove the test seller
DELETE FROM public.sellers WHERE brand_name = 'Brand1';

-- 3) Restore the archived status / availability of every real product
UPDATE public.products p
SET status = a.status, is_available = a.is_available, updated_at = now()
FROM public.products_archive_test a
WHERE a.id = p.id;

-- 4) Clean up test-only objects
DROP TABLE IF EXISTS public.products_archive_test;
ALTER TABLE public.products DROP COLUMN IF EXISTS brand;

-- 5) Code side: set SHOP_ALL_FROZEN = false in src/data/products.ts
--    and FREEZE_EXTERNAL_API = false in src/pages/Collections.tsx
