# Demo Tables Setup Instructions

This document provides instructions for setting up and maintaining the demo tables in the Hubbly app.

## Overview

The demo tables are separate from the regular tables and don't have foreign key constraints to `auth.users`. This allows demo profiles to be created without requiring auth users.

## Setup Steps

### 1. Create the Demo Tables

Run the SQL script in the Supabase SQL Editor:

```sql
-- Copy and paste the contents of create_demo_tables.sql here
```

This script will:
- Create all necessary demo tables with the correct columns
- Set up RLS policies to allow access to the demo data

### 2. Create the Execute SQL Function (Optional)

If you want to be able to modify the database schema from JavaScript code:

```sql
-- Copy and paste the contents of create_execute_sql_function.sql here
```

This function allows executing arbitrary SQL from JavaScript code with appropriate permissions.

### 3. Add Missing Columns (If Needed)

If you encounter errors about missing columns, run:

```sql
-- Copy and paste the contents of add_missing_columns.sql here
```

## Table Structure

The demo system consists of the following tables:

1. **demo_profiles**: Main profile information
2. **demo_match_preferences**: Match preferences for demo profiles
3. **demo_family_details**: Family environment information
4. **demo_parents**: Parent information for demo profiles
5. **demo_siblings**: Sibling information for demo profiles

## Column Descriptions

### demo_profiles
- `id`: UUID primary key
- `name`: Profile name
- `date_of_birth`: Date of birth
- `gender`: Gender
- `height`: Height in cm
- `ethnicity`: Ethnicity
- `location`: Location (city, country)
- `nationality`: Nationality
- `education_level`: Education level
- `university`: University name
- `occupation`: Occupation
- `company`: Company name
- `profile_pic_url`: URL to profile picture
- `marital_status`: Marital status
- `has_children`: Boolean indicating if they have children
- `number_of_children`: Number of children
- `religion`: Religion
- `islamic_sect`: Islamic sect
- `other_sect`: Other sect if applicable
- `cover_head`: Boolean indicating if they cover their head
- `cover_head_type`: Type of head covering
- `monthly_income`: Monthly income range
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### demo_match_preferences
- `id`: Serial primary key
- `profile_id`: Reference to demo_profiles.id
- `min_age`: Minimum age preference
- `max_age`: Maximum age preference
- `preferred_ethnicities`: Array of preferred ethnicities
- `preferred_locations`: Array of preferred locations
- `height_range`: Array of min and max height preferences
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### demo_family_details
- `id`: Serial primary key
- `profile_id`: Reference to demo_profiles.id
- `family_environment`: Description of family environment
- `additional_info`: Additional family information
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### demo_parents
- `id`: Serial primary key
- `profile_id`: Reference to demo_profiles.id
- `name`: Parent name
- `relationship`: Relationship (e.g., "Father", "Mother")
- `ethnicity`: Parent's ethnicity
- `nationality`: Parent's nationality
- `religion`: Parent's religion
- `occupation`: Parent's occupation
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### demo_siblings
- `id`: Serial primary key
- `profile_id`: Reference to demo_profiles.id
- `name`: Sibling name
- `age`: Sibling age
- `gender`: Sibling gender
- `marital_status`: Sibling marital status
- `profile_pic_url`: URL to sibling profile picture
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Troubleshooting

If you encounter errors about missing columns:

1. Check the error message to identify which columns are missing
2. Use the SQL Editor to add the missing columns:
   ```sql
   ALTER TABLE [table_name] ADD COLUMN IF NOT EXISTS [column_name] [data_type];
   ```
3. Verify the column was added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = '[table_name]';
   ```
