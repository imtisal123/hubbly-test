-- Complete database schema for Hubbly app
-- Run this in the Supabase SQL editor to ensure all tables and columns exist

-- First, create the exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as the function owner
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create helper function to check if a column exists
CREATE OR REPLACE FUNCTION public.column_exists(
  table_name text,
  column_name text
) RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT count(*) > 0 INTO exists
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = $1
    AND column_name = $2;
  RETURN exists;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
) RETURNS boolean AS $$
BEGIN
  IF NOT public.column_exists(table_name, column_name) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  table_name, column_name, column_type);
    RETURN true;
  END IF;
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
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
      number_of_children INTEGER DEFAULT 0,
      religion TEXT,
      islamic_sect TEXT,
      other_sect TEXT,
      cover_head TEXT,
      cover_head_type TEXT,
      monthly_income TEXT,
      is_demo BOOLEAN DEFAULT false
    );
  ELSE
    -- Add any missing columns to profiles table
    PERFORM public.add_column_if_not_exists('profiles', 'marital_status', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'has_children', 'BOOLEAN DEFAULT false');
    PERFORM public.add_column_if_not_exists('profiles', 'number_of_children', 'INTEGER DEFAULT 0');
    PERFORM public.add_column_if_not_exists('profiles', 'religion', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'islamic_sect', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'other_sect', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'cover_head', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'cover_head_type', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'monthly_income', 'TEXT');
    PERFORM public.add_column_if_not_exists('profiles', 'is_demo', 'BOOLEAN DEFAULT false');
  END IF;
END $$;

-- Create match_preferences table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'match_preferences') THEN
    CREATE TABLE public.match_preferences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      min_age INTEGER,
      max_age INTEGER,
      preferred_ethnicities TEXT[],
      preferred_locations TEXT[],
      preferred_education_levels TEXT[],
      height_range TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Add any missing columns to match_preferences table
    PERFORM public.add_column_if_not_exists('match_preferences', 'height_range', 'TEXT');
  END IF;
END $$;

-- Create parents table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'parents') THEN
    CREATE TABLE public.parents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      type TEXT, -- 'father' or 'mother'
      name TEXT,
      alive BOOLEAN,
      marital_status TEXT,
      city_of_residence TEXT,
      area_of_residence TEXT,
      profile_pic_url TEXT,
      education_level TEXT,
      occupation TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  ELSE
    -- Add any missing columns to parents table
    PERFORM public.add_column_if_not_exists('parents', 'alive', 'BOOLEAN');
    PERFORM public.add_column_if_not_exists('parents', 'marital_status', 'TEXT');
    PERFORM public.add_column_if_not_exists('parents', 'city_of_residence', 'TEXT');
    PERFORM public.add_column_if_not_exists('parents', 'area_of_residence', 'TEXT');
  END IF;
END $$;

-- Create siblings table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'siblings') THEN
    CREATE TABLE public.siblings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      name TEXT,
      gender TEXT,
      marital_status TEXT,
      education_level TEXT,
      occupation TEXT,
      profile_pic_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  END IF;
END $$;

-- Create family_details table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'family_details') THEN
    CREATE TABLE public.family_details (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      family_environment TEXT,
      additional_info TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  END IF;
END $$;
