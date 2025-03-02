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
    let profileId;
    
    // For regular (non-demo) profiles, use the authenticated user's ID
    // For demo profiles, generate a random UUID
    if (!isDemo) {
      // Get the current user's ID from the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        return { 
          success: false, 
          error: { message: "No authenticated user found. Cannot save to regular profiles." } 
        };
      }
      
      profileId = session.user.id;
      console.log(`Using authenticated user ID for regular profile: ${profileId}`);
    } else {
      // Generate a UUID for demo profiles
      profileId = generateUUID();
      console.log(`Generated new UUID for demo profile: ${profileId}`);
    }
    
    console.log(`Saving ${isDemo ? 'demo' : 'regular'} profile with ID:`, profileId);
    
    // Determine table prefix based on isDemo flag
    const tablePrefix = isDemo ? 'demo_' : '';
    
    // First check if the profiles table exists
    const { error: tableCheckError } = await supabaseAdmin
      .from(`${tablePrefix}profiles`)
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error(`Error checking ${tablePrefix}profiles table:`, tableCheckError);
      
      if (tableCheckError.message && tableCheckError.message.includes('does not exist')) {
        console.error(`The ${tablePrefix}profiles table does not exist. Please run the SQL commands provided by the database setup script.`);
        return { 
          success: false, 
          error: tableCheckError, 
          message: `${tablePrefix}profiles table does not exist` 
        };
      }
    }
    
    // Create the profile record with all available fields
    const profileRecord = {
      id: profileId,
      name: profileData.name
    };
    
    // Add all other fields if they exist
    if (profileData.dateOfBirth) profileRecord.date_of_birth = profileData.dateOfBirth;
    if (profileData.gender) profileRecord.gender = profileData.gender;
    if (profileData.height) profileRecord.height = profileData.height;
    if (profileData.ethnicity) profileRecord.ethnicity = profileData.ethnicity;
    if (profileData.location) profileRecord.location = profileData.location;
    if (profileData.nationality) profileRecord.nationality = profileData.nationality;
    if (profileData.educationLevel) profileRecord.education_level = profileData.educationLevel;
    if (profileData.university) profileRecord.university = profileData.university;
    if (profileData.occupation) profileRecord.occupation = profileData.occupation;
    if (profileData.company) profileRecord.company = profileData.company;
    if (profileData.profilePicUrl) profileRecord.profile_pic_url = profileData.profilePicUrl;
    if (profileData.maritalStatus) profileRecord.marital_status = profileData.maritalStatus;
    
    // Safely handle boolean values
    if (profileData.hasChildren !== undefined && profileData.hasChildren !== '') {
      profileRecord.has_children = safeBoolean(profileData.hasChildren);
    }
    
    if (profileData.numberOfChildren) profileRecord.number_of_children = profileData.numberOfChildren;
    if (profileData.religion) profileRecord.religion = profileData.religion;
    if (profileData.islamicSect) profileRecord.islamic_sect = profileData.islamicSect;
    
    // Only add otherSect if it's not an empty string
    if (profileData.otherSect && profileData.otherSect !== '') {
      profileRecord.other_sect = profileData.otherSect;
    }
    
    // Safely handle boolean values
    if (profileData.coverHead !== undefined && profileData.coverHead !== '') {
      profileRecord.cover_head = safeBoolean(profileData.coverHead);
    }
    
    // Only add coverHeadType if it's not an empty string
    if (profileData.coverHeadType && profileData.coverHeadType !== '') {
      profileRecord.cover_head_type = profileData.coverHeadType;
    }
    
    if (profileData.monthlyIncome) profileRecord.monthly_income = profileData.monthlyIncome;
    
    // Insert the profile record
    const { error: profileError } = await supabaseAdmin
      .from(`${tablePrefix}profiles`)
      .insert(profileRecord);
    
    if (profileError) {
      console.error(`Error saving to ${tablePrefix}profiles:`, profileError);
      return { success: false, error: profileError };
    }
    
    console.log(`Profile saved successfully to ${tablePrefix}profiles`);
    
    // Save match preferences if provided
    if (profileData.matchPreferences) {
      try {
        // Check if match_preferences table exists
        const { error: mpCheckError } = await supabaseAdmin
          .from(`${tablePrefix}match_preferences`)
          .select('profile_id')
          .limit(1);
        
        if (mpCheckError && mpCheckError.message && mpCheckError.message.includes('does not exist')) {
          console.warn(`${tablePrefix}match_preferences table does not exist. Match preferences will not be saved.`);
          console.warn('Please run the SQL commands provided by the database setup script to create the table.');
        } else {
          // Create match preferences record
          const mpRecord = {
            profile_id: profileId
          };
          
          if (profileData.matchPreferences.minAge) mpRecord.min_age = profileData.matchPreferences.minAge;
          if (profileData.matchPreferences.maxAge) mpRecord.max_age = profileData.matchPreferences.maxAge;
          if (profileData.matchPreferences.preferredEthnicities) mpRecord.preferred_ethnicities = profileData.matchPreferences.preferredEthnicities;
          if (profileData.matchPreferences.preferredLocations) mpRecord.preferred_locations = profileData.matchPreferences.preferredLocations;
          
          // Convert heightRange string to a proper PostgreSQL array
          if (profileData.matchPreferences.heightRange) {
            // If it's already an array, use it directly
            if (Array.isArray(profileData.matchPreferences.heightRange)) {
              mpRecord.height_range = profileData.matchPreferences.heightRange;
            } 
            // If it's a string like "160cm - 175cm", convert it to an array of numbers
            else if (typeof profileData.matchPreferences.heightRange === 'string') {
              // Extract numbers from the string
              const matches = profileData.matchPreferences.heightRange.match(/\d+/g);
              if (matches && matches.length >= 2) {
                // Convert to numeric array
                mpRecord.height_range = matches.map(num => parseFloat(num));
              } else {
                // Default range if parsing fails
                console.warn('Could not parse height range string, using default range');
                mpRecord.height_range = [150, 190];
              }
            }
          }
          
          const { error: mpError } = await supabaseAdmin
            .from(`${tablePrefix}match_preferences`)
            .insert(mpRecord);
          
          if (mpError) {
            console.error(`Error saving match preferences to ${tablePrefix}match_preferences:`, mpError);
          } else {
            console.log(`Match preferences saved successfully to ${tablePrefix}match_preferences`);
          }
        }
      } catch (mpError) {
        console.error(`Error checking/saving match preferences to ${tablePrefix}match_preferences:`, mpError);
      }
    }
    
    // Save family details if provided
    if (profileData.familyDetails) {
      try {
        // First check if family_details table exists
        const { error: checkError } = await supabaseAdmin
          .from(`${tablePrefix}family_details`)
          .select('id')
          .limit(1);
        
        // If the table doesn't exist, log a message but continue with other tables
        if (checkError && (checkError.message.includes('does not exist'))) {
          console.warn(`${tablePrefix}family_details table does not exist. Family details will not be saved.`);
          console.warn('Please run the SQL commands provided by the database setup script to create the table.');
        } else {
          // Create family details record
          const fdRecord = {
            profile_id: profileId
          };
          
          if (profileData.familyDetails.environment) fdRecord.family_environment = profileData.familyDetails.environment;
          if (profileData.familyDetails.additionalInfo) fdRecord.additional_info = profileData.familyDetails.additionalInfo;
          
          const { error: fdError } = await supabaseAdmin
            .from(`${tablePrefix}family_details`)
            .insert(fdRecord);
          
          if (fdError) {
            console.error(`Error saving family details to ${tablePrefix}family_details:`, fdError);
          } else {
            console.log(`Family details saved successfully to ${tablePrefix}family_details`);
          }
          
          // Save parents if provided
          if (profileData.familyDetails.parents && profileData.familyDetails.parents.length > 0) {
            try {
              // Check if parents table exists
              const { error: parentsCheckError } = await supabaseAdmin
                .from(`${tablePrefix}parents`)
                .select('profile_id')
                .limit(1);
              
              if (parentsCheckError && parentsCheckError.message && parentsCheckError.message.includes('does not exist')) {
                console.warn(`${tablePrefix}parents table does not exist. Parents will not be saved.`);
                console.warn('Please run the SQL commands provided by the database setup script to create the table.');
              } else {
                // Save each parent
                for (const parent of profileData.familyDetails.parents) {
                  try {
                    const parentRecord = {
                      profile_id: profileId,
                      name: parent.name || 'Parent'
                    };
                    
                    if (parent.relationship) parentRecord.relationship = parent.relationship;
                    if (parent.alive !== undefined) parentRecord.alive = parent.alive;
                    if (parent.maritalStatus) parentRecord.marital_status = parent.maritalStatus;
                    if (parent.cityOfResidence) parentRecord.city_of_residence = parent.cityOfResidence;
                    if (parent.areaOfResidence) parentRecord.area_of_residence = parent.areaOfResidence;
                    if (parent.profilePicUrl) parentRecord.profile_pic_url = parent.profilePicUrl;
                    if (parent.educationLevel) parentRecord.education_level = parent.educationLevel;
                    if (parent.occupation) parentRecord.occupation = parent.occupation;
                    
                    const { error: parentError } = await supabaseAdmin
                      .from(`${tablePrefix}parents`)
                      .insert(parentRecord);
                    
                    if (parentError) {
                      console.error(`Error saving parent to ${tablePrefix}parents:`, parentError);
                    } else {
                      console.log(`Parent saved successfully to ${tablePrefix}parents`);
                    }
                  } catch (parentError) {
                    console.error(`Error processing parent:`, parentError);
                  }
                }
              }
            } catch (parentsError) {
              console.error(`Error checking/saving parents to ${tablePrefix}parents:`, parentsError);
            }
          }
          
          // Save siblings if provided
          if (profileData.familyDetails.siblings && profileData.familyDetails.siblings.length > 0) {
            try {
              // Check if siblings table exists
              const { error: siblingsCheckError } = await supabaseAdmin
                .from(`${tablePrefix}siblings`)
                .select('profile_id')
                .limit(1);
              
              if (siblingsCheckError && siblingsCheckError.message && siblingsCheckError.message.includes('does not exist')) {
                console.warn(`${tablePrefix}siblings table does not exist. Siblings will not be saved.`);
                console.warn('Please run the SQL commands provided by the database setup script to create the table.');
              } else {
                // Save each sibling
                for (const sibling of profileData.familyDetails.siblings) {
                  try {
                    const siblingRecord = {
                      profile_id: profileId,
                      name: sibling.name || 'Sibling'
                    };
                    
                    if (sibling.gender) siblingRecord.gender = sibling.gender;
                    if (sibling.maritalStatus) siblingRecord.marital_status = sibling.maritalStatus;
                    if (sibling.educationLevel) siblingRecord.education_level = sibling.educationLevel;
                    if (sibling.occupation) siblingRecord.occupation = sibling.occupation;
                    if (sibling.profilePicUrl) siblingRecord.profile_pic_url = sibling.profilePicUrl;
                    
                    const { error: siblingError } = await supabaseAdmin
                      .from(`${tablePrefix}siblings`)
                      .insert(siblingRecord);
                    
                    if (siblingError) {
                      console.error(`Error saving sibling to ${tablePrefix}siblings:`, siblingError);
                    } else {
                      console.log(`Sibling saved successfully to ${tablePrefix}siblings`);
                    }
                  } catch (siblingError) {
                    console.error(`Error processing sibling:`, siblingError);
                  }
                }
              }
            } catch (siblingsError) {
              console.error(`Error checking/saving siblings to ${tablePrefix}siblings:`, siblingsError);
            }
          }
        }
      } catch (familyError) {
        console.error(`Error saving family details to ${tablePrefix}family_details:`, familyError);
      }
    }
    
    return {
      success: true,
      data: {
        profileId,
        message: `Profile saved successfully to ${tablePrefix}profiles`
      }
    };
  } catch (error) {
    console.error('Error in saveProfile:', error);
    return { success: false, error };
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
  saveRegularProfile
};
