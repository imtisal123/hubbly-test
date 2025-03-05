/**
 * Script to execute SQL via the pg client
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function executeSql() {
  try {
    console.log('Executing SQL via pg client...');
    
    // Get database connection details
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.niHWhg6zZRb9CNYah9uWZobu-btirSK_lSxcvlwgn6c';
    
    // Extract the host from the URL
    const host = new URL(supabaseUrl).hostname;
    const database = 'postgres';
    const port = 5432;
    const user = 'postgres';
    const password = supabaseKey;
    
    // Create a connection pool
    const pool = new Pool({
      host,
      database,
      port,
      user,
      password,
      ssl: true
    });
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'complete_schema_update.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const sqlStatements = sqlContent.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${sqlStatements.length} SQL statements to execute`);
    
    // Connect to the database
    const client = await pool.connect();
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      // Execute each statement
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i] + ';';
        console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
        
        try {
          await client.query(statement);
          console.log(`Successfully executed statement ${i + 1}`);
          successCount++;
        } catch (error) {
          console.error(`Error executing statement ${i + 1}:`, error.message);
          failCount++;
        }
      }
      
      console.log(`Schema update completed with ${successCount} successful statements and ${failCount} failed statements`);
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
    // Close the pool
    await pool.end();
    
  } catch (error) {
    console.error('Unhandled error in executeSql:', error);
  }
}

// Check if pg module is installed
try {
  require('pg');
  executeSql().catch(error => {
    console.error('Script execution failed:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('pg module is not installed. Please install it with: npm install pg');
  console.log('Alternatively, you can copy the SQL file and execute it directly in the Supabase dashboard SQL editor.');
  process.exit(1);
}
