# Database Setup for Hubbly App

This document provides instructions for setting up the database schema required by the Hubbly app.

## Required Tables

The app requires the following tables to be present in the Supabase database:

1. `profiles` - Stores user profile information
2. `match_preferences` - Stores user matching preferences
3. `parents` - Stores information about a user's parents
4. `siblings` - Stores information about a user's siblings
5. `family_details` - Stores additional family information

## Setup Instructions

### Option 1: Using the SQL Editor in Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the file `supabase/migrations/20250228_complete_schema.sql`
4. Paste it into the SQL Editor and run the query
5. This will create all necessary tables and columns

### Option 2: Using the Database Setup in the App

The app includes automatic database setup functionality that will attempt to create missing tables and columns when it starts. This is implemented in `lib/databaseSetup.js`.

However, this method may not work if your Supabase permissions are restricted. In that case, use Option 1.

## Verifying the Setup

You can verify that the database is set up correctly by running:

```
node testDatabaseSetup.js
```

This will check if all required tables exist and report any issues.

## Troubleshooting

If you encounter errors related to missing tables or columns, try the following:

1. Check the Supabase dashboard to verify that the tables were created
2. Run the SQL script manually using Option 1 above
3. Check the app logs for specific error messages

Common errors include:

- `relation "public.family_details" does not exist` - The family_details table is missing
- `column "cover_head" does not exist` - A required column is missing
- `function public.exec_sql(sql) does not exist` - The helper function is missing

## Database Schema

### profiles
- `id` (UUID, PRIMARY KEY)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `name` (TEXT)
- `date_of_birth` (DATE)
- `gender` (TEXT)
- `height` (NUMERIC)
- `ethnicity` (TEXT)
- `location` (TEXT)
- `nationality` (TEXT)
- `education_level` (TEXT)
- `university` (TEXT)
- `occupation` (TEXT)
- `company` (TEXT)
- `profile_pic_url` (TEXT)
- `marital_status` (TEXT)
- `has_children` (BOOLEAN)
- `number_of_children` (INTEGER)
- `religion` (TEXT)
- `islamic_sect` (TEXT)
- `other_sect` (TEXT)
- `cover_head` (TEXT)
- `cover_head_type` (TEXT)
- `monthly_income` (TEXT)
- `is_demo` (BOOLEAN)

### match_preferences
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, FOREIGN KEY to profiles.id)
- `min_age` (INTEGER)
- `max_age` (INTEGER)
- `preferred_ethnicities` (TEXT[])
- `preferred_locations` (TEXT[])
- `preferred_education_levels` (TEXT[])
- `height_range` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### parents
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, FOREIGN KEY to profiles.id)
- `type` (TEXT) - 'father' or 'mother'
- `name` (TEXT)
- `alive` (BOOLEAN)
- `marital_status` (TEXT)
- `city_of_residence` (TEXT)
- `area_of_residence` (TEXT)
- `profile_pic_url` (TEXT)
- `education_level` (TEXT)
- `occupation` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### siblings
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, FOREIGN KEY to profiles.id)
- `name` (TEXT)
- `gender` (TEXT)
- `marital_status` (TEXT)
- `education_level` (TEXT)
- `occupation` (TEXT)
- `profile_pic_url` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)

### family_details
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, FOREIGN KEY to profiles.id)
- `family_environment` (TEXT)
- `additional_info` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE)
