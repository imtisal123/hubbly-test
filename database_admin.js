/**
 * Database Administration Utility
 * This module provides high-level functions for database administration tasks
 */
const { supabaseAdmin } = require('./lib/supabaseClient');

/**
 * List all tables in the public schema
 * @returns {Promise<Array>} List of table names
 */
async function listTables() {
  try {
    const { data, error } = await supabaseAdmin.rpc('list_tables');
    
    if (error) {
      console.error('Error listing tables:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error listing tables:', error);
    return [];
  }
}

/**
 * Get information about a table's columns
 * @param {string} tableName - The name of the table
 * @returns {Promise<Array>} List of column information
 */
async function getTableInfo(tableName) {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_table_info', { target_table: tableName });
    
    if (error) {
      console.error(`Error getting info for table ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Unexpected error getting info for table ${tableName}:`, error);
    return [];
  }
}

/**
 * Execute a raw SQL query
 * @param {string} query - The SQL query to execute
 * @returns {Promise<Object>} Result of the query
 */
async function executeSQL(query) {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', { query });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error executing SQL:', error);
    return { success: false, error };
  }
}

/**
 * Create a new table
 * @param {string} tableName - The name of the table to create
 * @param {string} tableDefinition - The table definition (e.g., "(id SERIAL PRIMARY KEY, name TEXT)")
 * @returns {Promise<Object>} Result of the operation
 */
async function createTable(tableName, tableDefinition) {
  try {
    const { data, error } = await supabaseAdmin.rpc('create_table', { 
      table_name: tableName, 
      table_definition: tableDefinition 
    });
    
    if (error) {
      console.error(`Error creating table ${tableName}:`, error);
      return { success: false, error };
    }
    
    return { success: true, message: `Table ${tableName} created successfully` };
  } catch (error) {
    console.error(`Unexpected error creating table ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Add a column to a table
 * @param {string} tableName - The name of the table
 * @param {string} columnName - The name of the column to add
 * @param {string} columnType - The data type of the column
 * @returns {Promise<Object>} Result of the operation
 */
async function addColumn(tableName, columnName, columnType) {
  try {
    const { data, error } = await supabaseAdmin.rpc('add_column', { 
      table_name: tableName, 
      column_name: columnName, 
      column_type: columnType 
    });
    
    if (error) {
      console.error(`Error adding column ${columnName} to table ${tableName}:`, error);
      return { success: false, error };
    }
    
    return { success: true, message: `Column ${columnName} added to table ${tableName} successfully` };
  } catch (error) {
    console.error(`Unexpected error adding column ${columnName} to table ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Create an RLS policy
 * @param {string} policyName - The name of the policy
 * @param {string} tableName - The table to apply the policy to
 * @param {string} policyDefinition - The policy definition (e.g., "FOR ALL USING (true)")
 * @returns {Promise<Object>} Result of the operation
 */
async function createPolicy(policyName, tableName, policyDefinition) {
  try {
    const { data, error } = await supabaseAdmin.rpc('create_policy', { 
      policy_name: policyName, 
      table_name: tableName, 
      policy_definition: policyDefinition 
    });
    
    if (error) {
      console.error(`Error creating policy ${policyName} on table ${tableName}:`, error);
      return { success: false, error };
    }
    
    return { success: true, message: `Policy ${policyName} created on table ${tableName} successfully` };
  } catch (error) {
    console.error(`Unexpected error creating policy ${policyName} on table ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Create a complete demo table with all necessary columns and policies
 * @param {string} tableName - The name of the table to create
 * @param {Object} columns - Object mapping column names to their types
 * @returns {Promise<Object>} Result of the operation
 */
async function createDemoTable(tableName, columns) {
  try {
    // Build the table definition
    let tableDefinition = "(";
    const columnEntries = Object.entries(columns);
    
    columnEntries.forEach(([columnName, columnType], index) => {
      tableDefinition += `${columnName} ${columnType}`;
      if (index < columnEntries.length - 1) {
        tableDefinition += ", ";
      }
    });
    
    tableDefinition += ")";
    
    // Create the table
    const createResult = await createTable(tableName, tableDefinition);
    if (!createResult.success) {
      return createResult;
    }
    
    // Enable RLS
    const rlsResult = await executeSQL(`ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`);
    if (!rlsResult.success) {
      return rlsResult;
    }
    
    // Create a policy for full access
    const policyResult = await createPolicy(
      `Allow full access to ${tableName}`,
      tableName,
      "FOR ALL USING (true)"
    );
    
    return { 
      success: true, 
      message: `Table ${tableName} created successfully with RLS and policies` 
    };
  } catch (error) {
    console.error(`Unexpected error creating demo table ${tableName}:`, error);
    return { success: false, error };
  }
}

module.exports = {
  listTables,
  getTableInfo,
  executeSQL,
  createTable,
  addColumn,
  createPolicy,
  createDemoTable
};
