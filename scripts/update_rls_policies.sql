-- Update RLS policies to allow service role to bypass restrictions
-- This is necessary for admin functions to work properly

-- Create a policy for the service role to access all profiles
DROP POLICY IF EXISTS service_role_profiles_policy ON profiles;
CREATE POLICY service_role_profiles_policy ON profiles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all match preferences
DROP POLICY IF EXISTS service_role_match_preferences_policy ON match_preferences;
CREATE POLICY service_role_match_preferences_policy ON match_preferences
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all family details
DROP POLICY IF EXISTS service_role_family_details_policy ON family_details;
CREATE POLICY service_role_family_details_policy ON family_details
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all parents
DROP POLICY IF EXISTS service_role_parents_policy ON parents;
CREATE POLICY service_role_parents_policy ON parents
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all siblings
DROP POLICY IF EXISTS service_role_siblings_policy ON siblings;
CREATE POLICY service_role_siblings_policy ON siblings
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
