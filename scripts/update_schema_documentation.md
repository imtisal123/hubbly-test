# Schema Update Documentation

## Removed Unused Columns and Tables - 2025-03-02

We've removed database columns and tables that don't have corresponding screen fields to streamline the database schema and improve maintainability. The following columns and tables were removed:

### Profiles Table
- `first_name` - Only collecting full `name`, not separate first/last
- `last_name` - Only collecting full `name`, not separate first/last
- `email` - Not collected in profile screens
- `phone` - Not collected in profile screens

### Personal Details Table
- `body_type` - Not collected in any screen
- `hair_color` - Not collected in any screen
- `eye_color` - Not collected in any screen

### Match Preferences Table
- `min_age` - Only collecting `ageRange` as a single field (e.g., "25-30")
- `max_age` - Only collecting `ageRange` as a single field (e.g., "25-30")

### Family Details Table
- `family_values` - Only collecting `familyEnvironment`, not specific values
- `living_with_family` - Not directly collected
- `willing_to_relocate` - Collected as `openToMovingCity`/`openToMovingCountry` but not saved to this table
- `parents_born_in` - Not directly collected
- `siblings_count` - Not directly collected in family details screen
- `father_name` - Collected in separate screens but not saved to this table
- `father_occupation` - Collected in separate screens but not saved to this table
- `father_ethnicity` - Collected in separate screens but not saved to this table
- `mother_name` - Collected in separate screens but not saved to this table
- `mother_occupation` - Collected in separate screens but not saved to this table
- `mother_ethnicity` - Collected in separate screens but not saved to this table
- `family_religiosity` - Not collected in family details screen
- `family_description` - Only collects `additionalInfo`, not specifically family description

### Parents Table
- `father_living` - Not directly collected
- `mother_living` - Not directly collected
- `parents_marital_status` - Not directly collected
- `name` - Not collected in parent screens

### Siblings Table
- `name` - Not collected in sibling screens

### Demo Parents Table
- `name` - Not collected in demo parent screens

### Demo Siblings Table
- `name` - Not collected in demo sibling screens

### Removed Tables
The following tables were completely removed as they don't correspond to any screens in the app:
- `personal_details` - No corresponding screen collecting this information
- `demo_personal_details` - Demo version of the above
- `religious_details` - No corresponding screen collecting this information
- `demo_religious_details` - Demo version of the above

The same columns were also removed from the corresponding demo tables.

## How to Apply This Change

To apply this change to your local or production database:

1. Use the Supabase dashboard to run the migration file:
   - Go to the SQL Editor
   - Open the file `/supabase/migrations/20250302_remove_unused_columns.sql`
   - Run the SQL

2. Or, if you have direct database access:
   - Run the SQL file directly using psql or another PostgreSQL client

## Impact

This change simplifies the database schema to match the actual data being collected in the app's screens. It reduces database bloat and makes the schema more maintainable.

Note that we've kept the system fields (`created_at` and `updated_at`) as they're standard database fields used for tracking record creation and modification times.
