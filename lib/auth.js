const { supabase } = require('./supabaseClient');

/**
 * Sign up a new user with phone number and password
 * @param {string} phoneNumber - The user's phone number
 * @param {string} password - The user's password
 * @returns {Promise} - The result of the sign-up operation
 */
async function signUpWithPhone(phoneNumber, password) {
  try {
    // First, check if the phone number is already registered
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('phone_number')
      .eq('phone_number', phoneNumber)
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }
    
    if (existingUsers) {
      return { error: { message: 'This phone number is already registered' } };
    }
    
    // Sign up the user with email (we'll use phone as email for simplicity)
    // You might want to implement a proper phone verification system in production
    const email = `${phoneNumber.replace(/[^0-9]/g, '')}@hubbly.app`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      phone: phoneNumber,
      options: {
        data: {
          phone_number: phoneNumber
        }
      }
    });
    
    if (error) throw error;
    
    // Create a profile record for the new user
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id,
            phone_number: phoneNumber
          }
        ]);
      
      if (profileError) throw profileError;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
}

/**
 * Sign in a user with phone number and password
 * @param {string} phoneNumber - The user's phone number
 * @param {string} password - The user's password
 * @returns {Promise} - The result of the sign-in operation
 */
async function signInWithPhone(phoneNumber, password) {
  try {
    // Convert phone to email format for authentication
    const email = `${phoneNumber.replace(/[^0-9]/g, '')}@hubbly.app`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise} - The result of the sign-out operation
 */
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

/**
 * Get the current user's session
 * @returns {Promise} - The current user's session
 */
async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { data: null, error };
  }
}

/**
 * Get the current user's profile
 * @returns {Promise} - The current user's profile data
 */
async function getCurrentUserProfile() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!sessionData?.session?.user) {
      return { data: null, error: { message: 'No user logged in' } };
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { data: null, error };
  }
}

module.exports = {
  signUpWithPhone,
  signInWithPhone,
  signOut,
  getCurrentSession,
  getCurrentUserProfile
};
