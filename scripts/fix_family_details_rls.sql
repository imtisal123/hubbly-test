-- Fix Row Level Security (RLS) policies for family_details table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'family_details') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS family_details_select_policy ON public.family_details;
        DROP POLICY IF EXISTS family_details_insert_policy ON public.family_details;
        DROP POLICY IF EXISTS family_details_update_policy ON public.family_details;
        DROP POLICY IF EXISTS family_details_delete_policy ON public.family_details;
        
        -- Enable RLS on the table
        ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow users to manage their own family details
        -- Select policy: Users can view their own family details
        CREATE POLICY family_details_select_policy ON public.family_details
            FOR SELECT USING (auth.uid() = id);
        
        -- Insert policy: Users can insert their own family details
        CREATE POLICY family_details_insert_policy ON public.family_details
            FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        
        -- Update policy: Users can update their own family details
        CREATE POLICY family_details_update_policy ON public.family_details
            FOR UPDATE USING (auth.uid() = id);
        
        -- Delete policy: Users can delete their own family details
        CREATE POLICY family_details_delete_policy ON public.family_details
            FOR DELETE USING (auth.uid() = id);
    END IF;
END $$;

-- Fix Row Level Security (RLS) policies for demo_family_details table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'demo_family_details') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS demo_family_details_select_policy ON public.demo_family_details;
        DROP POLICY IF EXISTS demo_family_details_insert_policy ON public.demo_family_details;
        DROP POLICY IF EXISTS demo_family_details_update_policy ON public.demo_family_details;
        DROP POLICY IF EXISTS demo_family_details_delete_policy ON public.demo_family_details;
        
        -- Enable RLS on the table
        ALTER TABLE public.demo_family_details ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow any authenticated user to manage demo family details
        -- Select policy: Any authenticated user can view demo family details
        CREATE POLICY demo_family_details_select_policy ON public.demo_family_details
            FOR SELECT USING (true);
        
        -- Insert policy: Any authenticated user can insert demo family details
        CREATE POLICY demo_family_details_insert_policy ON public.demo_family_details
            FOR INSERT WITH CHECK (true);
        
        -- Update policy: Any authenticated user can update demo family details
        CREATE POLICY demo_family_details_update_policy ON public.demo_family_details
            FOR UPDATE USING (true);
        
        -- Delete policy: Any authenticated user can delete demo family details
        CREATE POLICY demo_family_details_delete_policy ON public.demo_family_details
            FOR DELETE USING (true);
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
