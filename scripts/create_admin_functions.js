/**
 * Script to create SQL functions for admin operations
 * These functions are required for the database_admin.js module to work
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

async function createAdminFunctions() {
  console.log('Creating admin functions...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create_admin_functions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('execute_sql', { 
        query: statement + ';' 
      }).catch(err => {
        // If execute_sql doesn't exist yet, use raw SQL
        return supabase.from('_rpc').select('*').rpc('execute_sql', { 
          query: statement + ';' 
        });
      });
      
      if (error) {
        console.error('Error executing SQL:', error);
        console.log('Trying to execute SQL directly...');
        
        // Try direct SQL execution as a fallback
        const { error: directError } = await supabase.from('_rpc').select('*').rpc('execute_sql', { 
          query: statement + ';' 
        });
        
        if (directError) {
          console.error('Error executing SQL directly:', directError);
        } else {
          console.log('SQL executed directly successfully');
        }
      } else {
        console.log('SQL executed successfully');
      }
    }
    
    console.log('Admin functions created successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createAdminFunctions()
  .catch(error => console.error('Error creating admin functions:', error))
  .finally(() => {
    console.log('Script execution completed');
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
