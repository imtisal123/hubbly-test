/**
 * Script to update the profiles table schema
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function updateProfilesTable() {
  try {
    console.log('Updating profiles table...');
    
    // Check if about column exists in profiles table
    console.log('Checking if about column exists in profiles table...');
    const { data: aboutColumnExists, error: aboutColumnError } = await supabaseAdmin
      .from('profiles')
      .select('about')
      .limit(1)
      .catch(err => {
        return { error: err };
      });
    
    // If about column doesn't exist, add it
    if (aboutColumnError && aboutColumnError.message.includes('about')) {
      console.log('Adding about column to profiles table...');
      
      // Execute SQL directly using Supabase REST API
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          sql: `
            ALTER TABLE public.profiles 
            ADD COLUMN IF NOT EXISTS about TEXT;
          `
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding about column:', errorData);
      } else {
        console.log('Successfully added about column to profiles table');
      }
    } else {
      console.log('About column already exists in profiles table');
    }
    
    console.log('Profiles table update completed');
  } catch (error) {
    console.error('Unhandled error in updateProfilesTable:', error);
  }
}

updateProfilesTable().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
