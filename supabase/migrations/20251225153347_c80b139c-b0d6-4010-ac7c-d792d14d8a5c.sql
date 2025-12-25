-- Remove the overly permissive policy for profiles
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;

-- Keep only the policy that allows users to view their own profile
-- The existing "Users can view own profile" policy with USING (auth.uid() = id) should remain