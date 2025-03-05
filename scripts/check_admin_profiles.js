/**
 * Script to check admin profiles in all tables
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function checkTables() {
  console.log('Checking all tables for admin profiles:');
  
  const tables = [
    'profiles', 
    'match_preferences', 
    'family_details', 
    'religious_details', 
    'personal_details'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('*')
        .eq('is_demo', false)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error(`Error fetching from ${table}:`, error);
      } else {
        console.log(`\n${table} table - found ${data.length} records:`);
        if (data.length > 0) {
          console.log(JSON.stringify(data[0], null, 2));
        }
      }
    } catch (err) {
      console.error(`Exception when checking ${table}:`, err);
    }
  }
}

checkTables().catch(error => {
  console.error('Unhandled error in script:', error);
  process.exit(1);
});
