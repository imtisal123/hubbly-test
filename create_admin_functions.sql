-- SQL script to create administrative helper functions
-- These functions allow executing various administrative tasks from JavaScript

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.execute_sql(text);
DROP FUNCTION IF EXISTS public.create_table(text, text);
DROP FUNCTION IF EXISTS public.add_column(text, text, text);
DROP FUNCTION IF EXISTS public.create_policy(text, text, text);
DROP FUNCTION IF EXISTS public.get_table_info(text);
DROP FUNCTION IF EXISTS public.list_tables();

-- Function to execute any SQL query (we already created this one)
CREATE OR REPLACE FUNCTION public.execute_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Function to create a new table
CREATE OR REPLACE FUNCTION public.create_table(table_name text, table_definition text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('CREATE TABLE IF NOT EXISTS %I %s', table_name, table_definition);
END;
$$;

-- Function to add a column to a table
CREATE OR REPLACE FUNCTION public.add_column(table_name text, column_name text, column_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %s', table_name, column_name, column_type);
END;
$$;

-- Function to create an RLS policy
CREATE OR REPLACE FUNCTION public.create_policy(policy_name text, table_name text, policy_definition text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First try to drop the policy if it exists to avoid conflicts
  BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if policy doesn't exist
  END;
  
  -- Create the new policy
  EXECUTE format('CREATE POLICY %I ON %I %s', policy_name, table_name, policy_definition);
END;
$$;

-- Function to get table information
CREATE OR REPLACE FUNCTION public.get_table_info(target_table text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query text;
BEGIN
  query := 'SELECT column_name::text, data_type::text, is_nullable::text
            FROM information_schema.columns
            WHERE table_schema = ''public'' 
              AND table_name = $1
            ORDER BY ordinal_position';
  
  RETURN QUERY EXECUTE query USING target_table;
END;
$$;

-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION public.list_tables()
RETURNS TABLE (
  table_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  ORDER BY t.table_name;
END;
$$;

-- Grant execute permissions to the service_role
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_table(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.add_column(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_policy(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_table_info(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_tables() TO service_role;
