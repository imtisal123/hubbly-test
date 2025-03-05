# Database Schema Update Instructions

We've created a comprehensive SQL script to update the database schema for the Hubbly app. Due to limitations in executing SQL commands programmatically, you'll need to run this script directly in the Supabase dashboard.

## Steps to Update the Database Schema

1. Go to the Supabase dashboard for your project
2. Navigate to the SQL Editor
3. Copy and paste the contents of the `complete_schema_update.sql` file
4. Execute the SQL commands
5. Verify that the tables have been created successfully

## What the SQL Script Does

The `complete_schema_update.sql` script will:

1. Create the missing `religious_details` and `personal_details` tables
2. Create the `match_preferences` and `family_details` tables if they don't exist
3. Create corresponding demo tables for unauthenticated users
4. Add the `is_demo` column to existing tables if needed
5. Set up proper Row Level Security (RLS) policies for all tables

## After Updating the Schema

After updating the schema, you can run the `create_test_admin_profiles_with_all_data.js` script to create test admin profiles and verify that data is saved correctly to all tables:

```bash
node scripts/create_test_admin_profiles_with_all_data.js
```

## Troubleshooting

If you encounter any issues with the schema update, you can use the `check_profiles_schema.js` and `check_match_preferences_schema.js` scripts to check the current schema of the tables:

```bash
node scripts/check_profiles_schema.js
node scripts/check_match_preferences_schema.js
```

These scripts will display the available columns in the tables and help identify any missing columns or tables.
