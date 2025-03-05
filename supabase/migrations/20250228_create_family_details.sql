-- Create family_details table directly
-- Run this in the Supabase SQL editor

-- Check if the table exists first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'family_details'
  ) THEN
    -- Create the table
    CREATE TABLE public.family_details (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      family_environment TEXT,
      additional_info TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Add RLS policies
    ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow users to read their own family details
    CREATE POLICY "Users can view their own family details"
      ON public.family_details
      FOR SELECT
      USING (auth.uid() = user_id);
    
    -- Create policy to allow users to insert their own family details
    CREATE POLICY "Users can insert their own family details"
      ON public.family_details
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    -- Create policy to allow users to update their own family details
    CREATE POLICY "Users can update their own family details"
      ON public.family_details
      FOR UPDATE
      USING (auth.uid() = user_id);
    
    -- Create policy to allow users to delete their own family details
    CREATE POLICY "Users can delete their own family details"
      ON public.family_details
      FOR DELETE
      USING (auth.uid() = user_id);
    
    -- Grant permissions to authenticated users
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_details TO authenticated;
    
    -- Grant permissions to anon users (for initial signup)
    GRANT SELECT, INSERT ON public.family_details TO anon;
    
    RAISE NOTICE 'Created family_details table';
  ELSE
    RAISE NOTICE 'family_details table already exists';
  END IF;
END
$$;
