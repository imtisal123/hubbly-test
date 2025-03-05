/**
 * Create the family_details table directly using the Supabase API
 * This approach doesn't rely on the exec_sql function
 */
const { supabaseAdmin } = require('./lib/supabaseClient');

async function createFamilyDetailsTableDirect() {
  console.log('Attempting to create family_details table directly...');
  
  try {
    // First check if the table already exists
    const { error: checkError } = await supabaseAdmin
      .from('family_details')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log('family_details table already exists');
      return true;
    }
    
    if (!checkError.message.includes('does not exist')) {
      console.error('Unexpected error checking family_details table:', checkError);
      return false;
    }
    
    console.log('family_details table does not exist, creating it...');
    
    // Create a test profile first (needed for foreign key reference)
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const testId = '00000000-0000-0000-0000-000000000000';
    
    // Check if the test profile exists
    const { data: profileData, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', testUserId)
      .single();
    
    // Create the test profile if it doesn't exist
    if (profileCheckError || !profileData) {
      console.log('Creating test profile for foreign key reference...');
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: testUserId,
          name: 'Test User'
        });
      
      if (profileError) {
        console.error('Error creating test profile:', profileError);
        return false;
      }
      
      console.log('Test profile created successfully');
    } else {
      console.log('Test profile already exists');
    }
    
    // Now try to insert a record into family_details
    // This will fail if the table doesn't exist, but Supabase might create it
    // automatically with the right structure
    console.log('Inserting test record to create family_details table...');
    const { error: insertError } = await supabaseAdmin
      .from('family_details')
      .insert({
        id: testId,
        user_id: testUserId,
        family_environment: 'Test Environment',
        additional_info: 'Created for testing'
      });
    
    if (insertError) {
      console.error('Error creating family_details table:', insertError);
      
      // If the error indicates the table doesn't exist, we need to create it manually
      // in the Supabase dashboard using the SQL script
      if (insertError.message.includes('does not exist')) {
        console.log(`
Please run the following SQL in the Supabase dashboard to create the table:

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
        `);
      }
      
      return false;
    }
    
    console.log('Successfully created family_details table');
    
    // Clean up the test record
    await supabaseAdmin
      .from('family_details')
      .delete()
      .eq('id', testId);
    
    console.log('Test record cleaned up');
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
createFamilyDetailsTableDirect()
  .then(success => {
    console.log('Operation completed, success:', success);
  })
  .catch(error => {
    console.error('Operation failed:', error);
  });
