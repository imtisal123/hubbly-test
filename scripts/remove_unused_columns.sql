-- Script to remove database columns that don't have corresponding screen fields
-- Created: 2025-03-02

-- Profiles Table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Personal Details Table
ALTER TABLE public.personal_details
DROP COLUMN IF EXISTS body_type,
DROP COLUMN IF EXISTS hair_color,
DROP COLUMN IF EXISTS eye_color;

-- Family Details Table
ALTER TABLE public.family_details
DROP COLUMN IF EXISTS family_values,
DROP COLUMN IF EXISTS living_with_family,
DROP COLUMN IF EXISTS willing_to_relocate,
DROP COLUMN IF EXISTS parents_born_in,
DROP COLUMN IF EXISTS siblings_count,
DROP COLUMN IF EXISTS father_name,
DROP COLUMN IF EXISTS father_occupation,
DROP COLUMN IF EXISTS father_ethnicity,
DROP COLUMN IF EXISTS mother_name,
DROP COLUMN IF EXISTS mother_occupation,
DROP COLUMN IF EXISTS mother_ethnicity,
DROP COLUMN IF EXISTS family_religiosity,
DROP COLUMN IF EXISTS family_description;

-- Parents Table
ALTER TABLE public.parents
DROP COLUMN IF EXISTS father_living,
DROP COLUMN IF EXISTS mother_living,
DROP COLUMN IF EXISTS parents_marital_status;

-- Also drop from demo tables
-- Demo Profiles Table
ALTER TABLE public.demo_profiles
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Demo Personal Details Table
ALTER TABLE public.demo_personal_details
DROP COLUMN IF EXISTS body_type,
DROP COLUMN IF EXISTS hair_color,
DROP COLUMN IF EXISTS eye_color;

-- Demo Family Details Table
ALTER TABLE public.demo_family_details
DROP COLUMN IF EXISTS family_values,
DROP COLUMN IF EXISTS living_with_family,
DROP COLUMN IF EXISTS willing_to_relocate,
DROP COLUMN IF EXISTS parents_born_in,
DROP COLUMN IF EXISTS siblings_count,
DROP COLUMN IF EXISTS father_name,
DROP COLUMN IF EXISTS father_occupation,
DROP COLUMN IF EXISTS father_ethnicity,
DROP COLUMN IF EXISTS mother_name,
DROP COLUMN IF EXISTS mother_occupation,
DROP COLUMN IF EXISTS mother_ethnicity,
DROP COLUMN IF EXISTS family_religiosity,
DROP COLUMN IF EXISTS family_description;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
