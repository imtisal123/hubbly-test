/**
 * Script to check the schema of the profiles table
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function checkProfilesSchema() {
  try {
    console.log('Checking profiles table schema...');
    
    // Get the schema information for the profiles table
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    // Check if there are any profiles
    if (data && data.length > 0) {
      console.log('Sample profile data:', data[0]);
      console.log('Available columns:', Object.keys(data[0]).join(', '));
    } else {
      console.log('No profiles found in the database');
    }
    
    // Get the schema information for the profiles table using system tables
    const { data: schemaData, error: schemaError } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'profiles' })
      .catch(err => {
        return { error: err };
      });
    
    if (schemaError) {
      console.error('Error fetching schema information:', schemaError);
      
      // Try alternative approach if RPC fails
      console.log('Trying alternative approach to get schema information...');
      
      // Create a simple query to get column information
      const { data: columnsData, error: columnsError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error('Error fetching column information:', columnsError);
      } else if (columnsData) {
        console.log('Profiles table columns:');
        columnsData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      }
    } else if (schemaData) {
      console.log('Profiles table schema:', schemaData);
    }
    
  } catch (error) {
    console.error('Unhandled error in checkProfilesSchema:', error);
  }
}

checkProfilesSchema().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
