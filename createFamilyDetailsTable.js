/**
 * Create the family_details table directly
 */
const { supabase } = require('./lib/supabaseClient');

async function createFamilyDetailsTable() {
  console.log('Creating family_details table...');
  
  try {
    // First check if the table already exists
    const { error: checkError } = await supabase
      .from('family_details')
      .select('id')
      .limit(1);
    
    if (!checkError || !checkError.message.includes('does not exist')) {
      console.log('family_details table already exists');
      return;
    }
    
    // Create a test record with all the fields we need
    const testRecord = {
      id: '00000000-0000-0000-0000-000000000000',
      user_id: '00000000-0000-0000-0000-000000000001',
      family_environment: 'test environment',
      additional_info: 'test info'
    };
    
    const { error: insertError } = await supabase
      .from('family_details')
      .insert(testRecord);
    
    if (insertError) {
      console.error('Error creating family_details table:', insertError);
      
      // If the error is that the table doesn't exist, try to create it manually
      if (insertError.message.includes('does not exist')) {
        console.log('Trying to create the table manually...');
        
        // Try to create the table using a direct SQL query via the REST API
        // Since we can't execute SQL directly, we'll try to use a stored procedure
        // or we'll need to create the table in the Supabase dashboard
        console.log('Please create the family_details table in the Supabase dashboard with the following structure:');
        console.log(`
CREATE TABLE public.family_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_environment TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
        `);
      }
    } else {
      console.log('family_details table created successfully');
      
      // Clean up the test record
      await supabase
        .from('family_details')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createFamilyDetailsTable().catch(console.error);
