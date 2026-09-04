REVOKE SELECT ON public.sellers FROM anon, authenticated;

GRANT SELECT (
  id, user_id, brand_name, city, instagram_handle, profile_image, banner_image,
  description, is_verified, is_active, application_status, seller_type,
  created_at, updated_at
) ON public.sellers TO anon, authenticated;

GRANT UPDATE ON public.sellers TO authenticated;
GRANT INSERT ON public.sellers TO authenticated;
GRANT ALL ON public.sellers TO service_role;

CREATE OR REPLACE FUNCTION public.get_own_seller_bank_details()
RETURNS TABLE (
  id uuid,
  gstin text,
  pan_number text,
  bank_account_number text,
  bank_ifsc text,
  bank_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.gstin, s.pan_number, s.bank_account_number, s.bank_ifsc, s.bank_name
  FROM public.sellers s
  WHERE s.user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.get_own_seller_bank_details() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_own_seller_bank_details() TO authenticated;