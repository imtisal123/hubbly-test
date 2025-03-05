/**
 * Script to check the columns in the match_preferences table
 */
const { supabase, supabaseAdmin } = require('../lib/supabaseClient');

async function checkMatchPreferencesColumns() {
  try {
    console.log('Checking match_preferences table columns...');
    
    // Direct query using supabase-js
    const { data, error } = await supabase
      .from('match_preferences')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying match_preferences:', error);
    } else {
      if (data && data.length > 0) {
        console.log('Columns in match_preferences:', Object.keys(data[0]));
      } else {
        console.log('No data found in match_preferences table');
      }
    }
    
    // Try to insert a test record to see which columns are available
    console.log('\nTrying to insert a test record...');
    
    const testData = {
      id: '00000000-0000-0000-0000-000000000000', // A dummy UUID that won't conflict
      preferred_ethnicities: ['Asian', 'Middle Eastern'],
      preferred_locations: ['New York', 'California'],
      height_range: '160-180',
      is_demo: true
    };
    
    const { error: insertError } = await supabase
      .from('match_preferences')
      .upsert(testData);
    
    if (insertError) {
      console.error('Error inserting test data:', insertError);
      
      // Try to identify which column is causing the issue
      console.log('\nTrying to identify the problematic column...');
      
      // Try inserting with just id and a simple field
      const { error: minimalError } = await supabase
        .from('match_preferences')
        .upsert({
          id: '00000000-0000-0000-0000-000000000000',
          height_range: '160-180'
        });
      
      if (minimalError) {
        console.error('Error with minimal insert:', minimalError);
      } else {
        console.log('Minimal insert succeeded with just id and height_range');
      }
      
      // Try each field individually
      const fields = ['preferred_ethnicities', 'preferred_locations', 'is_demo'];
      
      for (const field of fields) {
        const testObj = {
          id: '00000000-0000-0000-0000-000000000000',
          [field]: testData[field]
        };
        
        console.log(`Testing field: ${field}`);
        const { error: fieldError } = await supabase
          .from('match_preferences')
          .upsert(testObj);
        
        if (fieldError) {
          console.error(`Error with field ${field}:`, fieldError);
        } else {
          console.log(`Field ${field} is valid`);
        }
      }
    } else {
      console.log('Test insert succeeded with all fields');
    }
    
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}

checkMatchPreferencesColumns().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
