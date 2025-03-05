/**
 * Test the database setup functionality
 */
const { ensureDatabaseSetup } = require('./lib/databaseSetup');
const { supabase } = require('./lib/supabaseClient');

async function testDatabaseSetup() {
  console.log('Testing database setup...');
  
  try {
    // First, ensure the database is set up
    const setupSuccess = await ensureDatabaseSetup();
    console.log('Database setup complete, success:', setupSuccess);
    
    // Now check each table
    const tables = ['profiles', 'match_preferences', 'parents', 'siblings', 'family_details'];
    
    for (const table of tables) {
      console.log(`\nChecking table: ${table}`);
      
      // Check if the table exists
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`Error checking table ${table}:`, error);
      } else {
        console.log(`Table ${table} exists`);
        
        // Get the table structure
        const { data: structureData, error: structureError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_name', table)
          .eq('table_schema', 'public');
        
        if (structureError) {
          console.error(`Error getting structure for ${table}:`, structureError);
        } else if (structureData && structureData.length > 0) {
          console.log(`Columns in ${table}:`);
          structureData.forEach(column => {
            console.log(`  - ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
          });
        } else {
          console.log(`No columns found for ${table}`);
        }
      }
    }
    
    console.log('\nTest complete');
  } catch (error) {
    console.error('Error testing database setup:', error);
  }
}

testDatabaseSetup().catch(console.error);
