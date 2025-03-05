/**
 * Test script for creating and managing authenticated profiles
 * This script demonstrates how to:
 * 1. Sign in with an existing user
 * 2. Create a profile for the authenticated user
 * 3. Update the profile
 * 4. Get profile information
 */
const { supabase } = require('./lib/supabaseClient');
const { saveProfile, updateProfile, getCurrentUser } = require('./lib/profileManager');

// Use legitimate email addresses to avoid bounces
// These emails are specifically approved for testing
const TEST_EMAIL = 'imtisal@outpost-us.com';
const TEST_PASSWORD = 'Password123!';

// Flag to control whether to attempt sign-up
// Set to false to avoid rate limiting if you know the user already exists
const ATTEMPT_SIGNUP = true;

/**
 * Sign up a new user
 * Only use this when you need to create a new test user
 */
async function signUpUser() {
  console.log(`Attempting to sign up user with email: ${TEST_EMAIL}`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (error) {
      console.error('Error signing up:', error);
      return null;
    }
    
    console.log('User signed up successfully!');
    console.log('User ID:', data.user.id);
    
    return data.user;
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return null;
  }
}

/**
 * Sign in an existing user
 */
async function signInUser(email, password) {
  console.log(`Attempting to sign in user with email: ${email}`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return null;
    }
    
    console.log('User signed in successfully!');
    console.log('User ID:', data.user.id);
    
    return data.user;
  } catch (error) {
    console.error('Unexpected error during signin:', error);
    return null;
  }
}

/**
 * Create a profile for the authenticated user
 */
async function createUserProfile() {
  console.log('Creating profile for authenticated user...');
  
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    console.error('No authenticated user found. Please sign in first.');
    return null;
  }
  
  // Sample profile data - in a real app, this would come from user input
  const profileData = {
    name: 'Test User',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    height: 175,
    ethnicity: 'South Asian',
    location: 'New York, USA',
    religion: 'Islam',
    educationLevel: 'Bachelors',
    occupation: 'Software Engineer',
    hasChildren: false,
    maritalStatus: 'Single',
    // Add match preferences
    matchPreferences: {
      minAge: 25,
      maxAge: 35,
      preferredEthnicities: ['South Asian', 'Middle Eastern'],
      minHeight: 160,
      maxHeight: 175
    },
    // Add family details
    familyDetails: {
      familyEnvironment: 'Moderate',
      parents: [
        {
          relationship: 'Father',
          occupation: 'Doctor',
          religiosity: 'Moderate'
        },
        {
          relationship: 'Mother',
          occupation: 'Teacher',
          religiosity: 'Practicing'
        }
      ],
      siblings: [
        {
          gender: 'Female',
          age: 28,
          maritalStatus: 'Married'
        }
      ]
    }
  };
  
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (existingProfile) {
    console.log('Profile already exists. Updating instead of creating...');
    return await updateUserProfile();
  }
  
  // Save the profile - no need to pass user ID, it will be retrieved from auth
  const result = await saveProfile(profileData, false);
  
  if (!result.success) {
    console.error('Error creating profile:', result.error);
    return null;
  }
  
  console.log('Profile created successfully!');
  console.log('Profile ID:', result.id);
  
  return result;
}

/**
 * Update an existing profile
 */
async function updateUserProfile() {
  console.log('Updating profile for authenticated user...');
  
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    console.error('No authenticated user found. Please sign in first.');
    return null;
  }
  
  // Sample update data - in a real app, this would come from user input
  const updateData = {
    name: 'Updated Test User',
    occupation: 'Senior Software Engineer',
    company: 'Tech Corp'
  };
  
  // Update the profile - no need to pass user ID, it will be retrieved from auth
  const result = await saveProfile(updateData, false);
  
  if (!result.success) {
    console.error('Error updating profile:', result.error);
    return null;
  }
  
  console.log('Profile updated successfully!');
  
  return result;
}

/**
 * Get profile information
 */
async function getProfileInfo() {
  console.log('Getting profile information...');
  
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    console.error('No authenticated user found. Please sign in first.');
    return null;
  }
  
  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error getting profile:', profileError);
      return null;
    }
    
    console.log('Profile information:');
    console.log(profile);
    
    // Get match preferences
    const { data: matchPreferences, error: mpError } = await supabase
      .from('match_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (!mpError && matchPreferences) {
      console.log('Match preferences:');
      console.log(matchPreferences);
    }
    
    // Get family details
    const { data: familyDetails, error: fdError } = await supabase
      .from('family_details')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (!fdError && familyDetails) {
      console.log('Family details:');
      console.log(familyDetails);
      
      // Get parents
      const { data: parents, error: parentsError } = await supabase
        .from('parents')
        .select('*')
        .eq('family_details_id', familyDetails.id);
      
      if (!parentsError && parents && parents.length > 0) {
        console.log('Parents:');
        console.log(parents);
      }
      
      // Get siblings
      const { data: siblings, error: siblingsError } = await supabase
        .from('siblings')
        .select('*')
        .eq('family_details_id', familyDetails.id);
      
      if (!siblingsError && siblings && siblings.length > 0) {
        console.log('Siblings:');
        console.log(siblings);
      }
    }
    
    return { profile, matchPreferences, familyDetails };
  } catch (error) {
    console.error('Unexpected error getting profile info:', error);
    return null;
  }
}

/**
 * Run the full test flow
 */
async function runTest() {
  console.log('=== STARTING AUTH PROFILE TEST ===');
  
  // Step 1: Try to sign in first (preferred approach to avoid rate limiting)
  console.log('Attempting to sign in with existing user...');
  let user = await signInUser(TEST_EMAIL, TEST_PASSWORD);
  
  // Only attempt sign-up if sign-in fails and ATTEMPT_SIGNUP is true
  if (!user && ATTEMPT_SIGNUP) {
    console.log('Sign in failed. Attempting to sign up...');
    user = await signUpUser();
    
    if (user) {
      console.log('Sign up successful. Waiting for email verification...');
      console.log('Please check your email and verify your account before proceeding.');
      console.log('After verification, run this script again to continue the test.');
      return;
    }
  }
  
  if (!user) {
    console.error('Failed to authenticate. Aborting test.');
    console.log('If you need to create a new user, set ATTEMPT_SIGNUP to true.');
    return;
  }
  
  // Step 2: Create or update a profile for the user
  const profileResult = await createUserProfile();
  
  if (!profileResult) {
    console.error('Failed to create/update profile. Aborting test.');
    return;
  }
  
  // Step 3: Get profile information
  const profileInfo = await getProfileInfo();
  
  if (!profileInfo) {
    console.error('Failed to get profile information.');
  }
  
  console.log('=== AUTH PROFILE TEST COMPLETED ===');
}

// Run the test
runTest()
  .catch(error => console.error('Error in test:', error))
  .finally(() => {
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
