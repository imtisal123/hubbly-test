/**
 * Functions for handling demo data
 */
const { supabaseAdmin, supabase } = require('./supabaseClient');
const { v4: uuidv4 } = require('uuid');

// Polyfill for crypto.getRandomValues in React Native environment
// This is needed because React Native doesn't have a native implementation of crypto.getRandomValues
if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
  const getRandomValues = (arr) => {
    // Simple polyfill using Math.random
    // Not as secure as the native implementation, but sufficient for demo IDs
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  };
  
  // Create a global crypto object if it doesn't exist
  if (typeof crypto === 'undefined') {
    global.crypto = {};
  }
  
  // Add the getRandomValues method to the crypto object
  global.crypto.getRandomValues = getRandomValues;
  
  console.log('Added polyfill for crypto.getRandomValues');
}

// Generate a UUID that works in both Node.js and React Native
function generateUUID() {
  try {
    return uuidv4();
  } catch (error) {
    console.error('Error generating UUID:', error);
    
    // Fallback UUID generator if uuidv4 fails
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Helper function to safely handle boolean values
function safeBoolean(value) {
  if (value === '' || value === null || value === undefined) {
    return null; // Return null for empty values
  }
  return Boolean(value); // Convert to boolean
}

// Use hardcoded keys if environment variables are not available
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';
const supabaseSecret = process.env.SUPABASE_SECRET || 'your-supabase-secret';

/**
 * Save profile data to Supabase
 * This function saves profile data to the appropriate tables based on whether it's a demo or not
 * @param {Object} profileData - The profile data to save
 * @param {boolean} isDemo - Whether to save to demo tables (true) or regular tables (false)
 * @returns {Promise} - The result of the save operation
 */
async function saveProfile(profileData, isDemo = false) {
  try {
    // Get the current user's ID from the session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    // If no user ID is found and we're not in demo mode, return an error
    if (!userId && !isDemo) {
      console.error('No user ID found in session and not in demo mode');
      return { error: 'No user ID found in session' };
    }

    // Generate a random UUID for demo profiles
    const profileId = isDemo ? uuidv4() : userId;

    // Table names based on whether this is a demo profile
    const profilesTable = isDemo ? 'demo_profiles' : 'profiles';
    const matchPreferencesTable = isDemo ? 'demo_match_preferences' : 'match_preferences';
    const familyDetailsTable = isDemo ? 'demo_family_details' : 'family_details';
    const parentsTable = isDemo ? 'demo_parents' : 'parents';
    const siblingsTable = isDemo ? 'demo_siblings' : 'siblings';

    // Insert into profiles table
    const { error: profileError } = await supabase
      .from(profilesTable)
      .upsert({
        id: profileId,
        name: profileData.name,
        gender: profileData.gender,
        ethnicity: profileData.ethnicity,
        nationality: profileData.nationality,
        education_level: profileData.educationLevel,
        profession: profileData.occupation,
        location: profileData.location,
        height: profileData.height,
        marital_status: profileData.maritalStatus,
        has_children: safeBoolean(profileData.hasChildren),
        is_demo: isDemo
      });

    if (profileError) {
      console.error('Error saving profile:', profileError);
      return { error: profileError };
    }

    // Insert into match_preferences table
    if (profileData.matchPreferences) {
      const { error: matchPrefError } = await supabase
        .from(matchPreferencesTable)
        .upsert({
          id: profileId,
          preferred_ethnicities: profileData.matchPreferences.preferredEthnicities,
          preferred_locations: profileData.matchPreferences.preferredLocations,
          height_range: profileData.matchPreferences.heightRange,
          is_demo: isDemo
        });

      if (matchPrefError) {
        console.error('Error saving match preferences:', matchPrefError);
        return { error: matchPrefError };
      }
    }

    // Insert into family_details table
    if (profileData.livingArrangement || profileData.familyOrigin || profileData.familyType) {
      
      const { error: familyDetailsError } = await supabase
        .from(familyDetailsTable)
        .upsert({
          id: profileId,
          living_arrangement: profileData.livingArrangement,
          family_origin: profileData.familyOrigin,
          family_type: profileData.familyType,
          is_demo: isDemo
        });

      if (familyDetailsError) {
        console.error('Error saving family details:', familyDetailsError);
        return { error: familyDetailsError };
      }
    }

    // Insert parent data if provided
    if (profileData.parents && profileData.parents.length > 0) {
      const parentsWithIds = profileData.parents.map(parent => ({
        ...parent,
        profile_id: profileId,
        profession: parent.profession,
        city_of_residence: parent.cityOfResidence,
        area_of_residence: parent.areaOfResidence,
        marital_status: parent.maritalStatus,
        is_demo: isDemo
      }));
      
      const { error: parentsError } = await supabase
        .from(parentsTable)
        .upsert(parentsWithIds);
        
      if (parentsError) {
        console.error('Error saving parents:', parentsError);
        return { error: parentsError };
      }
    }

    // Insert siblings data if provided
    if (profileData.siblings && profileData.siblings.length > 0) {
      const siblingsWithIds = profileData.siblings.map(sibling => ({
        ...sibling,
        profile_id: profileId,
        profession: sibling.profession,
        education_level: sibling.education,
        city_of_residence: sibling.cityOfResidence,
        area_of_residence: sibling.areaOfResidence,
        marital_status: sibling.maritalStatus,
        is_demo: isDemo
      }));
      
      const { error: siblingsError } = await supabase
        .from(siblingsTable)
        .upsert(siblingsWithIds);
        
      if (siblingsError) {
        console.error('Error saving siblings:', siblingsError);
        return { error: siblingsError };
      }
    }

    return { data: { id: profileId, isDemo } };
  } catch (error) {
    console.error('Unexpected error in saveProfile:', error);
    return { error };
  }
}

/**
 * Save demo profile data to Supabase
 * This function allows saving profile data to demo tables
 * @param {Object} profileData - The profile data to save
 * @returns {Promise} - The result of the save operation
 */
async function saveDemoProfile(profileData) {
  return saveProfile(profileData, true);
}

/**
 * Save regular profile data to Supabase
 * This function saves profile data to regular (non-demo) tables
 * @param {Object} profileData - The profile data to save
 * @returns {Promise} - The result of the save operation
 */
async function saveRegularProfile(profileData) {
  return saveProfile(profileData, false);
}

module.exports = {
  saveDemoProfile,
  saveRegularProfile,
  saveProfile
};
