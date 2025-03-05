/**
 * Test script for admin authentication utilities
 * This script demonstrates how to:
 * 1. Create a user without email verification
 * 2. Create a user with phone authentication
 * 3. Create a profile for the user
 * 4. Delete the test user
 * 
 * IMPORTANT: This script requires the Supabase service role key.
 * Environment variables are loaded from the .env file.
 */

const { 
  adminCreateUser, 
  adminCreatePhoneUser, 
  adminDeleteUser 
} = require('./admin_auth_utils');
const { saveProfile } = require('./lib/profileManager');
const { supabase } = require('./lib/supabaseClient');
require('dotenv').config();

// Test data
const TEST_EMAIL = `test_admin_user_${Date.now()}@example.com`; // This won't send an actual email
const TEST_PHONE = `+1555${Math.floor(1000000 + Math.random() * 9000000)}`; // Random phone number
const TEST_PASSWORD = 'Password123!';

/**
 * Sign in with the created user
 */
async function signInWithUser(email, password) {
  console.log(`Signing in with user: ${email}`);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    return null;
  }
  
  console.log('Signed in successfully');
  return data.user;
}

/**
 * Create a profile for the user
 */
async function createProfileForUser() {
  console.log('Creating profile for user...');
  
  // Sample profile data
  const profileData = {
    name: 'Admin Test User',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    ethnicity: 'South Asian',
    location: 'New York, USA',
    occupation: 'Software Engineer',
    // Add other profile fields as needed
  };
  
  const result = await saveProfile(profileData, false);
  
  if (!result.success) {
    console.error('Error creating profile:', result.error);
    return null;
  }
  
  console.log('Profile created successfully');
  return result;
}

/**
 * Test creating a user with email
 */
async function testEmailUser() {
  console.log('\n=== Testing Email User Creation ===');
  
  // Create user without email verification
  const createResult = await adminCreateUser(TEST_EMAIL, TEST_PASSWORD, {
    name: 'Admin Test User'
  });
  
  if (!createResult.success) {
    console.error('Failed to create user:', createResult.message);
    return null;
  }
  
  console.log('User created successfully:', createResult.user.id);
  
  // Sign in with the created user
  const user = await signInWithUser(TEST_EMAIL, TEST_PASSWORD);
  
  if (!user) {
    console.error('Failed to sign in with created user');
    return null;
  }
  
  // Create a profile for the user
  const profileResult = await createProfileForUser();
  
  if (!profileResult) {
    console.error('Failed to create profile for user');
  }
  
  return createResult.user;
}

/**
 * Test creating a user with phone authentication
 */
async function testPhoneUser() {
  console.log('\n=== Testing Phone User Creation ===');
  
  try {
    // Create a phone user
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
    
    // Sign in with the created phone user
    console.log(`Signing in with phone: ${TEST_PHONE}`);
    
    // For phone auth, we need to use OTP
    const { data, error: signInError } = await supabase.auth.signInWithOtp({
      phone: TEST_PHONE
    });
    
    if (signInError) {
      console.error('Error sending OTP:', signInError);
      console.log('Failed to send OTP to created phone user');
      return user;
    }
    
    console.log('OTP sent successfully. In a real app, the user would enter the code.');
    console.log('Since we cannot verify the OTP in this test, we will skip profile creation.');
    
    return user;
  } catch (error) {
    console.error('Unexpected error in phone user test:', error);
    return null;
  }
}

/**
 * Clean up test users
 */
async function cleanupTestUsers(emailUser, phoneUser) {
  console.log('\n=== Cleaning Up Test Users ===');
  
  if (emailUser) {
    const deleteEmailResult = await adminDeleteUser(emailUser.id);
    console.log('Email user deletion:', deleteEmailResult.success ? 'Success' : 'Failed');
  }
  
  if (phoneUser) {
    const deletePhoneResult = await adminDeleteUser(phoneUser.id);
    console.log('Phone user deletion:', deletePhoneResult.success ? 'Success' : 'Failed');
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log('=== STARTING ADMIN AUTH TEST ===');
  
  let emailUser = null;
  let phoneUser = null;
  
  try {
    // Test email user
    emailUser = await testEmailUser();
    
    // Test phone user
    phoneUser = await testPhoneUser();
  } catch (error) {
    console.error('Unexpected error during test:', error);
  } finally {
    // Clean up test users
    await cleanupTestUsers(emailUser, phoneUser);
  }
  
  console.log('=== ADMIN AUTH TEST COMPLETED ===');
}

// Run the test
runTest()
  .catch(error => console.error('Error in test:', error))
  .finally(() => {
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
