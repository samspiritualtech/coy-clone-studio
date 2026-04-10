
-- Allow anonymous uploads to tryon-images bucket
CREATE POLICY "Anyone can upload tryon images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'tryon-images');

-- Allow anonymous reads from tryon-images bucket
CREATE POLICY "Anyone can read tryon images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'tryon-images');
