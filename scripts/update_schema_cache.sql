-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add missing columns to personal_details table
ALTER TABLE public.personal_details
ADD COLUMN IF NOT EXISTS body_type TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS citizenship TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS income_range TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT,
ADD COLUMN IF NOT EXISTS has_children BOOLEAN,
ADD COLUMN IF NOT EXISTS wants_children BOOLEAN,
ADD COLUMN IF NOT EXISTS smoking_status TEXT,
ADD COLUMN IF NOT EXISTS drinking_status TEXT;

-- Add missing columns to family_details table
ALTER TABLE public.family_details 
ADD COLUMN IF NOT EXISTS family_values TEXT,
ADD COLUMN IF NOT EXISTS father_name TEXT,
ADD COLUMN IF NOT EXISTS father_occupation TEXT,
ADD COLUMN IF NOT EXISTS father_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS mother_name TEXT,
ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
ADD COLUMN IF NOT EXISTS mother_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS family_religiosity TEXT,
ADD COLUMN IF NOT EXISTS family_description TEXT;

-- Add missing columns to parents table
ALTER TABLE public.parents
ADD COLUMN IF NOT EXISTS father_living BOOLEAN,
ADD COLUMN IF NOT EXISTS mother_living BOOLEAN,
ADD COLUMN IF NOT EXISTS parents_marital_status TEXT,
ADD COLUMN IF NOT EXISTS father_country_of_origin TEXT,
ADD COLUMN IF NOT EXISTS mother_country_of_origin TEXT;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
