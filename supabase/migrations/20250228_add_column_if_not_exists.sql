-- Create a function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  column_exists boolean;
BEGIN
  -- Check if the column already exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
      AND column_name = $2
  ) INTO column_exists;
  
  -- If the column doesn't exist, add it
  IF NOT column_exists THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', 
                  table_name, column_name, column_type);
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create a function to create the profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if the table already exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
  ) INTO table_exists;
  
  -- If the table doesn't exist, create it with all necessary columns
  IF NOT table_exists THEN
    CREATE TABLE public.profiles (
      id uuid PRIMARY KEY,
      created_at timestamp with time zone DEFAULT now(),
      name text,
      date_of_birth date,
      gender text,
      height numeric,
      ethnicity text,
      location text,
      nationality text,
      education_level text,
      university text,
      occupation text,
      company text,
      profile_pic_url text,
      marital_status text,
      has_children boolean DEFAULT false,
      number_of_children integer DEFAULT 0,
      religion text,
      islamic_sect text,
      other_sect text,
      cover_head text,
      cover_head_type text,
      monthly_income text,
      is_demo boolean DEFAULT false
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
