-- Add collection_name column to designers table
ALTER TABLE public.designers ADD COLUMN IF NOT EXISTS collection_name text;