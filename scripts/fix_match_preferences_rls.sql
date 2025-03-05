-- Fix Row Level Security (RLS) policies for match_preferences table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'match_preferences') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS match_preferences_select_policy ON public.match_preferences;
        DROP POLICY IF EXISTS match_preferences_insert_policy ON public.match_preferences;
        DROP POLICY IF EXISTS match_preferences_update_policy ON public.match_preferences;
        DROP POLICY IF EXISTS match_preferences_delete_policy ON public.match_preferences;
        
        -- Enable RLS on the table
        ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow users to manage their own preferences
        -- Select policy: Users can view their own preferences
        CREATE POLICY match_preferences_select_policy ON public.match_preferences
            FOR SELECT USING (auth.uid() = id);
        
        -- Insert policy: Users can insert their own preferences
        CREATE POLICY match_preferences_insert_policy ON public.match_preferences
            FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        
        -- Update policy: Users can update their own preferences
        CREATE POLICY match_preferences_update_policy ON public.match_preferences
            FOR UPDATE USING (auth.uid() = id);
        
        -- Delete policy: Users can delete their own preferences
        CREATE POLICY match_preferences_delete_policy ON public.match_preferences
            FOR DELETE USING (auth.uid() = id);
    END IF;
END $$;

-- Fix Row Level Security (RLS) policies for demo_match_preferences table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'demo_match_preferences') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS demo_match_preferences_select_policy ON public.demo_match_preferences;
        DROP POLICY IF EXISTS demo_match_preferences_insert_policy ON public.demo_match_preferences;
        DROP POLICY IF EXISTS demo_match_preferences_update_policy ON public.demo_match_preferences;
        DROP POLICY IF EXISTS demo_match_preferences_delete_policy ON public.demo_match_preferences;
        
        -- Enable RLS on the table
        ALTER TABLE public.demo_match_preferences ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow any authenticated user to manage demo preferences
        -- Select policy: Any authenticated user can view demo preferences
        CREATE POLICY demo_match_preferences_select_policy ON public.demo_match_preferences
            FOR SELECT USING (true);
        
        -- Insert policy: Any authenticated user can insert demo preferences
        CREATE POLICY demo_match_preferences_insert_policy ON public.demo_match_preferences
            FOR INSERT WITH CHECK (true);
        
        -- Update policy: Any authenticated user can update demo preferences
        CREATE POLICY demo_match_preferences_update_policy ON public.demo_match_preferences
            FOR UPDATE USING (true);
        
        -- Delete policy: Any authenticated user can delete demo preferences
        CREATE POLICY demo_match_preferences_delete_policy ON public.demo_match_preferences
            FOR DELETE USING (true);
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
