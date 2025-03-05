/**
 * Admin utilities for the Hubbly app
 * 
 * This file contains functions for admin operations such as
 * creating admin users and performing admin-specific tasks.
 */

const { supabase } = require('./supabaseClient');
const { confirmTestEmail } = require('./auth');

/**
 * Create an admin user with email and password
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} - The result of the admin creation operation
 */
async function createAdminUser(email, password) {
  try {
    // Check if the email is valid
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: { message: "Please provide a valid email address" }
      };
    }

    // Check if password meets requirements
    if (!password || password.length < 6) {
      return {
        success: false,
        error: { message: "Password must be at least 6 characters long" }
      };
    }

    // First try to sign in directly
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInData?.user) {
        console.log("Admin signed in successfully");
        return {
          success: true,
          user: signInData.user,
          session: signInData.session,
          message: "Admin signed in successfully"
        };
      }
      
      // If sign-in fails but not because user doesn't exist, report the error
      if (signInError && !signInError.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: signInError,
          message: signInError.message
        };
      }
      
      // If we get here, the user doesn't exist, so we'll try to create them
      console.log("Admin user doesn't exist, creating new account");
    } catch (signInErr) {
      console.error("Error during sign-in attempt:", signInErr);
      // Continue to account creation if sign-in fails
    }

    // Create the admin user
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (error) {
        // If user already exists, try to sign in again
        if (error.message.includes("already registered")) {
          console.log("User already registered, attempting to sign in");
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError) {
            return {
              success: false,
              error: signInError,
              message: "User exists but couldn't sign in. Check your password."
            };
          }

          return {
            success: true,
            user: signInData.user,
            session: signInData.session,
            message: "Signed in as existing admin"
          };
        }

        // For other errors
        console.error('Admin creation error:', error);
        return {
          success: false,
          error,
          message: error.message
        };
      }

      // If email confirmation is required, handle it
      if (data?.user?.identities?.length === 0 || 
          data?.user?.email_confirmed_at === null) {
        
        // For development, we can auto-confirm the email
        try {
          await confirmTestEmail(email);
          console.log("Admin email auto-confirmed");
        } catch (confirmError) {
          console.error("Could not auto-confirm admin email:", confirmError);
        }
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: "Admin user created successfully"
      };
    } catch (createError) {
      console.error('Admin creation error:', createError);
      return {
        success: false,
        error: createError,
        message: "Unexpected error creating admin user"
      };
    }
  } catch (error) {
    console.error('Admin login/creation error:', error);
    return {
      success: false,
      error,
      message: "Unexpected error during admin authentication"
    };
  }
}

module.exports = {
  createAdminUser
};
