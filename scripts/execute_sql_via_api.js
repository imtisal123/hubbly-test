/**
 * Script to execute SQL via the Supabase SQL API
 */
const fs = require('fs');
const path = require('path');

async function executeSql() {
  try {
    console.log('Executing SQL via Supabase SQL API...');
    
    // Get Supabase credentials
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.niHWhg6zZRb9CNYah9uWZobu-btirSK_lSxcvlwgn6c';
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'complete_schema_update.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL using the SQL API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Could not parse error response', status: response.status };
      }
      console.error('Error executing SQL:', errorData);
      
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
        
        try {
          const stmtResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              query: statement
            })
          });
          
          if (!stmtResponse.ok) {
            let stmtErrorData;
            try {
              stmtErrorData = await stmtResponse.json();
            } catch (e) {
              stmtErrorData = { message: 'Could not parse error response', status: stmtResponse.status };
            }
            console.error(`Error executing statement ${i + 1}:`, stmtErrorData);
            failCount++;
          } else {
            console.log(`Successfully executed statement ${i + 1}`);
            successCount++;
          }
        } catch (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          failCount++;
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`Schema update completed with ${successCount} successful statements and ${failCount} failed statements`);
    } else {
      console.log('Successfully executed SQL');
    }
    
  } catch (error) {
    console.error('Unhandled error in executeSql:', error);
  }
}

executeSql().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
