/**
 * Create the family_details table using the REST API
 */

// Supabase credentials
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.Ks-MUJ-tgH3YRnxbQQ2Z4GhBYiJzXZDkOtRxzPSvvZ0';

async function createFamilyDetailsTable() {
  console.log('Creating family_details table using REST API...');
  
  try {
    // SQL to create the table
    const sql = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'family_details'
      ) THEN
        CREATE TABLE public.family_details (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          family_environment TEXT,
          additional_info TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow users to read their own family details
        CREATE POLICY "Users can view their own family details"
          ON public.family_details
          FOR SELECT
          USING (auth.uid() = user_id);
        
        -- Create policy to allow users to insert their own family details
        CREATE POLICY "Users can insert their own family details"
          ON public.family_details
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
        
        -- Create policy to allow users to update their own family details
        CREATE POLICY "Users can update their own family details"
          ON public.family_details
          FOR UPDATE
          USING (auth.uid() = user_id);
        
        -- Create policy to allow users to delete their own family details
        CREATE POLICY "Users can delete their own family details"
          ON public.family_details
          FOR DELETE
          USING (auth.uid() = user_id);
        
        -- Grant permissions to authenticated users
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_details TO authenticated;
        
        -- Grant permissions to anon users (for initial signup)
        GRANT SELECT, INSERT ON public.family_details TO anon;
        
        RAISE NOTICE 'Created family_details table';
      ELSE
        RAISE NOTICE 'family_details table already exists';
      END IF;
    END
    $$;
    `;
    
    // Execute the SQL using the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error executing SQL:', errorData);
      
      console.log('Please run the following SQL in the Supabase dashboard:');
      console.log(sql);
      return false;
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
