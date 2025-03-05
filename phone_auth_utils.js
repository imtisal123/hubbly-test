/**
 * Phone Authentication Utilities
 * 
 * This file contains functions for phone-based authentication using Supabase.
 * To use these functions, you must enable phone auth in your Supabase project
 * and configure a Twilio account for SMS delivery.
 */

const { supabase } = require('./lib/supabaseClient');
const { saveProfile, getCurrentUser } = require('./lib/profileManager');

// Twilio phone number for testing
const TWILIO_PHONE_NUMBER = '+13127747575';

/**
 * Sign up with phone number
 * This will send an OTP to the provided phone number
 * 
 * @param {string} phone - Phone number in international format (e.g., +1234567890)
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
async function signUpWithPhone(phone) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      channel: 'sms',
      options: {
        // Use the Twilio phone number for testing
        data: {
          twilio_sender_number: TWILIO_PHONE_NUMBER
        }
      }
    });
    
    if (error) {
      return {
        success: false,
        error,
        message: error.message
      };
    }
    
    return {
      success: true,
      message: 'OTP sent successfully. Please verify with the code sent to your phone.'
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Unexpected error sending OTP'
    };
  }
}

/**
 * Verify phone number with OTP
 * 
 * @param {string} phone - Phone number used for sign up
 * @param {string} token - OTP received via SMS
 * @returns {Promise<{success: boolean, user: object|null, error: object|null}>}
 */
async function verifyPhoneOTP(phone, token) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });
    
    if (error) {
      return {
        success: false,
        user: null,
        error,
        message: error.message
      };
    }
    
    return {
      success: true,
      user: data.user,
      session: data.session,
      message: 'Phone number verified successfully'
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      error,
      message: 'Unexpected error verifying OTP'
    };
  }
}

/**
 * Sign in with phone number (sends OTP)
 * This is the same as signUpWithPhone but named differently for clarity
 * 
 * @param {string} phone - Phone number in international format
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
async function signInWithPhone(phone) {
  return signUpWithPhone(phone);
}

/**
 * Sign out the current user
 * 
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error,
        message: error.message
      };
    }
    
    return {
      success: true,
      message: 'User signed out successfully'
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Unexpected error during signout'
    };
  }
}

/**
 * Create a profile for the currently authenticated user
 * 
 * @param {Object} profileData - Profile data to save
 * @returns {Promise<{success: boolean, id: string|null, error: object|null}>}
 */
async function createUserProfile(profileData) {
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    return {
      success: false,
      error: error || new Error('No authenticated user found'),
      message: 'You must be signed in to create a profile'
    };
  }
  
  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (existingProfile) {
    return {
      success: false,
      error: new Error('Profile already exists'),
      message: 'Profile already exists. Use updateUserProfile instead.'
    };
  }
  
  // Save the profile - no need to pass user ID, it will be retrieved from auth
  const result = await saveProfile(profileData, false);
  
  return result;
}

/**
 * Update the profile for the currently authenticated user
 * 
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<{success: boolean, id: string|null, error: object|null}>}
 */
async function updateUserProfile(profileData) {
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    return {
      success: false,
      error: error || new Error('No authenticated user found'),
      message: 'You must be signed in to update a profile'
    };
  }
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (!existingProfile) {
    return {
      success: false,
      error: new Error('Profile does not exist'),
      message: 'Profile does not exist. Use createUserProfile first.'
    };
  }
  
  // Update the profile - no need to pass user ID, it will be retrieved from auth
  const result = await saveProfile(profileData, false);
  
  return result;
}

/**
 * Get the profile for the currently authenticated user
 * 
 * @returns {Promise<{success: boolean, profile: object|null, error: object|null}>}
 */
async function getUserProfile() {
  // First, check if we're authenticated
  const { user, error } = await getCurrentUser();
  
  if (error || !user) {
    return {
      success: false,
      error: error || new Error('No authenticated user found'),
      message: 'You must be signed in to get profile information'
    };
  }
  
  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return {
        success: false,
        error: profileError,
        message: 'Error getting profile information'
      };
    }
    
    // Get match preferences
    const { data: matchPreferences, error: mpError } = await supabase
      .from('match_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Get family details
    const { data: familyDetails, error: fdError } = await supabase
      .from('family_details')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    let parents = [];
    let siblings = [];
    
    if (familyDetails) {
      // Get parents
      const { data: parentsData, error: parentsError } = await supabase
        .from('parents')
        .select('*')
        .eq('family_details_id', familyDetails.id);
      
      if (!parentsError && parentsData) {
        parents = parentsData;
      }
      
      // Get siblings
      const { data: siblingsData, error: siblingsError } = await supabase
        .from('siblings')
        .select('*')
        .eq('family_details_id', familyDetails.id);
      
      if (!siblingsError && siblingsData) {
        siblings = siblingsData;
      }
    }
    
    return {
      success: true,
      profile,
      matchPreferences,
      familyDetails,
      parents,
      siblings
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Unexpected error getting profile information'
    };
  }
}

module.exports = {
  signUpWithPhone,
  signInWithPhone,
  verifyPhoneOTP,
  signOutUser,
  createUserProfile,
  updateUserProfile,
  getUserProfile
};
