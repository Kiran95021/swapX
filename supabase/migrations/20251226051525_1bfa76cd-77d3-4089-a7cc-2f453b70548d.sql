-- Server-side validation for campus emails
-- This prevents attackers from bypassing client-side validation

-- Create function to validate campus email format
CREATE OR REPLACE FUNCTION public.validate_campus_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Strict regex: domain must end with .edu, .ac.in, or .ac.uk
  IF NOT (NEW.email ~* '@[a-z0-9.-]+\.(edu|ac\.in|ac\.uk)$') THEN
    RAISE EXCEPTION 'Only campus emails are allowed. Please use your .edu or .ac email.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to validate email on profile insert
CREATE TRIGGER validate_profile_email
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_campus_email();

-- Add database constraint as additional protection
ALTER TABLE public.profiles 
ADD CONSTRAINT campus_email_check 
CHECK (email ~* '@[a-z0-9.-]+\.(edu|ac\.in|ac\.uk)$');