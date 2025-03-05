-- Add missing columns to personal_details table
ALTER TABLE public.personal_details
ADD COLUMN IF NOT EXISTS height TEXT;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
