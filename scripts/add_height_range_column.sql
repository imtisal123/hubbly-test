-- Add height_range column to match_preferences table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'match_preferences' 
        AND column_name = 'height_range'
    ) THEN
        ALTER TABLE public.match_preferences ADD COLUMN height_range TEXT;
    END IF;
END $$;

-- Add height_range column to demo_match_preferences table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'demo_match_preferences' 
        AND column_name = 'height_range'
    ) THEN
        ALTER TABLE public.demo_match_preferences ADD COLUMN height_range TEXT;
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
