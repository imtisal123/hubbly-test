-- Create a function to execute arbitrary SQL
-- This is needed to apply our migrations
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as the function owner
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
