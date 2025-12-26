-- Fix profiles RLS to allow marketplace communication
-- Allow chat participants and rental participants to view each other's profiles

CREATE POLICY "Chat participants can view each other profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  -- Own profile
  auth.uid() = id
  OR
  -- Chat participants can see each other
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE (chats.buyer_id = auth.uid() AND chats.seller_id = profiles.id)
       OR (chats.seller_id = auth.uid() AND chats.buyer_id = profiles.id)
  )
  OR
  -- Rental participants can see each other
  EXISTS (
    SELECT 1 FROM public.rentals
    WHERE (rentals.renter_id = auth.uid() AND rentals.owner_id = profiles.id)
       OR (rentals.owner_id = auth.uid() AND rentals.renter_id = profiles.id)
  )
);

-- Drop the old restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Update storage policy to validate file extensions
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

CREATE POLICY "Authenticated users can upload validated images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'item-images' AND
  -- Validate file extension is an allowed image type
  lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif') AND
  -- Ensure user uploads to their own folder
  (storage.foldername(name))[1] = auth.uid()::text
);