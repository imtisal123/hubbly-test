# Database Setup Instructions

This document provides instructions for setting up the database for the Hubbly app.

## Current Issues

We've identified several issues with the database setup:

1. **Row-Level Security (RLS) Policy Violations**: The application cannot insert or update data in the profiles table due to RLS policies.
2. **Missing Tables**: Some required tables like `family_details` may not exist.
3. **Missing Columns**: Some required columns in the profiles table may not exist.
4. **Invalid Service Role Key**: The service role key is not working, so we're using the anon key for all operations.

## Solution Steps

### 1. Run SQL Commands to Create RPC Functions

To bypass RLS policies, you need to create RPC functions that can insert and update data in the profiles table. We've created a SQL file with all the necessary functions:

```bash
# Open the SQL file in your editor
open /Users/imtisalq/hubbly-app/create_rpc_functions.sql
```

Then, copy the contents of this file and run them in the Supabase dashboard SQL editor.

### 2. Run SQL Commands to Create Missing Tables

If you're seeing errors about missing tables, run the following SQL commands in the Supabase dashboard:

```sql
-- Create family_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.family_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_environment TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own family details
CREATE POLICY "Users can view own family details" ON public.family_details
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own family details
CREATE POLICY "Users can update own family details" ON public.family_details
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own family details
CREATE POLICY "Users can insert own family details" ON public.family_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own family details
CREATE POLICY "Users can delete own family details" ON public.family_details
  FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_details TO authenticated;
GRANT SELECT, INSERT ON public.family_details TO anon;
```

### 3. Run SQL Commands to Add Missing Columns

If you're seeing errors about missing columns, run the following SQL commands in the Supabase dashboard:

```sql
-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_children BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS number_of_children INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religion TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS islamic_sect TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS other_sect TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_head BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_head_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_income TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
```

### 4. Get a New Service Role Key

The current service role key is not working. To get a new one:

1. Go to the Supabase dashboard
2. Navigate to Project Settings > API
3. Copy the `service_role` key
4. Update the `.env` file with the new key:

```
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
```

## Testing the Setup

After completing the above steps, you can test the database setup by running:

```bash
node testDemoProfile.js
```

This will attempt to create a demo profile and save it to the database. If everything is set up correctly, you should see success messages in the console.

## Troubleshooting

If you're still seeing errors:

1. **Check the Supabase Dashboard**: Look for any error messages or warnings in the SQL editor or logs.
2. **Verify Table Existence**: Make sure all required tables exist.
3. **Verify Column Existence**: Make sure all required columns exist in each table.
4. **Check RLS Policies**: Make sure the RLS policies are set up correctly.
5. **Check API Keys**: Make sure the API keys are correct and have the necessary permissions.

## Next Steps

Once the database is set up correctly, you can continue with the application development. The code has been updated to handle missing tables and columns gracefully, providing clear error messages and instructions for fixing any issues.
