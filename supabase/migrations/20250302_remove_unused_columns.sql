-- Migration: Remove unused columns from database tables
-- Description: This migration removes columns that don't have corresponding screen fields
-- Date: 2025-03-02

-- Profiles Table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Match Preferences Table
ALTER TABLE public.match_preferences
DROP COLUMN IF EXISTS min_age,
DROP COLUMN IF EXISTS max_age;

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
DROP COLUMN IF EXISTS parents_marital_status,
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS nationality,
DROP COLUMN IF EXISTS religion,
DROP COLUMN IF EXISTS ethnicity,
DROP COLUMN IF EXISTS occupation;

-- Siblings Table
ALTER TABLE public.siblings
DROP COLUMN IF EXISTS name;

-- Also drop from demo tables
-- Demo Profiles Table
ALTER TABLE public.demo_profiles
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Demo Match Preferences Table
ALTER TABLE public.demo_match_preferences
DROP COLUMN IF EXISTS min_age,
DROP COLUMN IF EXISTS max_age;

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

-- Demo Parents Table
ALTER TABLE public.demo_parents
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS nationality,
DROP COLUMN IF EXISTS religion,
DROP COLUMN IF EXISTS ethnicity,
DROP COLUMN IF EXISTS occupation;

-- Demo Siblings Table
ALTER TABLE public.demo_siblings
DROP COLUMN IF EXISTS name;

-- Drop unused tables entirely
-- These tables don't correspond to any screens in the app
DROP TABLE IF EXISTS public.personal_details CASCADE;
DROP TABLE IF EXISTS public.demo_personal_details CASCADE;
DROP TABLE IF EXISTS public.religious_details CASCADE;
DROP TABLE IF EXISTS public.demo_religious_details CASCADE;

-- Add missing columns that correspond to screen fields
-- Add profession column to parents table
ALTER TABLE public.parents
ADD COLUMN IF NOT EXISTS profession TEXT;

-- Add profession column to demo_parents table
ALTER TABLE public.demo_parents
ADD COLUMN IF NOT EXISTS profession TEXT;

-- Add city_of_residence and area_of_residence columns to parents table
ALTER TABLE public.parents
ADD COLUMN IF NOT EXISTS city_of_residence TEXT,
ADD COLUMN IF NOT EXISTS area_of_residence TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT;

-- Add city_of_residence and area_of_residence columns to demo_parents table
ALTER TABLE public.demo_parents
ADD COLUMN IF NOT EXISTS city_of_residence TEXT,
ADD COLUMN IF NOT EXISTS area_of_residence TEXT,
ADD COLUMN IF NOT EXISTS marital_status TEXT;

-- Add profession column to siblings table
ALTER TABLE public.siblings
ADD COLUMN IF NOT EXISTS profession TEXT;

-- Add profession column to demo_siblings table
ALTER TABLE public.demo_siblings
ADD COLUMN IF NOT EXISTS profession TEXT;

-- Add city_of_residence and area_of_residence columns to siblings table
ALTER TABLE public.siblings
ADD COLUMN IF NOT EXISTS city_of_residence TEXT,
ADD COLUMN IF NOT EXISTS area_of_residence TEXT;

-- Add city_of_residence and area_of_residence columns to demo_siblings table
ALTER TABLE public.demo_siblings
ADD COLUMN IF NOT EXISTS city_of_residence TEXT,
ADD COLUMN IF NOT EXISTS area_of_residence TEXT;

-- Rename occupation column to profession if it exists
-- For siblings table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'siblings'
    AND column_name = 'occupation'
  ) THEN
    -- Check if profession column also exists
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'siblings'
      AND column_name = 'profession'
    ) THEN
      -- Copy data from occupation to profession
      UPDATE public.siblings SET profession = occupation WHERE profession IS NULL;
      -- Drop occupation column
      ALTER TABLE public.siblings DROP COLUMN occupation;
    ELSE
      -- Rename occupation to profession if profession doesn't exist
      ALTER TABLE public.siblings RENAME COLUMN occupation TO profession;
    END IF;
  END IF;
END $$;

-- For demo_siblings table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'demo_siblings'
    AND column_name = 'occupation'
  ) THEN
    -- Check if profession column also exists
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'demo_siblings'
      AND column_name = 'profession'
    ) THEN
      -- Copy data from occupation to profession
      UPDATE public.demo_siblings SET profession = occupation WHERE profession IS NULL;
      -- Drop occupation column
      ALTER TABLE public.demo_siblings DROP COLUMN occupation;
    ELSE
      -- Rename occupation to profession if profession doesn't exist
      ALTER TABLE public.demo_siblings RENAME COLUMN occupation TO profession;
    END IF;
  END IF;
END $$;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
