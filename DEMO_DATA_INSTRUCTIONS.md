# Demo Data Instructions

We've discovered that the profiles table has a foreign key constraint that requires each profile ID to exist in the auth.users table. This is a common setup in Supabase where profiles are linked to authenticated users.

To solve this issue for demo profiles, we've created a separate set of tables specifically for demo data that don't have this constraint.

## New Approach

1. **Separate Demo Tables**: We've created separate tables for demo data:
   - `demo_profiles`
   - `demo_match_preferences`
   - `demo_family_details`
   - `demo_parents`
   - `demo_siblings`

2. **No Foreign Key Constraints**: These tables don't have foreign key constraints to the auth.users table, allowing you to create demo profiles without needing to create auth users first.

3. **Updated Code**: The `saveDemoProfile` function has been updated to use these demo tables instead of the regular tables.

4. **New Utility Functions**: We've added utility functions in `profileUtils.js` to work with both regular and demo profiles.

## Instructions

### 1. Run the SQL Script to Create Demo Tables

You need to run the `fix_foreign_key_constraint.sql` script in the Supabase dashboard to create the demo tables:

1. Open the Supabase dashboard at [https://app.supabase.io/](https://app.supabase.io/)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query" to create a new SQL query
5. Open the SQL file on your local machine:
   ```bash
   # Open the SQL file in your editor
   open /Users/imtisalq/hubbly-app/fix_foreign_key_constraint.sql
   ```
6. Copy the entire contents of the file
7. Paste the contents into the SQL Editor in the Supabase dashboard
8. Click "Run" to execute the SQL commands
9. You should see a success message indicating that the tables were created

**Important**: Focus on the "Option 3" section of the SQL script, which creates separate demo tables. This is the recommended approach.

### 2. Test the Demo Profile System

After running the SQL script, test the entire demo profile system:

```bash
cd /Users/imtisalq/hubbly-app
./test_demo_system.sh
```

This will:
1. Create a new demo profile
2. Test the profile utility functions
3. Verify that everything is working correctly

You should see success messages indicating that the demo profile was created successfully and that the utility functions can retrieve it.

## Using the Demo Profile System

### Creating Demo Profiles

```javascript
const { saveDemoProfile } = require('./lib/demoData');

const demoProfile = {
  name: 'Demo User',
  // ... other profile fields
  matchPreferences: {
    // ... match preferences
  },
  familyDetails: {
    // ... family details
  }
};

const result = await saveDemoProfile(demoProfile);
```

### Working with Profiles

```javascript
const { getAllProfiles, getProfileById, getCompleteProfile } = require('./lib/profileUtils');

// Get all profiles (both regular and demo)
const allProfiles = await getAllProfiles();

// Get only demo profiles
const demoProfiles = await getAllProfiles({ onlyDemoProfiles: true });

// Get a profile by ID (checks both regular and demo tables)
const profile = await getProfileById('profile-id');

// Get a complete profile with all related data
const completeProfile = await getCompleteProfile('profile-id');
```

## Benefits of This Approach

1. **Separation of Concerns**: Demo data is clearly separated from real user data.
2. **No Auth Requirements**: You don't need to create auth users for demo profiles.
3. **Simplified Development**: You can freely create and delete demo data without affecting real users.
4. **No RLS Issues**: The demo tables have simple RLS policies that allow anyone to access demo data.

## Next Steps

Once the demo data functionality is working correctly, you can:

1. **Create a UI for Demo Profiles**: Add a UI for creating and viewing demo profiles.
2. **Implement Demo Mode**: Add a toggle to switch between real and demo data in your app.
3. **Add More Demo Data**: Create more demo profiles with different characteristics for testing.

## Reference Documentation

For more detailed information, see the [FINAL_SOLUTION.md](/Users/imtisalq/hubbly-app/FINAL_SOLUTION.md) file.
