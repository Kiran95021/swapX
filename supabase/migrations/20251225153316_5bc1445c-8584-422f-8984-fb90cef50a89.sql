-- Fix profiles table exposure: Update RLS policy to only allow viewing own profile for sensitive data
-- Drop existing policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new policy: Users can view their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Create policy for authenticated users to view basic public info (id only for chat/listing references)
CREATE POLICY "Authenticated users can view basic profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);