/**
 * Script to create 5 admin users with diverse profile data
 * This tests that admin profiles are correctly saved to non-demo tables
 */
const { createAdminUser } = require('../lib/admin');
const { saveRegularProfile } = require('../lib/demoData');
const { supabase, supabaseAdmin } = require('../lib/supabaseClient');

// Arrays of sample data for generating diverse profiles
const firstNames = [
  'Ahmed', 'Fatima', 'Mohammed', 'Aisha', 'Omar', 
  'Layla', 'Ibrahim', 'Zainab', 'Ali', 'Noor',
  'Yusuf', 'Amina', 'Hassan', 'Mariam', 'Khalid',
  'Samira', 'Tariq', 'Leila', 'Jamal', 'Soraya',
  'Karim', 'Yasmin', 'Samir', 'Zahra', 'Mustafa'
];

const lastNames = [
  'Khan', 'Ahmed', 'Ali', 'Hassan', 'Malik',
  'Rahman', 'Syed', 'Qureshi', 'Shah', 'Patel',
  'Mahmood', 'Aziz', 'Iqbal', 'Javed', 'Farooq',
  'Rashid', 'Hussain', 'Mirza', 'Aslam', 'Baig',
  'Rizvi', 'Chaudhry', 'Siddiqui', 'Akhtar', 'Zaidi'
];

const ethnicities = [
  'Pakistani', 'Indian', 'Bangladeshi', 'Arab', 'Persian',
  'Turkish', 'Afghan', 'Malaysian', 'Indonesian', 'Moroccan'
];

const nationalities = [
  'American', 'British', 'Canadian', 'Australian', 'French',
  'German', 'Pakistani', 'Indian', 'Saudi Arabian', 'Egyptian'
];

const educationLevels = [
  'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Associate\'s'
];

const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Lawyer', 'Engineer',
  'Accountant', 'Business Owner', 'Pharmacist', 'Nurse', 'Professor'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'
];

const hobbies = [
  'Reading', 'Traveling', 'Cooking', 'Photography', 'Hiking',
  'Painting', 'Swimming', 'Gardening', 'Music', 'Sports'
];

// Generate random data for a profile
function generateRandomProfile(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    age: Math.floor(Math.random() * 20) + 20, // 20-40
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    hobbies: [
      hobbies[Math.floor(Math.random() * hobbies.length)],
      hobbies[Math.floor(Math.random() * hobbies.length)]
    ],
    about: `I'm ${firstName}, a ${Math.floor(Math.random() * 20) + 20}-year-old ${occupations[Math.floor(Math.random() * occupations.length)]} living in ${locations[Math.floor(Math.random() * locations.length)]}.`,
    height: Math.floor(Math.random() * 30) + 150, // 150-180 cm
    marital_status: Math.random() > 0.8 ? 'Divorced' : 'Single',
    has_children: Math.random() > 0.8,
    wants_children: Math.random() > 0.3,
    religiosity: Math.floor(Math.random() * 5) + 1, // 1-5
    smoking: ['Never', 'Socially', 'Regularly'][Math.floor(Math.random() * 3)],
    drinking: ['Never', 'Socially', 'Regularly'][Math.floor(Math.random() * 3)],
    prayer_frequency: ['Five times daily', 'Daily', 'Weekly', 'Occasionally', 'Rarely'][Math.floor(Math.random() * 5)]
  };
}

// Create admin user and save profile
async function createAdminAndProfile(index) {
  try {
    // Create unique email for this admin
    const timestamp = Date.now();
    const email = `admin_test${index}_${timestamp}@hubbly.app`;
    const password = `Admin123!${index}`;
    
    console.log(`Creating admin user ${index+1}/5: ${email}`);
    
    // Create the admin user
    const { success, data, error } = await createAdminUser(email, password);
    
    if (!success || error) {
      console.error(`Failed to create admin user ${index+1}:`, error);
      return { success: false, error };
    }
    
    console.log(`Admin user created successfully: ${email}`);
    
    // Generate random profile data
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

// Verify that profiles were saved correctly
async function verifyProfiles() {
  try {
    console.log('\nVerifying profiles in non-demo tables...');
    
    // Check regular profiles table
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return false;
    }
    
    console.log(`Found ${profiles.length} profiles in the regular profiles table`);
    
    // Check a few related tables
    const { data: matchPrefs, error: matchPrefsError } = await supabaseAdmin
      .from('match_preferences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    
    if (matchPrefsError) {
      console.error('Error fetching match preferences:', matchPrefsError);
    } else {
      console.log(`Found ${matchPrefs.length} records in the match_preferences table`);
    }
    
    // Print some sample data
    if (profiles.length > 0) {
      console.log('\nSample profile data:');
      console.log(JSON.stringify(profiles[0], null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('Error in verifyProfiles:', error);
    return false;
  }
}

// Main function to create all admin profiles
async function createAllAdminProfiles() {
  console.log('Starting creation of 5 admin profiles...');
  
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
