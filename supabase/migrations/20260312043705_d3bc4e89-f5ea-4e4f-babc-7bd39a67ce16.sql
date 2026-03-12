ALTER TABLE public.products DROP CONSTRAINT product_must_have_owner;
ALTER TABLE public.products ADD CONSTRAINT product_must_have_owner
  CHECK (designer_id IS NOT NULL OR vendor_id IS NOT NULL OR seller_id IS NOT NULL);