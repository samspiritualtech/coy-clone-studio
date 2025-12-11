-- Create a public storage bucket for influencer videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'influencer-videos',
  'influencer-videos',
  true,
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
);

-- Allow public read access to all videos
CREATE POLICY "Public can view influencer videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'influencer-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload influencer videos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'influencer-videos' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update influencer videos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'influencer-videos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete influencer videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'influencer-videos' AND auth.role() = 'authenticated');