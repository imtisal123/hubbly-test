-- Row Level Security (RLS) policies for profile tables
-- These policies ensure that users can only access their own data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE siblings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Allow users to select only their own profile
CREATE POLICY profiles_select_policy ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to insert only their own profile
CREATE POLICY profiles_insert_policy ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY profiles_update_policy ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow users to delete only their own profile
CREATE POLICY profiles_delete_policy ON profiles
    FOR DELETE
    USING (auth.uid() = id);

-- Create policies for match_preferences table
-- Allow users to select only their own match preferences
CREATE POLICY match_preferences_select_policy ON match_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert only their own match preferences
CREATE POLICY match_preferences_insert_policy ON match_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own match preferences
CREATE POLICY match_preferences_update_policy ON match_preferences
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete only their own match preferences
CREATE POLICY match_preferences_delete_policy ON match_preferences
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for family_details table
-- Allow users to select only their own family details
CREATE POLICY family_details_select_policy ON family_details
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert only their own family details
CREATE POLICY family_details_insert_policy ON family_details
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own family details
CREATE POLICY family_details_update_policy ON family_details
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete only their own family details
CREATE POLICY family_details_delete_policy ON family_details
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for parents table
-- This requires a join to family_details to verify ownership
CREATE POLICY parents_select_policy ON parents
    FOR SELECT
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY parents_insert_policy ON parents
    FOR INSERT
    WITH CHECK (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY parents_update_policy ON parents
    FOR UPDATE
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY parents_delete_policy ON parents
    FOR DELETE
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

-- Create policies for siblings table
-- This requires a join to family_details to verify ownership
CREATE POLICY siblings_select_policy ON siblings
    FOR SELECT
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY siblings_insert_policy ON siblings
    FOR INSERT
    WITH CHECK (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY siblings_update_policy ON siblings
    FOR UPDATE
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

CREATE POLICY siblings_delete_policy ON siblings
    FOR DELETE
    USING (
        family_details_id IN (
            SELECT id FROM family_details WHERE user_id = auth.uid()
        )
    );

-- Allow unrestricted access to demo tables
-- These tables are for demo purposes and don't contain real user data
ALTER TABLE demo_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE demo_match_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE demo_family_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE demo_parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE demo_siblings DISABLE ROW LEVEL SECURITY;

-- Alternatively, you can create policies that allow access to demo data for all authenticated users
-- This is useful if you want to restrict access to demo data to only authenticated users
-- Uncomment the following lines if you prefer this approach

/*
ALTER TABLE demo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_family_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_siblings ENABLE ROW LEVEL SECURITY;

-- Create policies for demo tables that allow access to all authenticated users
CREATE POLICY demo_profiles_policy ON demo_profiles
    FOR ALL
    USING (auth.role() IS NOT NULL);

CREATE POLICY demo_match_preferences_policy ON demo_match_preferences
    FOR ALL
    USING (auth.role() IS NOT NULL);

CREATE POLICY demo_family_details_policy ON demo_family_details
    FOR ALL
    USING (auth.role() IS NOT NULL);

CREATE POLICY demo_parents_policy ON demo_parents
    FOR ALL
    USING (auth.role() IS NOT NULL);

CREATE POLICY demo_siblings_policy ON demo_siblings
    FOR ALL
    USING (auth.role() IS NOT NULL);
*/
