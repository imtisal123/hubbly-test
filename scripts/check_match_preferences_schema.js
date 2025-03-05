/**
 * Script to check the schema of the match_preferences table
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function checkMatchPreferencesSchema() {
  try {
    console.log('Checking match_preferences table schema...');
    
    // Get the schema information for the match_preferences table
    const { data, error } = await supabaseAdmin
      .from('match_preferences')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching match_preferences:', error);
      
      // Try to get information about the table structure
      console.log('Trying to get table structure information...');
      
      // Create a simple query to get column information
      const { data: columnsData, error: columnsError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'match_preferences')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error('Error fetching column information:', columnsError);
      } else if (columnsData) {
        console.log('Match preferences table columns:');
        columnsData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      }
      
      return;
    }
    
    // Check if there are any match_preferences
    if (data && data.length > 0) {
      console.log('Sample match_preferences data:', data[0]);
      console.log('Available columns:', Object.keys(data[0]).join(', '));
    } else {
      console.log('No match_preferences found in the database');
      
      // Try to get information about the table structure
      console.log('Trying to get table structure information...');
      
      // Create a simple query to get column information
      const { data: columnsData, error: columnsError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'match_preferences')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error('Error fetching column information:', columnsError);
      } else if (columnsData) {
        console.log('Match preferences table columns:');
        columnsData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      }
    }
    
  } catch (error) {
    console.error('Unhandled error in checkMatchPreferencesSchema:', error);
  }
}

checkMatchPreferencesSchema().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
