-- Influencer videos: admin-only write access
drop policy if exists "Authenticated users can upload influencer videos" on storage.objects;
drop policy if exists "Authenticated users can update influencer videos" on storage.objects;
drop policy if exists "Authenticated users can delete influencer videos" on storage.objects;

create policy "Admins can upload influencer videos"
on storage.objects for insert to authenticated
with check (bucket_id = 'influencer-videos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update influencer videos"
on storage.objects for update to authenticated
using (bucket_id = 'influencer-videos' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'influencer-videos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete influencer videos"
on storage.objects for delete to authenticated
using (bucket_id = 'influencer-videos' and public.has_role(auth.uid(), 'admin'));

-- Try-on images: delete only own images (matched via tryon_history ownership)
drop policy if exists "Users can delete their own try-on images" on storage.objects;

create policy "Users can delete their own try-on images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'tryon-images'
  and exists (
    select 1 from public.tryon_history th
    where th.user_id = auth.uid()
      and (th.model_image_url like '%' || storage.objects.name
        or th.product_image_url like '%' || storage.objects.name
        or th.result_image_url like '%' || storage.objects.name)
  )
);