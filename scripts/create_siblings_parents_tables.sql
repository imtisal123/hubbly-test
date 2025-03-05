-- Create siblings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.siblings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  gender TEXT,
  marital_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on siblings
ALTER TABLE public.siblings ENABLE ROW LEVEL SECURITY;

-- Create policies for siblings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'siblings' 
        AND policyname = 'Users can view their own siblings'
    ) THEN
        CREATE POLICY "Users can view their own siblings"
        ON public.siblings
        FOR SELECT
        USING (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'siblings' 
        AND policyname = 'Users can insert their own siblings'
    ) THEN
        CREATE POLICY "Users can insert their own siblings"
        ON public.siblings
        FOR INSERT
        WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'siblings' 
        AND policyname = 'Users can update their own siblings'
    ) THEN
        CREATE POLICY "Users can update their own siblings"
        ON public.siblings
        FOR UPDATE
        USING (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create parents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  father_living BOOLEAN,
  mother_living BOOLEAN,
  parents_marital_status TEXT,
  father_country_of_origin TEXT,
  mother_country_of_origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on parents
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

-- Create policies for parents
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'parents' 
        AND policyname = 'Users can view their own parents'
    ) THEN
        CREATE POLICY "Users can view their own parents"
        ON public.parents
        FOR SELECT
        USING (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'parents' 
        AND policyname = 'Users can insert their own parents'
    ) THEN
        CREATE POLICY "Users can insert their own parents"
        ON public.parents
        FOR INSERT
        WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'parents' 
        AND policyname = 'Users can update their own parents'
    ) THEN
        CREATE POLICY "Users can update their own parents"
        ON public.parents
        FOR UPDATE
        USING (auth.uid() = user_id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create demo_siblings table
CREATE TABLE IF NOT EXISTS public.demo_siblings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT,
  age INTEGER,
  gender TEXT,
  marital_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Enable RLS on demo_siblings
ALTER TABLE public.demo_siblings ENABLE ROW LEVEL SECURITY;

-- Create policies for demo_siblings
CREATE POLICY "Anyone can view demo siblings"
ON public.demo_siblings
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert demo siblings"
ON public.demo_siblings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update demo siblings"
ON public.demo_siblings
FOR UPDATE
USING (true);

-- Create demo_parents table
CREATE TABLE IF NOT EXISTS public.demo_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  father_living BOOLEAN,
  mother_living BOOLEAN,
  parents_marital_status TEXT,
  father_country_of_origin TEXT,
  mother_country_of_origin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Enable RLS on demo_parents
ALTER TABLE public.demo_parents ENABLE ROW LEVEL SECURITY;

-- Create policies for demo_parents
CREATE POLICY "Anyone can view demo parents"
ON public.demo_parents
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert demo parents"
ON public.demo_parents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update demo parents"
ON public.demo_parents
FOR UPDATE
USING (true);

-- Update family_details table to add missing columns
ALTER TABLE public.family_details 
ADD COLUMN IF NOT EXISTS father_name TEXT,
ADD COLUMN IF NOT EXISTS father_occupation TEXT,
ADD COLUMN IF NOT EXISTS father_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS mother_name TEXT,
ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
ADD COLUMN IF NOT EXISTS mother_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS family_religiosity TEXT,
ADD COLUMN IF NOT EXISTS family_description TEXT;

-- Update demo_family_details table to add missing columns
ALTER TABLE public.demo_family_details 
ADD COLUMN IF NOT EXISTS father_name TEXT,
ADD COLUMN IF NOT EXISTS father_occupation TEXT,
ADD COLUMN IF NOT EXISTS father_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS mother_name TEXT,
ADD COLUMN IF NOT EXISTS mother_occupation TEXT,
ADD COLUMN IF NOT EXISTS mother_ethnicity TEXT,
ADD COLUMN IF NOT EXISTS family_religiosity TEXT,
ADD COLUMN IF NOT EXISTS family_description TEXT;

-- Update profiles table to add missing columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update demo_profiles table to add missing columns
ALTER TABLE public.demo_profiles
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update personal_details table to add missing columns
ALTER TABLE public.personal_details
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

-- Update demo_personal_details table to add missing columns
ALTER TABLE public.demo_personal_details
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

-- Update religious_details table to fix column type
ALTER TABLE public.religious_details 
ALTER COLUMN religiosity TYPE TEXT USING religiosity::TEXT;

-- Update demo_religious_details table to fix column type
ALTER TABLE public.demo_religious_details 
ALTER COLUMN religiosity TYPE TEXT USING religiosity::TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
