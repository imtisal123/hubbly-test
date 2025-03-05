-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add missing columns to personal_details table
ALTER TABLE public.personal_details
ADD COLUMN IF NOT EXISTS eye_color TEXT,
ADD COLUMN IF NOT EXISTS hair_color TEXT,
ADD COLUMN IF NOT EXISTS smoking TEXT,
ADD COLUMN IF NOT EXISTS drinking TEXT,
ADD COLUMN IF NOT EXISTS diet_preference TEXT,
ADD COLUMN IF NOT EXISTS exercise_frequency TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS hobbies TEXT[],
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS about_me TEXT;

-- Update siblings and parents foreign key constraints
ALTER TABLE public.siblings
DROP CONSTRAINT IF EXISTS siblings_user_id_fkey,
ADD CONSTRAINT siblings_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.parents
DROP CONSTRAINT IF EXISTS parents_user_id_fkey,
ADD CONSTRAINT parents_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Force a refresh of the schema cache
NOTIFY pgrst, 'reload schema';
