# Hubbly App - Supabase Backend Integration

This document provides instructions on how to set up and use the Supabase backend for the Hubbly App.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides a complete backend solution, including:

- **PostgreSQL Database**: A powerful, open-source relational database
- **Authentication**: Built-in user authentication system
- **Storage**: File storage for images and other files
- **API**: Automatic REST and real-time APIs
- **Hosting**: Web hosting capabilities

## Setup Instructions

### 1. Supabase Project Setup

Your Supabase project has already been created with the following details:

- **Project URL**: https://jhpmzmjegvspxdnbazzx.supabase.co
- **Public API Key**: Your API key has been configured in the `lib/supabaseClient.js` file

### 2. Database Setup

To set up the database tables, run the following command:

```bash
node scripts/runDatabaseSetup.js
```

This script will create the following tables in your Supabase database:

- **profiles**: Stores user profile information
- **parents**: Stores information about parents (mother and father)
- **siblings**: Stores information about siblings
- **match_preferences**: Stores user preferences for matching

### 3. Authentication

The app uses Supabase's authentication system with phone numbers. The following authentication functions are available:

- **Sign Up**: Users can sign up with a phone number and password
- **Sign In**: Users can sign in with their phone number and password
- **Sign Out**: Users can sign out of the app

### 4. File Storage

Profile pictures are stored in Supabase Storage. The app automatically uploads profile pictures to the appropriate storage bucket.

## Project Structure

- **lib/supabaseClient.js**: Configuration for the Supabase client
- **lib/auth.js**: Authentication functions
- **lib/profiles.js**: Functions for managing user profiles and related data
- **lib/setupDatabase.js**: Script to set up the database tables
- **contexts/AuthContext.tsx**: React context for managing authentication state

## How to Use

### Authentication

```javascript
import { signUpWithPhone, signInWithPhone, signOut } from '../lib/auth';

// Sign up a new user
const { data, error } = await signUpWithPhone(phoneNumber, password);

// Sign in a user
const { data, error } = await signInWithPhone(phoneNumber, password);

// Sign out
await signOut();
```

### Profile Management

```javascript
import { updateProfile, saveParentInfo, addSibling, uploadProfilePicture } from '../lib/profiles';

// Update a user's profile
const { data, error } = await updateProfile(userId, profileData);

// Save parent information
const { data, error } = await saveParentInfo(userId, 'mother', motherData);

// Add a sibling
const { data, error } = await addSibling(userId, siblingData);

// Upload a profile picture
const { publicUrl, error } = await uploadProfilePicture(userId, imageUri, 'user');
```

### Using the Auth Context

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  
  // Now you can use the auth state and functions
  // For example:
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <LoginScreen />;
  }
  
  return (
    <div>
      <h1>Welcome, {profile?.name}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Troubleshooting

If you encounter issues with the Supabase integration, try the following:

1. Check the console for error messages
2. Verify that your Supabase project is running
3. Ensure that your API key is correct in `lib/supabaseClient.js`
4. Make sure you have run the database setup script

## Next Steps

1. Implement profile editing functionality
2. Add more advanced matching algorithms
3. Implement real-time updates using Supabase's real-time API
4. Add social authentication (e.g., Facebook, Google)

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/supabase-client)
- [Supabase Auth](https://supabase.io/docs/reference/javascript/auth-signin)
- [Supabase Storage](https://supabase.io/docs/reference/javascript/storage-createbucket)
