/**
 * Script to check if tables exist in the database
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function checkTablesExist() {
  try {
    console.log('Checking if tables exist in the database...');
    
    // Check which tables exist in the public schema
    const { data, error } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
    });
    
    if (error) {
      console.error('Error checking tables:', error);
      return;
    }
    
    console.log('Tables in the public schema:');
    if (data && data.length > 0) {
      data.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } else {
      console.log('No tables found in the public schema');
    }
    
    // Check if the execute_sql function exists
    const { data: funcData, error: funcError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT proname 
        FROM pg_proc 
        WHERE proname = 'execute_sql'
      `
    });
    
    if (funcError) {
      console.error('Error checking execute_sql function:', funcError);
    } else {
      console.log('\nExecute SQL function:');
      if (funcData && funcData.length > 0) {
        console.log('execute_sql function exists');
      } else {
        console.log('execute_sql function does not exist');
      }
    }
    
  } catch (error) {
    console.error('Unhandled error in checkTablesExist:', error);
  }
}

checkTablesExist().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
