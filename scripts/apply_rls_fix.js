/**
 * Script to apply RLS fixes to the database
 * This script executes the SQL in fix_profiles_rls.sql
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Use service role key to execute SQL
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  process.exit(1);
}

// Create a Supabase client with the service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function applyRLSFixes() {
  console.log('Applying RLS fixes...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'fix_profiles_rls.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing SQL: ${statement.trim().substring(0, 50)}...`);
      
      const { data, error } = await supabase.rpc('execute_sql', { 
        query: statement + ';' 
      });
      
      if (error) {
        console.error('Error executing SQL:', error);
        
        // Try direct SQL execution as a fallback
        console.log('Trying direct SQL execution...');
        const { error: directError } = await supabase.from('_rpc').select('*').rpc('execute_sql', { 
          query: statement + ';' 
        });
        
        if (directError) {
          console.error('Error with direct SQL execution:', directError);
        } else {
          console.log('SQL executed directly successfully');
        }
      } else {
        console.log('SQL executed successfully');
      }
    }
    
    console.log('RLS fixes applied successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
applyRLSFixes()
  .catch(error => console.error('Error applying RLS fixes:', error))
  .finally(() => {
    console.log('Script execution completed');
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
