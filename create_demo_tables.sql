-- SQL script to create complete demo tables with all required columns
-- This can be executed directly in the Supabase SQL Editor

-- Create demo_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  date_of_birth DATE,
  gender TEXT,
  height NUMERIC,
  ethnicity TEXT,
  location TEXT,
  nationality TEXT,
  education_level TEXT,
  university TEXT,
  occupation TEXT,
  company TEXT,
  profile_pic_url TEXT,
  marital_status TEXT,
  has_children BOOLEAN DEFAULT false,
  number_of_children INTEGER,
  religion TEXT,
  islamic_sect TEXT,
  other_sect TEXT,
  cover_head BOOLEAN DEFAULT false,
  cover_head_type TEXT,
  monthly_income TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo_match_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_match_preferences (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.demo_profiles(id) ON DELETE CASCADE,
  min_age INTEGER,
  max_age INTEGER,
  preferred_ethnicities TEXT[],
  preferred_locations TEXT[],
  height_range NUMERIC[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo_family_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_family_details (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.demo_profiles(id) ON DELETE CASCADE,
  family_environment TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo_parents table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_parents (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.demo_profiles(id) ON DELETE CASCADE,
  profile_pic_url TEXT,
  education_level TEXT,
  date_of_birth DATE,
  type TEXT,
  profession TEXT,
  city_of_residence TEXT,
  area_of_residence TEXT,
  marital_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo_siblings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_siblings (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.demo_profiles(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT,
  marital_status TEXT,
  profession TEXT,
  education_level TEXT,
  city_of_residence TEXT,
  area_of_residence TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grant access to anon and authenticated roles
ALTER TABLE public.demo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_family_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_siblings ENABLE ROW LEVEL SECURITY;

-- Create policies for demo tables to allow access to anon and authenticated users
CREATE POLICY "Allow full access to demo_profiles" ON public.demo_profiles FOR ALL USING (true);
CREATE POLICY "Allow full access to demo_match_preferences" ON public.demo_match_preferences FOR ALL USING (true);
CREATE POLICY "Allow full access to demo_family_details" ON public.demo_family_details FOR ALL USING (true);
CREATE POLICY "Allow full access to demo_parents" ON public.demo_parents FOR ALL USING (true);
CREATE POLICY "Allow full access to demo_siblings" ON public.demo_siblings FOR ALL USING (true);
