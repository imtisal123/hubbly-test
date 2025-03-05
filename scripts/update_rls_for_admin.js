/**
 * Script to update RLS policies to allow service role to bypass restrictions
 * This is necessary for admin functions to work properly
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key to execute SQL
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updateRLSPolicies() {
  console.log('Updating RLS policies to allow service role access...');

  try {
    // Create policies for service role
    const tables = ['profiles', 'match_preferences', 'family_details', 'parents', 'siblings'];
    
    for (const table of tables) {
      const policyName = `service_role_${table}_policy`;
      
      // Create the policy (will fail silently if it already exists)
      const { error } = await adminSupabase.rpc('exec_sql', {
        query: `
          DROP POLICY IF EXISTS "${policyName}" ON ${table};
          CREATE POLICY "${policyName}" ON ${table}
          FOR ALL
          USING (auth.jwt() ->> 'role' = 'service_role');
        `
      });
      
      if (error) {
        console.error(`Error creating policy for ${table}:`, error);
      } else {
        console.log(`Successfully created/updated policy for ${table}`);
      }
    }
    
    console.log('RLS policy update completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateRLSPolicies()
  .catch(error => console.error('Error updating RLS policies:', error))
  .finally(() => {
    console.log('Script execution completed');
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
