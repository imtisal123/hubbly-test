/**
 * Create the family_details table using SQL
 * This script uses the service role key to execute SQL directly
 */
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.Ks-MUJ-tgH3YRnxbQQ2Z4GhBYiJzXZDkOtRxzPSvvZ0';

// Create a client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createFamilyDetailsTable() {
  console.log('Creating family_details table using SQL...');
  
  try {
    // First check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'family_details');
    
    if (error) {
      console.error('Error checking if table exists:', error);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log('family_details table already exists');
      return true;
    }
    
    console.log('family_details table does not exist, creating it...');
    
    // SQL to create the table
    const sql = `
    CREATE TABLE public.family_details (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      family_environment TEXT,
      additional_info TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view their own family details"
      ON public.family_details
      FOR SELECT
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own family details"
      ON public.family_details
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own family details"
      ON public.family_details
      FOR UPDATE
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own family details"
      ON public.family_details
      FOR DELETE
      USING (auth.uid() = user_id);
    
    -- Grant permissions
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_details TO authenticated;
    GRANT SELECT, INSERT ON public.family_details TO anon;
    `;
    
    // Execute the SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql });
    
    if (sqlError) {
      console.error('Error executing SQL:', sqlError);
      
      // If the exec_sql function doesn't exist, we need to create it
      if (sqlError.message.includes('function "exec_sql" does not exist')) {
        console.log('The exec_sql function does not exist. Creating it...');
        
        // SQL to create the exec_sql function
        const createFunctionSql = `
        CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER -- Run as the function owner
        AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
        `;
        
        // Try to create the function
        const { error: functionError } = await supabase.rpc('exec_sql', { sql: createFunctionSql });
        
        if (functionError) {
          console.error('Error creating exec_sql function:', functionError);
          console.log('Please run the following SQL in the Supabase dashboard:');
          console.log(createFunctionSql);
          console.log('Then run the following SQL to create the family_details table:');
          console.log(sql);
          return false;
        }
        
        // Try again to create the table
        const { error: retryError } = await supabase.rpc('exec_sql', { sql });
        
        if (retryError) {
          console.error('Error creating table on retry:', retryError);
          return false;
        }
      } else {
        // Some other error occurred
        console.log('Please run the following SQL in the Supabase dashboard:');
        console.log(sql);
        return false;
      }
    }
    
    console.log('Successfully created family_details table');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
createFamilyDetailsTable()
  .then(success => {
    console.log('Operation completed, success:', success);
  })
  .catch(error => {
    console.error('Operation failed:', error);
  });
