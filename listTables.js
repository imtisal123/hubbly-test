const { supabase } = require('./lib/supabaseClient');

async function listTables() {
  console.log('Attempting to list tables in the database...');
  
  try {
    // Try to query a few known tables to see if they exist
    const tables = [
      'profiles',
      'parents',
      'siblings',
      'match_preferences',
      'family_details'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`Table '${table}' error:`, error.message);
      } else {
        console.log(`Table '${table}' exists`);
        
        if (data && data.length > 0) {
          console.log(`Sample row from '${table}':`, JSON.stringify(data[0], null, 2));
          console.log(`Columns in '${table}':`, Object.keys(data[0]).join(', '));
        } else {
          console.log(`Table '${table}' exists but has no rows`);
          
          // Try to get the structure by describing the table
          const { data: structData, error: structError } = await supabase
            .rpc('get_table_structure', { table_name: table });
            
          if (structError) {
            console.log(`Error getting structure for '${table}':`, structError.message);
          } else {
            console.log(`Structure for '${table}':`, structData);
          }
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

listTables().catch(console.error);
