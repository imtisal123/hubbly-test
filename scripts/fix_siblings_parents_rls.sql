-- Fix Row Level Security (RLS) policies for siblings table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'siblings') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS siblings_select_policy ON public.siblings;
        DROP POLICY IF EXISTS siblings_insert_policy ON public.siblings;
        DROP POLICY IF EXISTS siblings_update_policy ON public.siblings;
        DROP POLICY IF EXISTS siblings_delete_policy ON public.siblings;
        
        -- Enable RLS on the table
        ALTER TABLE public.siblings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow users to manage their own siblings data
        -- Select policy: Users can view their own siblings data
        CREATE POLICY siblings_select_policy ON public.siblings
            FOR SELECT USING (auth.uid() = user_id);
        
        -- Insert policy: Users can insert their own siblings data
        CREATE POLICY siblings_insert_policy ON public.siblings
            FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
        
        -- Update policy: Users can update their own siblings data
        CREATE POLICY siblings_update_policy ON public.siblings
            FOR UPDATE USING (auth.uid() = user_id);
        
        -- Delete policy: Users can delete their own siblings data
        CREATE POLICY siblings_delete_policy ON public.siblings
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Fix Row Level Security (RLS) policies for parents table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'parents') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS parents_select_policy ON public.parents;
        DROP POLICY IF EXISTS parents_insert_policy ON public.parents;
        DROP POLICY IF EXISTS parents_update_policy ON public.parents;
        DROP POLICY IF EXISTS parents_delete_policy ON public.parents;
        
        -- Enable RLS on the table
        ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow users to manage their own parents data
        -- Select policy: Users can view their own parents data
        CREATE POLICY parents_select_policy ON public.parents
            FOR SELECT USING (auth.uid() = user_id);
        
        -- Insert policy: Users can insert their own parents data
        CREATE POLICY parents_insert_policy ON public.parents
            FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
        
        -- Update policy: Users can update their own parents data
        CREATE POLICY parents_update_policy ON public.parents
            FOR UPDATE USING (auth.uid() = user_id);
        
        -- Delete policy: Users can delete their own parents data
        CREATE POLICY parents_delete_policy ON public.parents
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Fix Row Level Security (RLS) policies for demo_siblings table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'demo_siblings') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS demo_siblings_select_policy ON public.demo_siblings;
        DROP POLICY IF EXISTS demo_siblings_insert_policy ON public.demo_siblings;
        DROP POLICY IF EXISTS demo_siblings_update_policy ON public.demo_siblings;
        DROP POLICY IF EXISTS demo_siblings_delete_policy ON public.demo_siblings;
        
        -- Enable RLS on the table
        ALTER TABLE public.demo_siblings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow any authenticated user to manage demo siblings data
        -- Select policy: Any authenticated user can view demo siblings data
        CREATE POLICY demo_siblings_select_policy ON public.demo_siblings
            FOR SELECT USING (true);
        
        -- Insert policy: Any authenticated user can insert demo siblings data
        CREATE POLICY demo_siblings_insert_policy ON public.demo_siblings
            FOR INSERT WITH CHECK (true);
        
        -- Update policy: Any authenticated user can update demo siblings data
        CREATE POLICY demo_siblings_update_policy ON public.demo_siblings
            FOR UPDATE USING (true);
        
        -- Delete policy: Any authenticated user can delete demo siblings data
        CREATE POLICY demo_siblings_delete_policy ON public.demo_siblings
            FOR DELETE USING (true);
    END IF;
END $$;

-- Fix Row Level Security (RLS) policies for demo_parents table

-- First, check if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'demo_parents') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS demo_parents_select_policy ON public.demo_parents;
        DROP POLICY IF EXISTS demo_parents_insert_policy ON public.demo_parents;
        DROP POLICY IF EXISTS demo_parents_update_policy ON public.demo_parents;
        DROP POLICY IF EXISTS demo_parents_delete_policy ON public.demo_parents;
        
        -- Enable RLS on the table
        ALTER TABLE public.demo_parents ENABLE ROW LEVEL SECURITY;
        
        -- Create policies that allow any authenticated user to manage demo parents data
        -- Select policy: Any authenticated user can view demo parents data
        CREATE POLICY demo_parents_select_policy ON public.demo_parents
            FOR SELECT USING (true);
        
        -- Insert policy: Any authenticated user can insert demo parents data
        CREATE POLICY demo_parents_insert_policy ON public.demo_parents
            FOR INSERT WITH CHECK (true);
        
        -- Update policy: Any authenticated user can update demo parents data
        CREATE POLICY demo_parents_update_policy ON public.demo_parents
            FOR UPDATE USING (true);
        
        -- Delete policy: Any authenticated user can delete demo parents data
        CREATE POLICY demo_parents_delete_policy ON public.demo_parents
            FOR DELETE USING (true);
    END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
