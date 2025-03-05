/**
 * Script to execute the remove_unused_columns.sql file against the Supabase database
 */
const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../lib/supabaseClient');

async function executeRemoveUnusedColumns() {
  try {
    console.log('Reading SQL file...');
    const sqlFilePath = path.join(__dirname, 'remove_unused_columns.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into individual statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Executing ${statements.length} SQL statements to remove unused columns...`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim() + ';';
      console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      try {
        const { error } = await supabaseAdmin.rpc('execute_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
        } else {
          console.log(`Successfully executed statement ${i + 1}`);
        }
      } catch (stmtError) {
        console.error(`Exception executing statement ${i + 1}:`, stmtError);
      }
    }
    
    console.log('Finished executing SQL statements!');
  } catch (error) {
    console.error('Error in executeRemoveUnusedColumns:', error);
  }
}

// Execute the function
executeRemoveUnusedColumns();
