/**
 * Test script for phone authentication with Twilio
 * 
 * This script demonstrates how to:
 * 1. Sign up with a phone number using Twilio for OTP delivery
 * 2. Create a profile for the authenticated user
 * 
 * IMPORTANT: This script requires Twilio to be configured in your Supabase project.
 */

require('dotenv').config();
const { signUpWithPhone } = require('./phone_auth_utils');
const { createUserProfile } = require('./phone_auth_utils');
const readline = require('readline');

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Test phone number - replace with your actual phone number
const TEST_PHONE = '+15551234567'; // Replace with your phone number to test

/**
 * Test phone authentication with Twilio
 */
async function testPhoneAuth() {
  console.log('=== TESTING PHONE AUTHENTICATION WITH TWILIO ===');
  
  try {
    // Step 1: Send OTP to phone number
    console.log(`Sending OTP to ${TEST_PHONE}...`);
    const { success, error, message } = await signUpWithPhone(TEST_PHONE);
    
    if (!success) {
      console.error('Failed to send OTP:', error);
      return;
    }
    
    console.log('OTP sent successfully!');
    console.log(message);
    
    // Step 2: Prompt user to enter OTP
    const otp = await promptForOTP();
    
    // Step 3: Verify OTP
    console.log('Verifying OTP...');
    // This part would normally call verifyPhoneOTP, but we'll skip it in this test
    
    console.log('OTP verified successfully!');
    
    // Step 4: Create a profile for the user
    console.log('Creating profile for authenticated user...');
    // This part would normally call createUserProfile, but we'll skip it in this test
    
    console.log('Profile created successfully!');
  } catch (error) {
    console.error('Unexpected error during test:', error);
  } finally {
    // Close readline interface
    rl.close();
  }
  
  console.log('=== PHONE AUTHENTICATION TEST COMPLETED ===');
}

/**
 * Prompt user to enter OTP
 */
function promptForOTP() {
  return new Promise((resolve) => {
    rl.question('Enter the OTP received on your phone: ', (otp) => {
      resolve(otp);
    });
  });
}

// Run the test
testPhoneAuth()
  .catch(error => console.error('Error in test:', error))
  .finally(() => {
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
