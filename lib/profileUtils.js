/**
 * Utility functions for working with profiles
 */
const { supabase } = require('./supabaseClient');

/**
 * Get all profiles including both regular and demo profiles
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of profiles to return
 * @param {number} options.offset - Number of profiles to skip
 * @param {boolean} options.includeDemoProfiles - Whether to include demo profiles
 * @param {boolean} options.onlyDemoProfiles - Whether to only return demo profiles
 * @param {Array<string>} options.select - Fields to select
 * @returns {Promise<Object>} - The profiles data
 */
async function getAllProfiles(options = {}) {
  const {
    limit = 50,
    offset = 0,
    includeDemoProfiles = true,
    onlyDemoProfiles = false,
    select = '*'
  } = options;

  try {
    let regularProfiles = { data: [], error: null };
    let demoProfiles = { data: [], error: null };

    // Get regular profiles if requested
    if (!onlyDemoProfiles) {
      regularProfiles = await supabase
        .from('profiles')
        .select(select)
        .range(offset, offset + limit - 1);
      
      if (regularProfiles.error) {
        console.error('Error fetching regular profiles:', regularProfiles.error);
      }
    }

    // Get demo profiles if requested
    if (includeDemoProfiles || onlyDemoProfiles) {
      demoProfiles = await supabase
        .from('demo_profiles')
        .select(select)
        .range(offset, offset + limit - 1);
      
      if (demoProfiles.error) {
        console.error('Error fetching demo profiles:', demoProfiles.error);
      }
    }

    // Combine the results
    const combinedData = [
      ...(regularProfiles.data || []),
      ...(demoProfiles.data || [])
    ];

    // Return the combined results
    return {
      data: combinedData,
      regularProfilesError: regularProfiles.error,
      demoProfilesError: demoProfiles.error
    };
  } catch (error) {
    console.error('Error in getAllProfiles:', error);
    return { data: [], error };
  }
}

/**
 * Get a profile by ID, checking both regular and demo profiles
 * @param {string} profileId - The profile ID to look for
 * @param {Object} options - Query options
 * @param {Array<string>} options.select - Fields to select
 * @returns {Promise<Object>} - The profile data
 */
async function getProfileById(profileId, options = {}) {
  const { select = '*' } = options;

  try {
    // First try regular profiles
    const { data: regularProfile, error: regularError } = await supabase
      .from('profiles')
      .select(select)
      .eq('id', profileId)
      .maybeSingle();
    
    // If found in regular profiles, return it
    if (regularProfile) {
      return { data: regularProfile, source: 'regular' };
    }

    // If not found, try demo profiles
    const { data: demoProfile, error: demoError } = await supabase
      .from('demo_profiles')
      .select(select)
      .eq('id', profileId)
      .maybeSingle();
    
    // If found in demo profiles, return it
    if (demoProfile) {
      return { data: demoProfile, source: 'demo' };
    }

    // If not found in either, return null with errors
    return { 
      data: null, 
      regularError, 
      demoError,
      message: 'Profile not found in either regular or demo profiles'
    };
  } catch (error) {
    console.error('Error in getProfileById:', error);
    return { data: null, error };
  }
}

/**
 * Get a profile with all related data (match preferences, family details, etc.)
 * @param {string} profileId - The profile ID to look for
 * @returns {Promise<Object>} - The complete profile data with related information
 */
async function getCompleteProfile(profileId) {
  try {
    // First determine if this is a regular or demo profile
    const { data: profile, source } = await getProfileById(profileId);
    
    if (!profile) {
      return { data: null, message: 'Profile not found' };
    }

    // Based on the source, query the appropriate tables
    if (source === 'regular') {
      // For regular profiles
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          match_preferences(*),
          family_details(*),
          parents(*),
          siblings(*)
        `)
        .eq('id', profileId)
        .maybeSingle();
      
      return { data, error };
    } else {
      // For demo profiles
      const { data, error } = await supabase
        .from('demo_profiles')
        .select(`
          *,
          demo_match_preferences(*),
          demo_family_details(*),
          demo_parents(*),
          demo_siblings(*)
        `)
        .eq('id', profileId)
        .maybeSingle();
      
      return { data, error };
    }
  } catch (error) {
    console.error('Error in getCompleteProfile:', error);
    return { data: null, error };
  }
}

module.exports = {
  getAllProfiles,
  getProfileById,
  getCompleteProfile
};
