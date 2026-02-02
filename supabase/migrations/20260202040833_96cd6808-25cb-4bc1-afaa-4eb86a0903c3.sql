-- Add is_onboarded column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_onboarded boolean DEFAULT false;

-- Update the handle_new_user function to include is_onboarded and handle upserts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email, avatar_url, is_onboarded)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      'User'
    ),
    NEW.phone,
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$function$;