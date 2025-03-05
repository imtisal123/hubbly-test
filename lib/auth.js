const { supabase, supabaseAdmin } = require('./supabaseClient');

/**
 * Sign up a new user with phone number and password
 * @param {string} phoneNumber - The user's phone number
 * @param {string} password - The user's password
 * @returns {Promise} - The result of the sign-up operation
 */
async function signUpWithPhone(phoneNumber, password) {
  try {
    // Sign up the user with email (we'll use phone as email for simplicity)
    // You might want to implement a proper phone verification system in production
    // Ensure the email format is valid by adding proper domain structure
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const email = `user.${cleanPhone}@hubbly.app`;
    
    // Check if user already exists before trying to sign up
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.getUser()).data?.user?.id)
      .maybeSingle();
      
    if (existingUser) {
      return { 
        data: { user: existingUser }, 
        error: { message: "User already exists. Please log in instead." } 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: phoneNumber
        }
      }
    });
    
    if (error) {
      // Handle rate limit errors more gracefully
      if (error.message.includes('rate limit') || error.message.includes('exceeded')) {
        console.error('Rate limit error:', error);
        return { 
          data: null, 
          error: { 
            message: "Too many sign-up attempts. Please try again later or use a different phone number." 
          } 
        };
      }
      
      // Return the error
      return { data: null, error };
    }
    
    // Return the data
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      data: null, 
      error: { 
        message: error.message || "An unexpected error occurred during sign up." 
      } 
    };
  }
}

/**
 * Sign up or sign in with phone number using OTP
 * @param {string} phoneNumber - The user's phone number in international format (e.g., +1234567890)
 * @returns {Promise} - The result of the OTP request
 */
async function signInWithPhoneOTP(phoneNumber) {
  try {
    // Format the phone number to ensure it's in E.164 format
    let formattedPhone = phoneNumber;
    
    // If the phone number doesn't start with +, add it
    if (!formattedPhone.startsWith('+')) {
      // Assume US number if no country code
      formattedPhone = '+1' + formattedPhone.replace(/\D/g, '');
    }
    
    // Ensure the phone number is properly formatted (remove any non-digit characters except the leading +)
    formattedPhone = '+' + formattedPhone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    
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
    console.error('Sign in with phone OTP error:', error);
    return { 
      success: false, 
      error, 
      message: 'Unexpected error sending OTP' 
    };
  }
}

/**
 * Verify OTP sent to phone
 * @param {string} phoneNumber - The user's phone number in international format (e.g., +1234567890)
 * @param {string} otp - The OTP received via SMS
 * @returns {Promise} - The result of the verification
 */
async function verifyPhoneOTP(phoneNumber, otp) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: 'sms'
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
      user: data.user,
      session: data.session,
      message: 'Phone number verified successfully'
    };
  } catch (error) {
    console.error('Verify phone OTP error:', error);
    return {
      success: false,
      error,
      message: 'Unexpected error verifying OTP'
    };
  }
}

/**
 * Sign in a user with phone number and password
 * @param {string} phoneNumber - The user's phone number or email
 * @param {string} password - The user's password
 * @returns {Promise} - The result of the sign-in operation
 */
async function signInWithPhone(phoneNumber, password) {
  try {
    // Check if the input is a phone number or email
    const isEmail = phoneNumber.includes('@');
    let email = phoneNumber;
    
    // If it's a phone number, convert it to our email format
    if (!isEmail) {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      email = `user.${cleanPhone}@hubbly.app`;
    }
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        console.error('Invalid login credentials:', error);
        return { 
          data: null, 
          error: { 
            message: "Invalid phone number or password. Please try again." 
          } 
        };
      }
      
      // Return the error
      return { data: null, error };
    }
    
    // Check if the user has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    
    if (!profileError && profileData) {
      // Add profile data to user metadata
      data.user.user_metadata = {
        ...data.user.user_metadata,
        hasProfile: true,
        profile: profileData
      };
    } else {
      // User doesn't have a profile yet
      data.user.user_metadata = {
        ...data.user.user_metadata,
        hasProfile: false
      };
    }
    
    // Return the data
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      data: null, 
      error: { 
        message: error.message || "An unexpected error occurred during sign in." 
      } 
    };
  }
}

/**
 * Sign out the current user
 * @returns {Promise} - The result of the sign-out operation
 */
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error in signOut:', error);
    return { error };
  }
}

/**
 * Confirm a test email account (for demo purposes only)
 * @param {string} email - The email to confirm
 * @returns {Promise} - Result of the confirmation
 */
async function confirmTestEmail(email) {
  try {
    // For demo purposes, we'll use the admin client to confirm the email
    // This would normally be done via email confirmation link
    
    // First, find the user by email
    const { data: users, error: userError } = await supabaseAdmin
      .auth
      .admin
      .listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return { success: false, error: userError };
    }
    
    const adminUser = users?.users?.find(user => user.email === email);
    
    if (!adminUser) {
      console.error('User not found:', email);
      return { success: false, error: { message: 'User not found' } };
    }
    
    // Update the user to confirm their email
    const { data, error } = await supabaseAdmin
      .auth
      .admin
      .updateUserById(adminUser.id, {
        email_confirmed_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error confirming email:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in confirmTestEmail:', error);
    return { success: false, error };
  }
}

/**
 * Get the current user's session
 * @returns {Promise} - The current user's session
 */
async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return { session: null, error };
  }
}

/**
 * Get the current user's profile
 * @returns {Promise} - The current user's profile data
 */
async function getCurrentUserProfile() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) return { profile: null, error: { message: 'No active session' } };
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    return { profile, error: null };
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return { profile: null, error };
  }
}

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

    // First check if the user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (existingUser?.user) {
      console.log("Admin user already exists, signing in");
      return {
        success: true,
        user: existingUser.user,
        session: existingUser.session,
        message: "Admin user already exists, signed in successfully"
      };
    }

    // Create the admin user
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
  } catch (error) {
    console.error('Admin creation error:', error);
    return {
      success: false,
      error,
      message: "Unexpected error creating admin user"
    };
  }
}

module.exports = {
  signUpWithPhone,
  signInWithPhone,
  signInWithPhoneOTP,
  verifyPhoneOTP,
  signOut,
  confirmTestEmail,
  getCurrentSession,
  getCurrentUserProfile,
  createAdminUser
};
