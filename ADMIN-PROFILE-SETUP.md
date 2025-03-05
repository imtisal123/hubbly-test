# Admin Profile Setup Guide

This guide will walk you through setting up an admin test profile in your Supabase project.

## Step 1: Create Admin User

1. Go to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project
3. Click on "Authentication" in the left sidebar
4. Click on "Users" tab
5. Click "Invite user"
6. Enter the following details:
   - Email: admin_test@hubbly.app
   - Password: admin123
7. Click "Invite"
8. After the user is created, click on the user to view their details
9. Copy the "User UID" (it looks like a UUID, e.g., 123e4567-e89b-12d3-a456-426614174000)

## Step 2: Update SQL Script with User ID

1. Open the file `/Users/imtisalq/hubbly-app/scripts/create_admin_profile.sql`
2. Replace all instances of `'00000000-0000-0000-0000-000000000000'` with the actual User UID you copied, including the single quotes
3. Save the file

## Step 3: Run SQL Script in Supabase

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of the updated SQL script into the editor
5. Click "Run" to execute the SQL

## Step 4: Verify Admin Profile

1. Go to "Table Editor" in the left sidebar
2. Click on "profiles" table
3. You should see the admin profile you just created
4. Check the other tables (parents, siblings, match_preferences) to verify that all the data was created correctly

## Step 5: Test Login

1. Open your Hubbly app
2. Log in with the following credentials:
   - Email: admin_test@hubbly.app
   - Password: admin123
3. You should be logged in and see the admin profile with all the details filled out

## Sample Profile Data

Here's a summary of the admin profile data that was created:

### Admin User
- Name: Admin User
- Gender: Male
- Date of Birth: January 1, 1990
- Height: 180 cm
- Ethnicity: South Asian
- Location: New York, NY
- Nationality: American
- Education: Master's Degree from Columbia University
- Occupation: Software Engineer at Hubbly Inc.

### Parents
- Mother: Sarah Johnson (South Asian, Indian, Bachelor's Degree, Teacher)
- Father: Robert Johnson (South Asian, Pakistani, Master's Degree, Doctor)

### Siblings
- Sister: Emily Johnson (Female, Marketing Manager, Single)
- Brother: Michael Johnson (Male, Research Scientist, Married)

### Match Preferences
- Age Range: 25-35
- Preferred Ethnicities: South Asian, Middle Eastern, East Asian
- Preferred Locations: New York, San Francisco, Chicago
- Preferred Education Levels: Bachelor's, Master's, PhD
