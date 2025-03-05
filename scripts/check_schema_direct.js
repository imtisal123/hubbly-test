/**
 * Script to check the schema of tables directly using SQL
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check if match_preferences table exists and its columns
    const { data: matchPrefData, error: matchPrefError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'match_preferences'
      `
    });
    
    if (matchPrefError) {
      console.error('Error checking match_preferences schema:', matchPrefError);
    } else {
      console.log('Match preferences table columns:');
      if (matchPrefData && matchPrefData.length > 0) {
        matchPrefData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log('No columns found in match_preferences table');
      }
    }
    
    // Check if religious_details table exists and its columns
    const { data: religiousData, error: religiousError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'religious_details'
      `
    });
    
    if (religiousError) {
      console.error('Error checking religious_details schema:', religiousError);
    } else {
      console.log('\nReligious details table columns:');
      if (religiousData && religiousData.length > 0) {
        religiousData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log('No columns found in religious_details table');
      }
    }
    
    // Check if personal_details table exists and its columns
    const { data: personalData, error: personalError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'personal_details'
      `
    });
    
    if (personalError) {
      console.error('Error checking personal_details schema:', personalError);
    } else {
      console.log('\nPersonal details table columns:');
      if (personalData && personalData.length > 0) {
        personalData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log('No columns found in personal_details table');
      }
    }
    
    // Check if family_details table exists and its columns
    const { data: familyData, error: familyError } = await supabaseAdmin.rpc('execute_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'family_details'
      `
    });
    
    if (familyError) {
      console.error('Error checking family_details schema:', familyError);
    } else {
      console.log('\nFamily details table columns:');
      if (familyData && familyData.length > 0) {
        familyData.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
      } else {
        console.log('No columns found in family_details table');
      }
    }
    
  } catch (error) {
    console.error('Unhandled error in checkSchema:', error);
  }
}

checkSchema().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
