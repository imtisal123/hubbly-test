# Supabase Setup Guide

This guide will help you set up your Supabase project and get it working with your Hubbly app.

## Step 1: Get Your API Key

1. Go to [Supabase](https://app.supabase.io) and sign in to your account
2. Select your project (or create a new one if you haven't already)
3. In the left sidebar, click on "Project Settings"
4. Click on "API" in the settings menu
5. You'll see two API keys:
   - `anon` / `public`: This is for client-side code
   - `service_role`: This has more permissions and is for server-side code

6. Copy the `anon` / `public` key (it should start with "eyJ...")

## Step 2: Update Your API Key in the App

1. Open the file `/Users/imtisalq/hubbly-app/lib/supabaseClient.js`
2. Replace the existing API key with your new one:

```javascript
const supabaseKey = 'YOUR_NEW_API_KEY_HERE';
```

3. Save the file

## Step 3: Create Tables in Supabase Dashboard

Since the script is having issues, you can create the tables directly in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left sidebar
3. Click "Create a new table"

### Create Profiles Table
- Table Name: `profiles`
- Columns:
  - `id` (type: uuid, primary key, references auth.users.id)
  - `name` (type: text)
  - `gender` (type: text)
  - `date_of_birth` (type: date)
  - `height` (type: integer)
  - `ethnicity` (type: text)
  - `location` (type: text)
  - `nationality` (type: text)
  - `education_level` (type: text)
  - `university` (type: text)
  - `occupation` (type: text)
  - `company` (type: text)
  - `profile_pic_url` (type: text)
  - `created_at` (type: timestamp with time zone, default: now())
  - `updated_at` (type: timestamp with time zone, default: now())

### Create Parents Table
- Table Name: `parents`
- Columns:
  - `id` (type: uuid, primary key, default: uuid_generate_v4())
  - `user_id` (type: uuid, references profiles.id)
  - `type` (type: text)
  - `name` (type: text)
  - `date_of_birth` (type: date)
  - `ethnicity` (type: text)
  - `nationality` (type: text)
  - `education_level` (type: text)
  - `occupation` (type: text)
  - `profile_pic_url` (type: text)
  - `created_at` (type: timestamp with time zone, default: now())
  - `updated_at` (type: timestamp with time zone, default: now())

### Create Siblings Table
- Table Name: `siblings`
- Columns:
  - `id` (type: uuid, primary key, default: uuid_generate_v4())
  - `user_id` (type: uuid, references profiles.id)
  - `name` (type: text)
  - `gender` (type: text)
  - `date_of_birth` (type: date)
  - `education_level` (type: text)
  - `occupation` (type: text)
  - `marital_status` (type: text)
  - `profile_pic_url` (type: text)
  - `created_at` (type: timestamp with time zone, default: now())
  - `updated_at` (type: timestamp with time zone, default: now())

### Create Match Preferences Table
- Table Name: `match_preferences`
- Columns:
  - `id` (type: uuid, primary key, default: uuid_generate_v4())
  - `user_id` (type: uuid, references profiles.id)
  - `min_age` (type: integer)
  - `max_age` (type: integer)
  - `preferred_ethnicities` (type: text[])
  - `preferred_locations` (type: text[])
  - `preferred_education_levels` (type: text[])
  - `created_at` (type: timestamp with time zone, default: now())
  - `updated_at` (type: timestamp with time zone, default: now())

## Step 4: Set Up Storage for Profile Pictures

1. Go to your Supabase project dashboard
2. Click on "Storage" in the left sidebar
3. Click "Create a new bucket"
4. Name it `profile_pictures`
5. Set the privacy to "Public"
6. Click "Create bucket"

## Step 5: Test Your App

After completing these steps, your app should be able to connect to Supabase and use all the features we've implemented!
