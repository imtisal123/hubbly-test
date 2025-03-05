const { supabase } = require('./supabaseClient');

/**
 * Update a user's profile information
 * @param {string} userId - The user's ID
 * @param {object} profileData - The profile data to update
 * @returns {Promise} - The result of the update operation
 */
async function updateProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}

/**
 * Add or update a parent's information
 * @param {string} userId - The user's ID
 * @param {string} parentType - Either 'mother' or 'father'
 * @param {object} parentData - The parent data to save
 * @returns {Promise} - The result of the operation
 */
async function saveParentInfo(userId, parentType, parentData) {
  try {
    // Check if parent record already exists
    const { data: existingParent, error: searchError } = await supabase
      .from('parents')
      .select('id')
      .eq('profile_id', userId)
      .eq('parent_type', parentType)
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }
    
    // Remove fields that don't correspond to screen fields
    const cleanedParentData = { ...parentData };
    delete cleanedParentData.nationality;
    delete cleanedParentData.religion;
    delete cleanedParentData.ethnicity;
    // Don't delete occupation/profession as we need it
    
    let result;
    
    if (existingParent) {
      // Update existing parent record
      result = await supabase
        .from('parents')
        .update(cleanedParentData)
        .eq('id', existingParent.id);
    } else {
      // Create new parent record
      result = await supabase
        .from('parents')
        .insert([
          { 
            profile_id: userId,
            parent_type: parentType,
            ...cleanedParentData
          }
        ]);
    }
    
    if (result.error) throw result.error;
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error(`Error saving ${parentType} information:`, error);
    return { data: null, error };
  }
}

/**
 * Add a sibling to the user's profile
 * @param {string} userId - The user's ID
 * @param {object} siblingData - The sibling data to save
 * @returns {Promise} - The result of the operation
 */
async function addSibling(userId, siblingData) {
  try {
    // Ensure proper field mapping
    const mappedSiblingData = {
      ...siblingData,
      profile_id: userId,
      profession: siblingData.profession,
      city_of_residence: siblingData.cityOfResidence,
      area_of_residence: siblingData.areaOfResidence,
      marital_status: siblingData.maritalStatus
    };
    
    // Remove any properties that don't match database columns
    delete mappedSiblingData.cityOfResidence;
    delete mappedSiblingData.areaOfResidence;
    
    const { data, error } = await supabase
      .from('siblings')
      .insert([mappedSiblingData]);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error adding sibling:', error);
    return { data: null, error };
  }
}

/**
 * Update a sibling's information
 * @param {string} siblingId - The sibling's ID
 * @param {object} siblingData - The sibling data to update
 * @returns {Promise} - The result of the update operation
 */
async function updateSibling(siblingId, siblingData) {
  try {
    const { data, error } = await supabase
      .from('siblings')
      .update(siblingData)
      .eq('id', siblingId);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating sibling:', error);
    return { data: null, error };
  }
}

/**
 * Get all siblings for a user
 * @param {string} userId - The user's ID
 * @returns {Promise} - The siblings data
 */
async function getSiblings(userId) {
  try {
    const { data, error } = await supabase
      .from('siblings')
      .select('*')
      .eq('profile_id', userId);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting siblings:', error);
    return { data: null, error };
  }
}

/**
 * Save or update match preferences
 * @param {string} userId - The user's ID
 * @param {object} preferencesData - The preferences data to save
 * @returns {Promise} - The result of the operation
 */
async function saveMatchPreferences(userId, preferencesData) {
  try {
    // Check if preferences record already exists
    const { data: existingPreferences, error: searchError } = await supabase
      .from('match_preferences')
      .select('id')
      .eq('profile_id', userId)
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }
    
    let result;
    
    if (existingPreferences) {
      // Update existing preferences
      result = await supabase
        .from('match_preferences')
        .update(preferencesData)
        .eq('id', existingPreferences.id);
    } else {
      // Create new preferences
      result = await supabase
        .from('match_preferences')
        .insert([
          { 
            profile_id: userId,
            ...preferencesData
          }
        ]);
    }
    
    if (result.error) throw result.error;
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error saving match preferences:', error);
    return { data: null, error };
  }
}

/**
 * Upload a profile picture to Supabase Storage
 * @param {string} userId - The user's ID
 * @param {string} uri - The local URI of the image
 * @param {string} type - The type of profile picture (user, mother, father, sibling)
 * @param {string} [relatedId] - The ID of the related entity (for siblings)
 * @returns {Promise} - The result of the upload operation
 */
async function uploadProfilePicture(userId, uri, type, relatedId = null) {
  try {
    // Convert URI to Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate a unique file name
    const fileExt = uri.split('.').pop();
    const fileName = `${userId}_${type}${relatedId ? `_${relatedId}` : ''}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${type}/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, blob);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;
    
    // Update the appropriate record with the new profile picture URL
    let updateResult;
    
    if (type === 'user') {
      updateResult = await updateProfile(userId, { profile_pic_url: publicUrl });
    } else if (type === 'mother' || type === 'father') {
      // Find the parent record
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('profile_id', userId)
        .eq('parent_type', type)
        .single();
      
      if (parentError && parentError.code !== 'PGRST116') throw parentError;
      
      if (parentData) {
        updateResult = await supabase
          .from('parents')
          .update({ profile_pic_url: publicUrl })
          .eq('id', parentData.id);
      }
    } else if (type === 'sibling' && relatedId) {
      updateResult = await updateSibling(relatedId, { profile_pic_url: publicUrl });
    }
    
    if (updateResult?.error) throw updateResult.error;
    
    return { publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { publicUrl: null, error };
  }
}

module.exports = {
  updateProfile,
  saveParentInfo,
  addSibling,
  updateSibling,
  getSiblings,
  saveMatchPreferences,
  uploadProfilePicture
};
