/**
 * Script to create 5 admin users with diverse profile data
 * This tests that admin profiles are correctly saved to all tables
 */
const { createAdminUser } = require('../lib/admin');
const { saveRegularProfile } = require('../lib/demoData');
const { supabase, supabaseAdmin } = require('../lib/supabaseClient');

// Arrays of sample data for generating diverse profiles
const firstNames = [
  'Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Omar'
];

const lastNames = [
  'Khan', 'Ahmed', 'Ali', 'Hassan', 'Malik'
];

const ethnicities = [
  'Pakistani', 'Indian', 'Bangladeshi', 'Arab', 'Persian'
];

const nationalities = [
  'American', 'British', 'Canadian', 'Australian', 'French'
];

const educationLevels = [
  'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Associate\'s'
];

const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Lawyer', 'Engineer'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'
];

const hobbies = [
  'Reading', 'Traveling', 'Cooking', 'Photography', 'Hiking'
];

const prayerFrequencies = [
  'Five times daily', 'Daily', 'Weekly', 'Occasionally', 'Rarely'
];

const smokingOptions = [
  'Never', 'Socially', 'Regularly', 'Trying to quit', 'Quit'
];

const drinkingOptions = [
  'Never', 'Socially', 'Occasionally', 'Regularly', 'Quit'
];

const dietPreferences = [
  'Halal only', 'Vegetarian', 'Vegan', 'No preference', 'Pescatarian'
];

const exerciseFrequencies = [
  'Daily', 'Several times a week', 'Weekly', 'Occasionally', 'Rarely'
];

const languages = [
  'English', 'Arabic', 'Urdu', 'Hindi', 'French', 'Spanish', 'Bengali', 'Turkish', 'Farsi'
];

// Generate random data for a profile with all fields
function generateRandomProfile(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = Math.floor(Math.random() * 20) + 20; // 20-40
  
  return {
    // Basic profile data
    name: `${firstName} ${lastName}`,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    educationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)],
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    height: Math.floor(Math.random() * 30) + 150, // 150-180 cm
    maritalStatus: Math.random() > 0.8 ? 'Divorced' : 'Single',
    hasChildren: Math.random() > 0.8,
    
    // Religious details
    religiosity: Math.floor(Math.random() * 5) + 1, // 1-5
    prayerFrequency: prayerFrequencies[Math.floor(Math.random() * prayerFrequencies.length)],
    quranReadingFrequency: prayerFrequencies[Math.floor(Math.random() * prayerFrequencies.length)],
    islamicEducation: Math.random() > 0.5 ? 'Formal' : 'Self-taught',
    islamicEducationDetails: 'Studied at local mosque',
    hijabPreference: Math.random() > 0.5 ? 'Preferred' : 'No preference',
    beardPreference: Math.random() > 0.5 ? 'Preferred' : 'No preference',
    halalStrict: Math.random() > 0.3,
    
    // Personal details
    smoking: smokingOptions[Math.floor(Math.random() * smokingOptions.length)],
    drinking: drinkingOptions[Math.floor(Math.random() * drinkingOptions.length)],
    dietPreference: dietPreferences[Math.floor(Math.random() * dietPreferences.length)],
    exerciseFrequency: exerciseFrequencies[Math.floor(Math.random() * exerciseFrequencies.length)],
    interests: [
      hobbies[Math.floor(Math.random() * hobbies.length)],
      hobbies[Math.floor(Math.random() * hobbies.length)]
    ],
    hobbies: [
      hobbies[Math.floor(Math.random() * hobbies.length)],
      hobbies[Math.floor(Math.random() * hobbies.length)]
    ],
    languages: [
      languages[Math.floor(Math.random() * languages.length)],
      languages[Math.floor(Math.random() * languages.length)]
    ],
    about: `I'm ${firstName}, a ${age}-year-old ${occupations[Math.floor(Math.random() * occupations.length)]} living in ${locations[Math.floor(Math.random() * locations.length)]}.`,
    
    // Match preferences
    matchPreferences: {
      minAge: Math.floor(Math.random() * 5) + 20, // 20-25
      maxAge: Math.floor(Math.random() * 10) + 30, // 30-40
      preferredEthnicities: [
        ethnicities[Math.floor(Math.random() * ethnicities.length)],
        ethnicities[Math.floor(Math.random() * ethnicities.length)]
      ],
      preferredLocations: [
        locations[Math.floor(Math.random() * locations.length)],
        locations[Math.floor(Math.random() * locations.length)]
      ],
      heightRange: [150, 180]
    }
  };
}

// Create admin user and save profile
async function createAdminAndProfile(index) {
  try {
    // Create unique email for this admin
    const timestamp = Date.now();
    const email = `admin_full_test${index}_${timestamp}@hubbly.app`;
    const password = `Admin123!${index}`;
    
    console.log(`Creating admin user ${index+1}/5: ${email}`);
    
    // Create the admin user
    const { success, data, error } = await createAdminUser(email, password);
    
    if (!success || error) {
      console.error(`Failed to create admin user ${index+1}:`, error);
      return { success: false, error };
    }
    
    console.log(`Admin user created successfully: ${email}`);
    
    // Generate random profile data with all fields
    const profileData = generateRandomProfile(index);
    
    // Sign in as this admin to get the session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) {
      console.error(`Failed to sign in as admin ${index+1}:`, signInError);
      return { success: false, error: signInError };
    }
    
    // Save profile to regular tables
    console.log(`Saving profile for admin ${index+1}...`);
    const { data: profileResult, error: profileError } = await saveRegularProfile(profileData);
    
    if (profileError) {
      console.error(`Failed to save profile for admin ${index+1}:`, profileError);
      return { success: false, error: profileError };
    }
    
    console.log(`Profile saved successfully for admin ${index+1}`);
    
    // Sign out
    await supabase.auth.signOut();
    
    // Get the user data from the session before signing out
    const { data: sessionData } = await supabase.auth.getSession();
    const userData = sessionData?.session?.user || { id: 'unknown' };
    
    return { 
      success: true, 
      data: { 
        user: userData, 
        profile: profileResult 
      } 
    };
  } catch (error) {
    console.error(`Error in createAdminAndProfile for index ${index}:`, error);
    return { success: false, error };
  }
}

// Verify that profiles were saved correctly to all tables
async function verifyProfiles() {
  try {
    console.log('\nVerifying profiles in all tables...');
    
    // Check regular profiles table
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('is_demo', false)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      console.log(`Found ${profiles.length} profiles in the regular profiles table`);
      if (profiles.length > 0) {
        console.log('Sample profile:', profiles[0].name);
      }
    }
    
    // Check match_preferences table
    const { data: matchPrefs, error: matchPrefsError } = await supabaseAdmin
      .from('match_preferences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (matchPrefsError) {
      console.error('Error fetching match preferences:', matchPrefsError);
    } else {
      console.log(`Found ${matchPrefs.length} records in the match_preferences table`);
    }
    
    // Check religious_details table
    const { data: religiousDetails, error: religiousDetailsError } = await supabaseAdmin
      .from('religious_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (religiousDetailsError) {
      console.error('Error fetching religious details:', religiousDetailsError);
    } else {
      console.log(`Found ${religiousDetails.length} records in the religious_details table`);
    }
    
    // Check personal_details table
    const { data: personalDetails, error: personalDetailsError } = await supabaseAdmin
      .from('personal_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (personalDetailsError) {
      console.error('Error fetching personal details:', personalDetailsError);
    } else {
      console.log(`Found ${personalDetails.length} records in the personal_details table`);
    }
    
    // Check family_details table
    const { data: familyDetails, error: familyDetailsError } = await supabaseAdmin
      .from('family_details')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (familyDetailsError) {
      console.error('Error fetching family details:', familyDetailsError);
    } else {
      console.log(`Found ${familyDetails.length} records in the family_details table`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in verifyProfiles:', error);
    return false;
  }
}

// Main function to create all admin profiles
async function createAllAdminProfiles() {
  console.log('Starting creation of 5 admin profiles with complete data...');
  
  const results = [];
  
  // Create admin users and profiles sequentially
  for (let i = 0; i < 5; i++) {
    const result = await createAdminAndProfile(i);
    results.push(result);
    
    // Longer delay to avoid rate limiting
    console.log(`Waiting 3 seconds before creating next admin...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Count successes and failures
  const successes = results.filter(r => r.success).length;
  const failures = results.filter(r => !r.success).length;
  
  console.log(`\nAdmin profile creation complete.`);
  console.log(`Successfully created: ${successes}/5`);
  console.log(`Failed to create: ${failures}/5`);
  
  // Verify profiles were saved correctly
  await verifyProfiles();
  
  console.log('\nTest completed.');
}

// Run the main function
createAllAdminProfiles().catch(error => {
  console.error('Unhandled error in script:', error);
  process.exit(1);
});
