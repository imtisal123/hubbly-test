// Script to fix the RLS policy for profiles table
const { supabase } = require('../lib/supabaseClient');

async function fixProfilesRLS() {
  console.log('Adding INSERT policy for profiles table...');

  try {
    // Run SQL query to add the missing policy
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        CREATE POLICY "Users can insert their own profile"
        ON profiles FOR INSERT
        WITH CHECK (auth.uid() = id);
      `
    });

    if (error) {
      console.error('Error adding policy:', error);
      return;
    }

    console.log('Successfully added INSERT policy for profiles table');
    console.log('You should now be able to sign up without the RLS error');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
fixProfilesRLS();
