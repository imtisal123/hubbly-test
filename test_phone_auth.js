/**
 * Test script for phone authentication utilities
 * 
 * This script demonstrates how to:
 * 1. Create a user with phone authentication using the Admin API
 * 2. Sign in with the phone number (simulated since we can't receive OTP)
 * 3. Create a profile for the user
 * 
 * IMPORTANT: This script requires the Supabase service role key.
 * Environment variables are loaded from the .env file.
 */

require('dotenv').config();
const { adminCreatePhoneUser, adminDeleteUser } = require('./admin_auth_utils');
const { saveProfile } = require('./lib/profileManager');
const { supabase } = require('./lib/supabaseClient');

// Test data
const TEST_PHONE = `+1555${Math.floor(1000000 + Math.random() * 9000000)}`; // Random phone number
const TEST_PASSWORD = 'Password123!';

/**
 * Create a test phone user with the Admin API
 */
async function createTestPhoneUser() {
  console.log(`Creating test phone user with phone: ${TEST_PHONE}`);
  
  const { success, user, error } = await adminCreatePhoneUser(
    TEST_PHONE,
    TEST_PASSWORD,
    { name: 'Test Phone User' }
  );
  
  if (!success || !user) {
    console.error('Failed to create phone user:', error);
    return null;
  }
  
  console.log(`Phone user created successfully: ${user.id}`);
  return user;
}

/**
 * Create a profile for the test user
 */
async function createProfileForUser(userId) {
  console.log('Creating profile for user...');
  
  try {
    // Create a test profile
    const profileData = {
      name: 'Test Phone User',
      gender: 'male',
      birthdate: '1990-01-01',
      height: 180,
      location: 'New York',
      occupation: 'Software Engineer',
      education: 'Bachelor\'s Degree',
      bio: 'This is a test profile created by the admin API'
    };
    
    // Use the saveProfile function with the user ID
    const result = await saveProfile(profileData, false, userId);
    
    if (!result.success) {
      console.error('Failed to create profile:', result.error);
      return false;
    }
    
    console.log('Profile created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return false;
  }
}

/**
 * Simulate phone sign-in (without actually sending OTP)
 * This is for demonstration purposes only
 */
async function simulatePhoneSignIn(userId) {
  console.log('Simulating phone sign-in...');
  
  try {
    // In a real app, we would:
    // 1. Call signInWithOtp({ phone: TEST_PHONE })
    // 2. User would receive SMS with OTP
    // 3. User would enter OTP
    // 4. Call verifyOtp({ phone: TEST_PHONE, token: 'OTP_CODE' })
    
    // Since we can't receive the OTP in this test, we'll simulate a successful sign-in
    // by using the admin API to get the user's session
    
    // For demonstration, we'll just show the user ID that would be authenticated
    console.log(`In a real app, user ${userId} would now be authenticated`);
    console.log('To implement actual phone auth in your app:');
    console.log('1. Enable a phone provider in Supabase Authentication settings');
    console.log('2. Set up Twilio or another SMS provider');
    console.log('3. Use the phone_auth_utils.js functions for sign-up and verification');
    
    return true;
  } catch (error) {
    console.error('Error in simulated sign-in:', error);
    return false;
  }
}

/**
 * Clean up test user
 */
async function cleanupTestUser(user) {
  if (!user) return;
  
  console.log(`\n=== Cleaning Up Test User: ${user.id} ===`);
  
  try {
    const { success, error } = await adminDeleteUser(user.id);
    
    if (success) {
      console.log('Test user deleted successfully');
    } else {
      console.error('Failed to delete test user:', error);
    }
  } catch (error) {
    console.error('Unexpected error deleting test user:', error);
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log('=== STARTING PHONE AUTH TEST ===');
  
  let testUser = null;
  
  try {
    // Create a test phone user
    testUser = await createTestPhoneUser();
    
    if (!testUser) {
      console.error('Failed to create test user, aborting test');
      return;
    }
    
    // Simulate phone sign-in
    const signInSuccess = await simulatePhoneSignIn(testUser.id);
    
    if (!signInSuccess) {
      console.error('Failed to simulate sign-in, skipping profile creation');
    } else {
      // Create a profile for the user
      await createProfileForUser(testUser.id);
    }
  } catch (error) {
    console.error('Unexpected error during test:', error);
  } finally {
    // Clean up test user
    await cleanupTestUser(testUser);
  }
  
  console.log('=== PHONE AUTH TEST COMPLETED ===');
}

// Run the test
runTest()
  .catch(error => console.error('Error in test:', error))
  .finally(() => {
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
