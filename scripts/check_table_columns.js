/**
 * Script to check the columns in a table
 */
const { supabase } = require('../lib/supabaseClient');

async function checkTableColumns(tableName) {
  try {
    console.log(`Checking columns in ${tableName} table...`);
    
    // Query the information schema to get column information
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) {
      console.error(`Error querying columns for ${tableName}:`, error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`Columns in ${tableName}:`);
      data.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    } else {
      console.log(`No columns found for ${tableName}`);
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}

async function main() {
  // List of tables to check
  const tables = [
    'match_preferences',
    'religious_details',
    'personal_details',
    'family_details',
    'profiles'
  ];
  
  for (const table of tables) {
    await checkTableColumns(table);
    console.log(''); // Add a blank line between tables
  }
}

main().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
