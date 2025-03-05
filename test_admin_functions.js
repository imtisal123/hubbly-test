/**
 * Test script for database administration functions
 */
const {
  listTables,
  getTableInfo,
  executeSQL,
  createTable,
  addColumn,
  createPolicy,
  createDemoTable
} = require('./database_admin');

async function runTests() {
  console.log('==========================================');
  console.log('Testing Database Administration Functions');
  console.log('==========================================\n');

  try {
    // First, we need to create the admin functions in the database
    console.log('1. Creating admin functions in the database...');
    const fs = require('fs');
    const path = require('path');
    const adminFunctionsSQL = fs.readFileSync(path.join(__dirname, 'create_admin_functions.sql'), 'utf8');
    
    // Use the raw supabaseAdmin client to execute the SQL directly
    const { supabaseAdmin } = require('./lib/supabaseClient');
    const { error: createFunctionsError } = await supabaseAdmin.rpc('execute_sql', { 
      query: adminFunctionsSQL 
    });
    
    if (createFunctionsError) {
      console.error('Error creating admin functions:', createFunctionsError);
      return;
    }
    
    console.log('Admin functions created successfully\n');

    // Test listing tables
    console.log('2. Listing all tables...');
    const tables = await listTables();
    console.log(`Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`- ${table.table_name}`));
    console.log();

    // Test getting table info
    if (tables.length > 0) {
      const sampleTable = tables[0].table_name;
      console.log(`3. Getting info for table "${sampleTable}"...`);
      const tableInfo = await getTableInfo(sampleTable);
      console.log(`Found ${tableInfo.length} columns:`);
      tableInfo.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
      console.log();
    }

    // Test creating a test table
    const testTableName = 'test_admin_table';
    console.log(`4. Creating test table "${testTableName}"...`);
    const createResult = await createTable(
      testTableName,
      '(id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())'
    );
    
    if (createResult.success) {
      console.log(`Table ${testTableName} created successfully`);
    } else {
      console.error(`Failed to create table ${testTableName}:`, createResult.error);
    }
    console.log();

    // Test adding a column
    console.log(`5. Adding column to "${testTableName}"...`);
    const addColumnResult = await addColumn(testTableName, 'description', 'TEXT');
    
    if (addColumnResult.success) {
      console.log(`Column "description" added to ${testTableName} successfully`);
    } else {
      console.error(`Failed to add column to ${testTableName}:`, addColumnResult.error);
    }
    console.log();

    // Test creating a policy
    console.log(`6. Creating RLS policy on "${testTableName}"...`);
    const policyResult = await createPolicy(
      `allow_all_${testTableName}`,
      testTableName,
      'FOR ALL USING (true)'
    );
    
    if (policyResult.success) {
      console.log(`Policy created on ${testTableName} successfully`);
    } else {
      console.error(`Failed to create policy on ${testTableName}:`, policyResult.error);
    }
    console.log();

    // Test creating a complete demo table
    const demoTableName = 'test_demo_complete';
    console.log(`7. Creating complete demo table "${demoTableName}"...`);
    const demoTableResult = await createDemoTable(demoTableName, {
      'id': 'UUID PRIMARY KEY',
      'name': 'TEXT',
      'age': 'INTEGER',
      'is_active': 'BOOLEAN DEFAULT true',
      'created_at': 'TIMESTAMP WITH TIME ZONE DEFAULT now()'
    });
    
    if (demoTableResult.success) {
      console.log(`Demo table ${demoTableName} created successfully`);
    } else {
      console.error(`Failed to create demo table ${demoTableName}:`, demoTableResult.error);
    }
    console.log();

    // Clean up test tables
    console.log('8. Cleaning up test tables...');
    const dropResult = await executeSQL(`
      DROP TABLE IF EXISTS ${testTableName};
      DROP TABLE IF EXISTS ${demoTableName};
    `);
    
    if (dropResult.success) {
      console.log('Test tables cleaned up successfully');
    } else {
      console.error('Failed to clean up test tables:', dropResult.error);
    }

    console.log('\n==========================================');
    console.log('All tests completed!');
    console.log('==========================================');
  } catch (error) {
    console.error('Unexpected error during tests:', error);
  }
}

// Run the tests
runTests()
  .catch(error => console.error('Error in runTests:', error))
  .finally(() => {
    // Exit after a short delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
