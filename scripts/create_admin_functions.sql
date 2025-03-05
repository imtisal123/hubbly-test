-- Create SQL functions for admin operations
-- These functions will be used by the database_admin.js module

-- Function to execute arbitrary SQL
-- This is a powerful function that should only be accessible to the service role
CREATE OR REPLACE FUNCTION execute_sql(query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  IF (current_setting('request.jwt.claims', true)::json->>'role') != 'service_role' THEN
    RAISE EXCEPTION 'Only service role can execute arbitrary SQL';
  END IF;
  
  EXECUTE query;
  result = '{"status": "success"}'::jsonb;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'status', 'error',
    'message', SQLERRM,
    'code', SQLSTATE
  );
END;
$$;

-- Function to create a policy
CREATE OR REPLACE FUNCTION create_policy(
  policy_name text,
  table_name text,
  policy_definition text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  full_sql text;
  result jsonb;
BEGIN
  IF (current_setting('request.jwt.claims', true)::json->>'role') != 'service_role' THEN
    RAISE EXCEPTION 'Only service role can create policies';
  END IF;
  
  -- Drop the policy if it exists
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors when dropping
  END;
  
  -- Create the policy
  full_sql = format('CREATE POLICY %I ON %I %s', policy_name, table_name, policy_definition);
  
  BEGIN
    EXECUTE full_sql;
    result = jsonb_build_object(
      'status', 'success',
      'message', format('Policy %s created on table %s', policy_name, table_name)
    );
  EXCEPTION WHEN OTHERS THEN
    result = jsonb_build_object(
      'status', 'error',
      'message', SQLERRM,
      'code', SQLSTATE
    );
  END;
  
  RETURN result;
END;
$$;

-- Function to list tables
CREATE OR REPLACE FUNCTION list_tables()
RETURNS TABLE (table_name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT tablename::text
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
END;
$$;

-- Function to get table information
CREATE OR REPLACE FUNCTION get_table_info(target_table text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES') as is_nullable,
    c.column_default::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND
    c.table_name = target_table
  ORDER BY 
    c.ordinal_position;
END;
$$;
