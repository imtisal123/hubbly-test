-- Add education column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'education'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN education TEXT;
    END IF;
END $$;
