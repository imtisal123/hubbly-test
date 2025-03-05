-- Create profiles table with all necessary columns
CREATE TABLE IF NOT EXISTS profiles (
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

-- Create match_preferences table
CREATE TABLE IF NOT EXISTS match_preferences (
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

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
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

-- Create siblings table
CREATE TABLE IF NOT EXISTS siblings (
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

-- Create family_details table
CREATE TABLE IF NOT EXISTS family_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_environment TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create helper function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(
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
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
) RETURNS boolean AS $$
BEGIN
  IF NOT column_exists(table_name, column_name) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  table_name, column_name, column_type);
    RETURN true;
  END IF;
  RETURN false;
END;
$$ LANGUAGE plpgsql;
