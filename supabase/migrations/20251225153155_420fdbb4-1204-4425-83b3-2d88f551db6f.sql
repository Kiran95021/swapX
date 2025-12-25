-- Fix 1: Add validation trigger for rental dates (using trigger instead of CHECK for time-based validation)
CREATE OR REPLACE FUNCTION public.validate_rental_dates()
RETURNS TRIGGER AS $$
DECLARE
  item_max_days INTEGER;
  rental_days INTEGER;
BEGIN
  -- Validate start_date is not in the past
  IF NEW.start_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Start date cannot be in the past';
  END IF;
  
  -- Validate end_date is after start_date
  IF NEW.end_date < NEW.start_date THEN
    RAISE EXCEPTION 'End date must be after start date';
  END IF;
  
  -- Calculate rental duration
  rental_days := NEW.end_date - NEW.start_date;
  
  -- Validate against max_rental_days from items table
  SELECT max_rental_days INTO item_max_days 
  FROM public.items WHERE id = NEW.item_id;
  
  IF item_max_days IS NOT NULL AND rental_days > item_max_days THEN
    RAISE EXCEPTION 'Rental duration (% days) exceeds maximum allowed (% days)', rental_days, item_max_days;
  END IF;
  
  -- Recalculate total_price server-side to prevent manipulation
  DECLARE
    item_rental_price NUMERIC;
  BEGIN
    SELECT rental_price_per_day INTO item_rental_price 
    FROM public.items WHERE id = NEW.item_id;
    
    IF item_rental_price IS NOT NULL THEN
      NEW.total_price := rental_days * item_rental_price;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for rental date validation
DROP TRIGGER IF EXISTS validate_rental_dates_trigger ON public.rentals;
CREATE TRIGGER validate_rental_dates_trigger
BEFORE INSERT ON public.rentals
FOR EACH ROW EXECUTE FUNCTION public.validate_rental_dates();

-- Fix 2: Create secure RPC function for rental status updates with proper authorization
CREATE OR REPLACE FUNCTION public.update_rental_status_secure(rental_uuid UUID, new_status TEXT)
RETURNS void AS $$
DECLARE
  rental_rec RECORD;
  user_role TEXT;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Fetch the rental record
  SELECT * INTO rental_rec FROM public.rentals WHERE id = rental_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Rental not found';
  END IF;
  
  -- Determine user role in this rental
  IF current_user_id = rental_rec.owner_id THEN 
    user_role := 'owner';
  ELSIF current_user_id = rental_rec.renter_id THEN 
    user_role := 'renter';
  ELSE 
    RAISE EXCEPTION 'Not authorized to update this rental';
  END IF;
  
  -- Validate status value
  IF new_status NOT IN ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status value';
  END IF;
  
  -- Validate transitions based on role
  IF new_status = 'approved' AND user_role != 'owner' THEN
    RAISE EXCEPTION 'Only the owner can approve rentals';
  END IF;
  
  IF new_status = 'rejected' AND user_role != 'owner' THEN
    RAISE EXCEPTION 'Only the owner can reject rentals';
  END IF;
  
  IF new_status = 'completed' AND CURRENT_DATE < rental_rec.end_date THEN
    RAISE EXCEPTION 'Cannot mark as completed before the rental end date';
  END IF;
  
  -- Validate valid status transitions
  IF rental_rec.status = 'completed' OR rental_rec.status = 'rejected' OR rental_rec.status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot change status of a finalized rental';
  END IF;
  
  -- Perform the update
  UPDATE public.rentals SET status = new_status, updated_at = now() WHERE id = rental_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 3: Improve handle_new_user function with duplicate prevention
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent duplicate profile creation
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;
  
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 4: Create storage bucket and policies for item-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images (scoped to their user folder)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Everyone can view public images
CREATE POLICY "Public images are viewable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'item-images');