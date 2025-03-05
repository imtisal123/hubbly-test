# Supabase Administration Guide for Hubbly App

This guide explains how to use the administrative functions we've set up to manage the Supabase database directly from JavaScript code.

## Setup

We've created a set of PostgreSQL functions that allow executing administrative tasks with elevated permissions:

1. **execute_sql**: Execute any SQL query
2. **create_table**: Create a new table
3. **add_column**: Add a column to an existing table
4. **create_policy**: Create an RLS policy
5. **get_table_info**: Get information about a table's columns
6. **list_tables**: List all tables in the public schema

These functions are defined in `create_admin_functions.sql` and can be executed in the Supabase SQL Editor.

## JavaScript Interface

We've also created a JavaScript interface in `database_admin.js` that provides high-level functions for database administration:

```javascript
const {
  listTables,
  getTableInfo,
  executeSQL,
  createTable,
  addColumn,
  createPolicy,
  createDemoTable
} = require('./database_admin');
```

## Usage Examples

### List All Tables

```javascript
const tables = await listTables();
console.log(`Found ${tables.length} tables:`);
tables.forEach(table => console.log(`- ${table.table_name}`));
```

### Get Table Information

```javascript
const tableInfo = await getTableInfo('demo_profiles');
console.log(`Found ${tableInfo.length} columns:`);
tableInfo.forEach(column => {
  console.log(`- ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
});
```

### Execute Raw SQL

```javascript
const result = await executeSQL(`
  ALTER TABLE public.demo_profiles 
  ADD COLUMN IF NOT EXISTS new_column TEXT;
`);

if (result.success) {
  console.log('SQL executed successfully');
} else {
  console.error('Error executing SQL:', result.error);
}
```

### Create a Table

```javascript
const createResult = await createTable(
  'new_table',
  '(id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT now())'
);

if (createResult.success) {
  console.log('Table created successfully');
} else {
  console.error('Failed to create table:', createResult.error);
}
```

### Add a Column

```javascript
const addColumnResult = await addColumn('existing_table', 'new_column', 'TEXT');

if (addColumnResult.success) {
  console.log('Column added successfully');
} else {
  console.error('Failed to add column:', addColumnResult.error);
}
```

### Create an RLS Policy

```javascript
const policyResult = await createPolicy(
  'allow_read_policy',
  'my_table',
  'FOR SELECT USING (true)'
);

if (policyResult.success) {
  console.log('Policy created successfully');
} else {
  console.error('Failed to create policy:', policyResult.error);
}
```

### Create a Complete Demo Table

```javascript
const demoTableResult = await createDemoTable('new_demo_table', {
  'id': 'UUID PRIMARY KEY',
  'name': 'TEXT',
  'age': 'INTEGER',
  'is_active': 'BOOLEAN DEFAULT true',
  'created_at': 'TIMESTAMP WITH TIME ZONE DEFAULT now()'
});

if (demoTableResult.success) {
  console.log('Demo table created successfully');
} else {
  console.error('Failed to create demo table:', demoTableResult.error);
}
```

## Security Considerations

These functions are designed to be used with the `supabaseAdmin` client, which has elevated permissions. Be careful when using these functions, as they can modify your database schema and potentially cause data loss if used incorrectly.

The PostgreSQL functions are created with `SECURITY DEFINER`, which means they run with the permissions of the user who created them, not the user who calls them. This allows the functions to perform actions that would otherwise be restricted.

## Troubleshooting

If you encounter errors when using these functions, check the following:

1. Make sure the PostgreSQL functions are created correctly by running `create_admin_functions.sql` in the Supabase SQL Editor.
2. Verify that the `supabaseAdmin` client is configured correctly with the service role key.
3. Check that the user who created the PostgreSQL functions has the necessary permissions to perform the requested actions.

## Limitations

1. These functions provide a subset of administrative capabilities. For more complex operations, you may still need to use the Supabase dashboard.
2. The functions are designed for use with the `public` schema. If you need to work with other schemas, you'll need to modify the functions accordingly.
3. Some operations, like creating extensions or modifying the database structure itself, may still require direct access to the Supabase dashboard.
