/**
 * Phone Authentication Utilities for React Native
 * 
 * This file contains functions for phone-based authentication using Supabase.
 * To use these functions, you must enable phone auth in your Supabase project
 * and configure a Twilio account for SMS delivery.
 */

import { supabase } from './lib/supabaseClient';

/**
 * Format phone number to E.164 format
 * 
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // If the phone number doesn't start with +, add it
  let formattedPhone = phoneNumber;
  if (!formattedPhone.startsWith('+')) {
    // Assume US number if no country code
    formattedPhone = '+1' + formattedPhone.replace(/\D/g, '');
  }
  
  // Ensure the phone number is properly formatted (remove any non-digit characters except the leading +)
  formattedPhone = '+' + formattedPhone.replace(/[^\d+]/g, '').replace(/^\+/, '');
  
  return formattedPhone;
}

/**
 * Sign up with phone number
 * This will send an OTP to the provided phone number
 * 
 * @param {string} phone - Phone number in international format (e.g., +1234567890)
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export async function signUpWithPhone(phone) {
  try {
    // Format the phone number to ensure it's in E.164 format
    const formattedPhone = formatPhoneNumber(phone);
    console.log('Sending OTP to formatted phone:', formattedPhone);
    
    // Use the verified Twilio number from environment variables, or fall back to a default
    const TWILIO_PHONE_NUMBER = process.env.EXPO_PUBLIC_TWILIO_PHONE_NUMBER || '+13127747575';
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      channel: 'sms',
      options: {
        // Use the Twilio phone number for sending SMS
        data: {
          twilio_sender_number: TWILIO_PHONE_NUMBER
        }
      }
    });
    
    if (error) {
      console.error('OTP error:', error);
      return {
        success: false,
        error,
        message: error.message,
        phoneNumber: formattedPhone // Return the formatted phone number for debugging
      };
    }
    
    return {
      success: true,
      message: 'OTP sent successfully. Please verify with the code sent to your phone.',
      phoneNumber: formattedPhone // Return the formatted phone number so we can use it in verification
    };
  } catch (error) {
    console.error('Sign up with phone error:', error);
    return {
      success: false,
      error,
      message: 'Unexpected error sending OTP'
    };
  }
}

/**
 * Verify OTP sent to phone
 * 
 * @param {string} phone - Phone number in international format (e.g., +1234567890)
 * @param {string} otp - One-time password received via SMS
 * @returns {Promise<{success: boolean, error: object|null, user: object|null}>}
 */
export async function verifyPhoneOTP(phone, otp) {
  try {
    // Format the phone number to ensure it's in E.164 format
    const formattedPhone = formatPhoneNumber(phone);
    console.log('Verifying OTP for formatted phone:', formattedPhone);
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms'
    });
    
    if (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
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
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error,
      message: 'Unexpected error verifying OTP'
    };
  }
}

/**
 * Create a profile for the authenticated user
 * 
 * @param {object} profileData - Profile data to save
 * @returns {Promise<{success: boolean, error: object|null, profile: object|null}>}
 */
export async function createUserProfile(profileData) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: userError || new Error('No authenticated user found'),
        message: 'User must be authenticated to create a profile'
      };
    }
    
    // Create profile with user ID
    const profile = {
      ...profileData,
      id: user.id // Use auth user ID as profile ID
    };
    
    // Insert profile into database
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error,
        message: `Failed to create profile: ${error.message}`
      };
    }
    
    return {
      success: true,
      profile: data,
      message: 'Profile created successfully'
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Unexpected error creating profile'
    };
  }
}

/**
 * Get the current user's profile
 * 
 * @returns {Promise<{success: boolean, error: object|null, profile: object|null}>}
 */
export async function getUserProfile() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: userError || new Error('No authenticated user found'),
        message: 'User must be authenticated to get profile'
      };
    }
    
    // Get profile from database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      return {
        success: false,
        error,
        message: `Failed to get profile: ${error.message}`
      };
    }
    
    return {
      success: true,
      profile: data,
      message: 'Profile retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      error,
      message: 'Unexpected error getting profile'
    };
  }
}
