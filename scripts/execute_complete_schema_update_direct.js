/**
 * Script to execute the complete schema update SQL using direct REST API calls
 */
const fs = require('fs');
const path = require('path');

async function executeCompleteSchemaUpdate() {
  try {
    console.log('Executing complete schema update using direct REST API calls...');
    
    // Get Supabase credentials
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.niHWhg6zZRb9CNYah9uWZobu-btirSK_lSxcvlwgn6c';
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'complete_schema_update.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const sqlStatements = sqlContent.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${sqlStatements.length} SQL statements to execute`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Execute each statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
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
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { message: 'Could not parse error response' };
          }
          console.error(`Error executing statement ${i + 1}:`, errorData);
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
    
  } catch (error) {
    console.error('Unhandled error in executeCompleteSchemaUpdate:', error);
  }
}

executeCompleteSchemaUpdate().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
