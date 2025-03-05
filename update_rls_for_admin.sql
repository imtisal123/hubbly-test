-- Update RLS policies to allow service role to bypass restrictions
-- This is necessary for admin functions to work properly

-- Create a policy for the service role to access all profiles
CREATE POLICY service_role_profiles_policy ON profiles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all match preferences
CREATE POLICY service_role_match_preferences_policy ON match_preferences
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all family details
CREATE POLICY service_role_family_details_policy ON family_details
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all parents
CREATE POLICY service_role_parents_policy ON parents
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a policy for the service role to access all siblings
CREATE POLICY service_role_siblings_policy ON siblings
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Alternative approach: Create a function to check if the current role is service_role
CREATE OR REPLACE FUNCTION auth.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies using the function (uncomment if you prefer this approach)
/*
CREATE POLICY service_role_profiles_policy_alt ON profiles
    FOR ALL
    USING (auth.is_service_role());

CREATE POLICY service_role_match_preferences_policy_alt ON match_preferences
    FOR ALL
    USING (auth.is_service_role());

CREATE POLICY service_role_family_details_policy_alt ON family_details
    FOR ALL
    USING (auth.is_service_role());

CREATE POLICY service_role_parents_policy_alt ON parents
    FOR ALL
    USING (auth.is_service_role());

CREATE POLICY service_role_siblings_policy_alt ON siblings
    FOR ALL
    USING (auth.is_service_role());
*/
