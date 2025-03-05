/**
 * Script to execute the complete schema update SQL
 */
const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../lib/supabaseClient');

async function executeCompleteSchemaUpdate() {
  try {
    console.log('Executing complete schema update...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'complete_schema_update.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabaseAdmin.rpc('execute_sql', {
      sql: sqlContent
    });
    
    if (error) {
      console.error('Error executing schema update:', error);
      
      // Try with smaller chunks if the SQL is too large
      console.log('Trying to execute SQL in smaller chunks...');
      const sqlStatements = sqlContent.split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      console.log(`Found ${sqlStatements.length} SQL statements to execute`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i] + ';';
        console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
        
        const { error: stmtError } = await supabaseAdmin.rpc('execute_sql', {
          sql: statement
        });
        
        if (stmtError) {
          console.error(`Error executing statement ${i + 1}:`, stmtError);
          failCount++;
        } else {
          console.log(`Successfully executed statement ${i + 1}`);
          successCount++;
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`Schema update completed with ${successCount} successful statements and ${failCount} failed statements`);
    } else {
      console.log('Successfully executed complete schema update');
    }
    
  } catch (error) {
    console.error('Unhandled error in executeCompleteSchemaUpdate:', error);
  }
}

executeCompleteSchemaUpdate().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
