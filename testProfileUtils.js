/**
 * Test script for profile utilities
 */
const { getAllProfiles, getProfileById, getCompleteProfile } = require('./lib/profileUtils');

async function testProfileUtils() {
  console.log('Testing profile utilities...');
  
  try {
    // Test getting all profiles
    console.log('\n1. Testing getAllProfiles:');
    const allProfiles = await getAllProfiles({ limit: 10 });
    console.log(`Found ${allProfiles.data.length} profiles in total`);
    
    if (allProfiles.data.length > 0) {
      console.log('Sample profile:', allProfiles.data[0]);
    }
    
    // Test getting only demo profiles
    console.log('\n2. Testing getAllProfiles with onlyDemoProfiles=true:');
    const demoProfiles = await getAllProfiles({ 
      limit: 10, 
      onlyDemoProfiles: true 
    });
    console.log(`Found ${demoProfiles.data.length} demo profiles`);
    
    if (demoProfiles.data.length > 0) {
      // Use the first demo profile ID for subsequent tests
      const demoProfileId = demoProfiles.data[0].id;
      console.log('Sample demo profile ID:', demoProfileId);
      
      // Test getting a specific profile by ID
      console.log('\n3. Testing getProfileById:');
      const profileById = await getProfileById(demoProfileId);
      console.log('Profile source:', profileById.source);
      console.log('Profile data:', profileById.data);
      
      // Test getting complete profile with related data
      console.log('\n4. Testing getCompleteProfile:');
      const completeProfile = await getCompleteProfile(demoProfileId);
      
      if (completeProfile.data) {
        console.log('Complete profile data:');
        console.log('- Profile ID:', completeProfile.data.id);
        console.log('- Name:', completeProfile.data.name);
        
        // Log match preferences if available
        if (completeProfile.data.demo_match_preferences && completeProfile.data.demo_match_preferences.length > 0) {
          console.log('- Match Preferences:', completeProfile.data.demo_match_preferences[0]);
        }
        
        // Log family details if available
        if (completeProfile.data.demo_family_details && completeProfile.data.demo_family_details.length > 0) {
          console.log('- Family Details:', completeProfile.data.demo_family_details[0]);
        }
        
        // Log parents if available
        if (completeProfile.data.demo_parents && completeProfile.data.demo_parents.length > 0) {
          console.log(`- Parents: ${completeProfile.data.demo_parents.length} found`);
        }
        
        // Log siblings if available
        if (completeProfile.data.demo_siblings && completeProfile.data.demo_siblings.length > 0) {
          console.log(`- Siblings: ${completeProfile.data.demo_siblings.length} found`);
        }
      } else {
        console.log('Error getting complete profile:', completeProfile.error);
      }
    } else {
      console.log('No demo profiles found. Please run testDemoProfile.js first to create a demo profile.');
    }
    
    console.log('\nProfile utilities test completed!');
  } catch (error) {
    console.error('Error in testProfileUtils:', error);
  }
}

// Run the test
testProfileUtils().catch(console.error);
