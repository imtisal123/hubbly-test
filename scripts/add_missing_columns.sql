-- Add missing columns to siblings table
ALTER TABLE public.siblings 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT;

-- Add missing columns to parents table
ALTER TABLE public.parents
ADD COLUMN IF NOT EXISTS father_country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS mother_country_of_origin TEXT;

-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add missing columns to family_details table
ALTER TABLE public.family_details 
ADD COLUMN IF NOT EXISTS father_name TEXT,
ADD COLUMN IF NOT EXISTS father_occupation TEXT,
ADD COLUMN IF NOT EXISTS father_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS mother_name TEXT,
ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
ADD COLUMN IF NOT EXISTS mother_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS family_religiosity TEXT,
ADD COLUMN IF NOT EXISTS family_description TEXT;

-- Update religious_details table to fix column type
ALTER TABLE public.religious_details 
ALTER COLUMN religiosity TYPE TEXT USING religiosity::TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
