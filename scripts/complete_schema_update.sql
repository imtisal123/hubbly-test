-- This SQL script combines all necessary schema updates for the Hubbly app database

-- Create religious_details table
CREATE TABLE IF NOT EXISTS public.religious_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  religiosity INTEGER,
  prayer_frequency TEXT,
  quran_reading_frequency TEXT,
  islamic_education TEXT,
  islamic_education_details TEXT,
  hijab_preference TEXT,
  beard_preference TEXT,
  halal_strict BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on religious_details
ALTER TABLE public.religious_details ENABLE ROW LEVEL SECURITY;

-- Create policies for religious_details
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'religious_details' 
        AND policyname = 'Users can view their own religious details'
    ) THEN
        CREATE POLICY "Users can view their own religious details"
        ON public.religious_details
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'religious_details' 
        AND policyname = 'Users can insert their own religious details'
    ) THEN
        CREATE POLICY "Users can insert their own religious details"
        ON public.religious_details
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'religious_details' 
        AND policyname = 'Users can update their own religious details'
    ) THEN
        CREATE POLICY "Users can update their own religious details"
        ON public.religious_details
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create personal_details table
CREATE TABLE IF NOT EXISTS public.personal_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  height TEXT,
  body_type TEXT,
  hair_color TEXT,
  eye_color TEXT,
  smoking TEXT,
  drinking TEXT,
  diet_preference TEXT,
  exercise_frequency TEXT,
  interests TEXT[],
  hobbies TEXT[],
  languages TEXT[],
  about_me TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on personal_details
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;

-- Create policies for personal_details
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'personal_details' 
        AND policyname = 'Users can view their own personal details'
    ) THEN
        CREATE POLICY "Users can view their own personal details"
        ON public.personal_details
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'personal_details' 
        AND policyname = 'Users can insert their own personal details'
    ) THEN
        CREATE POLICY "Users can insert their own personal details"
        ON public.personal_details
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'personal_details' 
        AND policyname = 'Users can update their own personal details'
    ) THEN
        CREATE POLICY "Users can update their own personal details"
        ON public.personal_details
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create match_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.match_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  min_age INTEGER,
  max_age INTEGER,
  preferred_ethnicities TEXT[],
  preferred_locations TEXT[],
  height_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on match_preferences
ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for match_preferences
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'match_preferences' 
        AND policyname = 'Users can view their own match preferences'
    ) THEN
        CREATE POLICY "Users can view their own match preferences"
        ON public.match_preferences
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'match_preferences' 
        AND policyname = 'Users can insert their own match preferences'
    ) THEN
        CREATE POLICY "Users can insert their own match preferences"
        ON public.match_preferences
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'match_preferences' 
        AND policyname = 'Users can update their own match preferences'
    ) THEN
        CREATE POLICY "Users can update their own match preferences"
        ON public.match_preferences
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create family_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.family_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_values TEXT,
  family_type TEXT,
  living_with_family BOOLEAN,
  willing_to_relocate BOOLEAN,
  parents_born_in TEXT,
  siblings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on family_details
ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;

-- Create policies for family_details
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'family_details' 
        AND policyname = 'Users can view their own family details'
    ) THEN
        CREATE POLICY "Users can view their own family details"
        ON public.family_details
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'family_details' 
        AND policyname = 'Users can insert their own family details'
    ) THEN
        CREATE POLICY "Users can insert their own family details"
        ON public.family_details
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'family_details' 
        AND policyname = 'Users can update their own family details'
    ) THEN
        CREATE POLICY "Users can update their own family details"
        ON public.family_details
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
    END IF;
END $$;

-- Create demo tables for unauthenticated users

-- Create demo_religious_details table
CREATE TABLE IF NOT EXISTS public.demo_religious_details (
  id UUID PRIMARY KEY,
  religiosity INTEGER,
  prayer_frequency TEXT,
  quran_reading_frequency TEXT,
  islamic_education TEXT,
  islamic_education_details TEXT,
  hijab_preference TEXT,
  beard_preference TEXT,
  halal_strict BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Create demo_personal_details table
CREATE TABLE IF NOT EXISTS public.demo_personal_details (
  id UUID PRIMARY KEY,
  height TEXT,
  body_type TEXT,
  hair_color TEXT,
  eye_color TEXT,
  smoking TEXT,
  drinking TEXT,
  diet_preference TEXT,
  exercise_frequency TEXT,
  interests TEXT[],
  hobbies TEXT[],
  languages TEXT[],
  about_me TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Create demo_match_preferences table
CREATE TABLE IF NOT EXISTS public.demo_match_preferences (
  id UUID PRIMARY KEY,
  min_age INTEGER,
  max_age INTEGER,
  preferred_ethnicities TEXT[],
  preferred_locations TEXT[],
  height_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Create demo_family_details table
CREATE TABLE IF NOT EXISTS public.demo_family_details (
  id UUID PRIMARY KEY,
  family_values TEXT,
  family_type TEXT,
  living_with_family BOOLEAN,
  willing_to_relocate BOOLEAN,
  parents_born_in TEXT,
  siblings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);

-- Add is_demo column to match_preferences if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'match_preferences' 
        AND column_name = 'is_demo'
    ) THEN
        ALTER TABLE public.match_preferences ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add is_demo column to family_details if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'family_details' 
        AND column_name = 'is_demo'
    ) THEN
        ALTER TABLE public.family_details ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
