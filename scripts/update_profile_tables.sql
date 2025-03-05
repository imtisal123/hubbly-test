-- SQL script to update profile-related tables
-- Adds is_demo column to existing tables and creates missing tables

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

-- Create religious_details table if it doesn't exist
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

-- Create personal_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.personal_details (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create RLS policies for religious_details
ALTER TABLE public.religious_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own religious details"
ON public.religious_details
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own religious details"
ON public.religious_details
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own religious details"
ON public.religious_details
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create RLS policies for personal_details
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own personal details"
ON public.personal_details
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own personal details"
ON public.personal_details
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own personal details"
ON public.personal_details
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create demo tables for the new tables
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

CREATE TABLE IF NOT EXISTS public.demo_personal_details (
    id UUID PRIMARY KEY,
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
