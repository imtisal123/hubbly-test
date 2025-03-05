-- Create the execute_sql function to allow executing SQL from JavaScript
-- This function should be created with appropriate permissions

CREATE OR REPLACE FUNCTION public.execute_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Grant execute permission to the service_role (used by supabaseAdmin)
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
