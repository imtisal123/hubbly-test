# Authenticated Profile System Guide

This guide explains how to implement and use the authenticated profile system in your Hubbly app. The system allows you to create and manage user profiles that are linked to Supabase authentication.

## Overview

The authenticated profile system consists of:

1. **Authentication Functions**: Sign up, sign in, and sign out functionality
2. **Profile Management**: Create, update, and retrieve user profiles
3. **Related Data**: Manage match preferences, family details, parents, and siblings

## Implementation Steps

### 1. Authentication Flow

#### Sign Up

```javascript
import { signUpUser } from './auth_profile_utils';

// In your sign-up form submission handler
async function handleSignUp() {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  const { success, user, error } = await signUpUser(email, password);
  
  if (success) {
    // Redirect to profile creation page
    navigate('/create-profile');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Sign In

```javascript
import { signInUser } from './auth_profile_utils';

// In your sign-in form submission handler
async function handleSignIn() {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  const { success, user, error } = await signInUser(email, password);
  
  if (success) {
    // Redirect to dashboard or profile page
    navigate('/dashboard');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Sign Out

```javascript
import { signOutUser } from './auth_profile_utils';

// In your sign-out button click handler
async function handleSignOut() {
  const { success, error } = await signOutUser();
  
  if (success) {
    // Redirect to home page
    navigate('/');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

### 2. Profile Management

#### Create Profile

```javascript
import { createUserProfile } from './auth_profile_utils';

// In your profile creation form submission handler
async function handleCreateProfile() {
  // Gather profile data from form inputs
  const profileData = {
    name: nameInput.value,
    gender: genderSelect.value,
    dateOfBirth: dobInput.value,
    // Add other profile fields
    
    // Add match preferences if available
    matchPreferences: {
      minAge: minAgeInput.value,
      maxAge: maxAgeInput.value,
      // Add other preferences
    },
    
    // Add family details if available
    familyDetails: {
      familyEnvironment: familyEnvSelect.value,
      // Add parents and siblings
      parents: [
        {
          relationship: 'Father',
          occupation: fatherOccupationInput.value,
          // Add other fields
        },
        // Add mother if available
      ],
      siblings: [
        // Add siblings if available
      ]
    }
  };
  
  const { success, id, error } = await createUserProfile(profileData);
  
  if (success) {
    // Redirect to profile page or dashboard
    navigate('/profile');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Update Profile

```javascript
import { updateUserProfile } from './auth_profile_utils';

// In your profile update form submission handler
async function handleUpdateProfile() {
  // Gather updated profile data from form inputs
  const profileData = {
    name: nameInput.value,
    // Only include fields that need to be updated
    occupation: occupationInput.value,
    // Add other fields to update
  };
  
  const { success, id, error } = await updateUserProfile(profileData);
  
  if (success) {
    // Show success message
    showSuccess('Profile updated successfully');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Get Profile Information

```javascript
import { getUserProfile } from './auth_profile_utils';

// When loading the profile page
async function loadProfileData() {
  const { success, profile, matchPreferences, familyDetails, error } = await getUserProfile();
  
  if (success) {
    // Populate the UI with profile data
    nameElement.textContent = profile.name;
    genderElement.textContent = profile.gender;
    // Set other profile fields
    
    // Set match preferences if available
    if (matchPreferences) {
      minAgeElement.textContent = matchPreferences.min_age;
      maxAgeElement.textContent = matchPreferences.max_age;
      // Set other preferences
    }
    
    // Set family details if available
    if (familyDetails) {
      familyEnvElement.textContent = familyDetails.family_environment;
      
      // Display parents if available
      if (familyDetails.parents && familyDetails.parents.length > 0) {
        // Populate parents section
      }
      
      // Display siblings if available
      if (familyDetails.siblings && familyDetails.siblings.length > 0) {
        // Populate siblings section
      }
    }
  } else {
    // Show error message
    showError(error.message);
  }
}
```

### 3. Checking Authentication State

```javascript
import { getCurrentUser } from './auth_profile_utils';

// Check if user is authenticated when app loads
async function checkAuthState() {
  const { user, error } = await getCurrentUser();
  
  if (user) {
    // User is authenticated
    // Update UI to show authenticated state
    showAuthenticatedUI();
  } else {
    // User is not authenticated
    // Update UI to show unauthenticated state
    showUnauthenticatedUI();
  }
}
```

## Switching Between Demo and Regular Profiles

You can use the same profile management functions for both demo and regular profiles by setting the `isDemo` flag:

```javascript
import { saveProfile } from './lib/profileManager';

// For demo profiles
const demoResult = await saveProfile(profileData, true);

// For regular profiles (requires authentication)
const regularResult = await saveProfile(profileData, false);
```

## Database Tables

The system uses the following tables:

### Regular Profile Tables (require authentication)
- `profiles`: Main profile information
- `match_preferences`: User's preferences for matching
- `family_details`: Family background information
- `parents`: Parent details
- `siblings`: Sibling details

### Demo Profile Tables (no authentication required)
- `demo_profiles`: Demo profile information
- `demo_match_preferences`: Demo preferences for matching
- `demo_family_details`: Demo family background information
- `demo_parents`: Demo parent details
- `demo_siblings`: Demo sibling details

## Error Handling

All functions return a consistent response format:

```javascript
{
  success: boolean,  // Whether the operation was successful
  error: object,     // Error object if success is false
  // Additional data depending on the function
}
```

## Security Considerations

1. **Row Level Security (RLS)**: Ensure that your Supabase tables have proper RLS policies to restrict access to user data.

2. **Authentication Tokens**: The Supabase client automatically handles authentication tokens. Make sure your app securely stores these tokens.

3. **Input Validation**: Always validate user input before saving to the database to prevent injection attacks.

## Testing Considerations

### Approved Test Email Addresses

When testing the authentication system, use only these approved email addresses to avoid bounces and rate limiting:

- `imtisal@outpost-us.com`
- `imtisal@outpost-usa.com`

Using other test emails (like example.com) may result in bounced emails and could trigger Supabase's rate limiting, which will block further authentication attempts.

### Rate Limiting

Supabase implements rate limiting on authentication operations to prevent abuse. To avoid hitting these limits:

1. **Reuse existing accounts** for testing instead of creating new ones
2. **Set the `ATTEMPT_SIGNUP` flag to false** in your test scripts when you know the user already exists
3. **Add delays** between authentication attempts
4. **Handle rate limit errors** gracefully in your code

### Example Rate-Limit Friendly Test Script

```javascript
// Use legitimate email addresses to avoid bounces
const TEST_EMAIL = 'imtisal@outpost-us.com';
const TEST_PASSWORD = 'Password123!';

// Flag to control whether to attempt sign-up
// Set to false to avoid rate limiting if you know the user already exists
const ATTEMPT_SIGNUP = false;

async function runTest() {
  // Try to sign in first (preferred approach to avoid rate limiting)
  let user = await signInUser(TEST_EMAIL, TEST_PASSWORD);
  
  // Only attempt sign-up if sign-in fails and ATTEMPT_SIGNUP is true
  if (!user && ATTEMPT_SIGNUP) {
    user = await signUpUser();
  }
  
  // Continue with the test...
}
```

## Next Steps

1. **Implement the UI**: Create the necessary forms and pages for user authentication and profile management.

2. **Set Up RLS Policies**: Configure Row Level Security in Supabase to protect user data.

3. **Add Validation**: Implement client-side and server-side validation for user inputs.

4. **Enhance Error Handling**: Add more detailed error handling and user feedback.

5. **Add Profile Images**: Implement functionality for uploading and managing profile images.
