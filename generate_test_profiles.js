/**
 * Script to generate 20 diverse demo profiles with different combinations of data
 * to thoroughly test the database saving functionality
 */
const { saveDemoProfile } = require('./lib/demoData');

// Helper function to randomly select items from an array
function getRandomItems(array, min = 0, max = array.length) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get a random boolean with possibility of empty values
function getRandomBoolean(includeEmpty = true) {
  const options = [true, false];
  if (includeEmpty) {
    options.push(null, undefined, '');
  }
  return options[Math.floor(Math.random() * options.length)];
}

// Helper function to get a random item from an array with possibility of empty values
function getRandomItem(array, includeEmpty = true) {
  if (includeEmpty && Math.random() < 0.3) {
    const emptyOptions = [null, undefined, ''];
    return emptyOptions[Math.floor(Math.random() * emptyOptions.length)];
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get a random number within a range
function getRandomNumber(min, max, includeEmpty = true) {
  if (includeEmpty && Math.random() < 0.3) {
    const emptyOptions = [null, undefined, ''];
    return emptyOptions[Math.floor(Math.random() * emptyOptions.length)];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get a random date within a range
function getRandomDate(start, end, includeEmpty = true) {
  if (includeEmpty && Math.random() < 0.3) {
    const emptyOptions = [null, undefined, ''];
    return emptyOptions[Math.floor(Math.random() * emptyOptions.length)];
  }
  
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
  
  return `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')}`;
}

// Data pools for generating random profiles
const names = ['Ali', 'Fatima', 'Muhammad', 'Aisha', 'Omar', 'Zainab', 'Hassan', 'Mariam', 'Ibrahim', 'Layla', 
               'Ahmed', 'Noor', 'Yusuf', 'Amina', 'Khalid', 'Samira', 'Bilal', 'Huda', 'Tariq', 'Zahra'];

const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const ethnicities = ['Arab', 'South Asian', 'Pakistani', 'Indian', 'Bangladeshi', 'Afghan', 'Turkish', 'Persian', 
                     'Indonesian', 'Malaysian', 'Nigerian', 'Somali', 'Egyptian', 'Moroccan', 'Lebanese', 'Punjabi'];

const maritalStatuses = ['Single', 'Divorced', 'Widowed', 'Separated', 'Not married'];

const religions = ['Islam', 'Christianity', 'Judaism', 'Hinduism', 'Buddhism', 'Sikhism', ''];

const islamicSects = ['Sunni', 'Shia', 'Sufi', 'Salafi', 'Hanafi', 'Maliki', 'Shafi', 'Hanbali'];

const educationLevels = ['High School', 'Bachelors', 'Masters', 'PhD', 'Trade School', 'Self-taught'];

const universities = ['Harvard', 'Oxford', 'Cambridge', 'Stanford', 'MIT', 'Al-Azhar', 'University of Toronto', 
                     'McGill University', 'University of British Columbia', 'University of London'];

const occupations = ['Software Engineer', 'Doctor', 'Teacher', 'Lawyer', 'Accountant', 'Business Owner', 
                    'Student', 'Engineer', 'Nurse', 'Sales', 'Marketing', 'Finance', 'Consultant'];

const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Tesla', 'IBM', 'Oracle', 
                  'Self-employed', 'Freelance', 'Government', 'Hospital', 'School', 'University'];

const locations = ['New York', 'London', 'Toronto', 'Dubai', 'Riyadh', 'Cairo', 'Istanbul', 'Kuala Lumpur', 
                  'Jakarta', 'Karachi', 'Lahore', 'Delhi', 'Mumbai', 'Chicago', 'Los Angeles', 'Houston'];

const nationalities = ['American', 'Canadian', 'British', 'Saudi', 'Egyptian', 'Turkish', 'Malaysian', 
                      'Indonesian', 'Pakistani', 'Indian', 'Bangladeshi', 'Nigerian', 'Moroccan', 'Lebanese'];

const familyEnvironments = ['Religious', 'Traditional', 'Modern', 'Conservative', 'Liberal', 'Mixed', 
                           'Religious and traditional', 'Modern and liberal', 'Conservative but open-minded'];

const parentOccupations = ['Doctor', 'Engineer', 'Teacher', 'Business Owner', 'Lawyer', 'Accountant', 
                          'Government Employee', 'Retired', 'Homemaker', 'Farmer', 'Military', 'Police'];

const siblingOccupations = ['Student', 'Doctor', 'Engineer', 'Teacher', 'Business Owner', 'Lawyer', 
                           'Accountant', 'Government Employee', 'Homemaker', 'Military', 'Artist'];

// Generate a diverse set of 20 profiles
async function generateTestProfiles() {
  console.log('Generating 20 diverse test profiles...');
  
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < 20; i++) {
    try {
      // Determine the complexity of this profile (how much data it will have)
      const complexity = Math.random();
      
      // Basic profile data (always included)
      const profileData = {
        name: names[i % names.length],
        dateOfBirth: getRandomDate('1970-01-01', '2000-12-31'),
        gender: getRandomItem(genders),
        height: getRandomNumber(150, 200),
        ethnicity: getRandomItem(ethnicities),
        maritalStatus: getRandomItem(maritalStatuses),
        hasChildren: getRandomBoolean()
      };
      
      // Add number of children only if hasChildren is true
      if (profileData.hasChildren === true) {
        profileData.numberOfChildren = getRandomNumber(1, 5, false);
      }
      
      // Add religious information (medium complexity)
      if (complexity > 0.3) {
        profileData.religion = getRandomItem(religions);
        
        // Add Islamic sect only if religion is Islam
        if (profileData.religion === 'Islam') {
          profileData.islamicSect = getRandomItem(islamicSects);
          profileData.coverHead = getRandomBoolean();
          
          // Add cover head type only if coverHead is true
          if (profileData.coverHead === true) {
            profileData.coverHeadType = getRandomItem(['Hijab', 'Niqab', 'Burka', 'Turban']);
          }
        }
      }
      
      // Add education and career information (medium complexity)
      if (complexity > 0.4) {
        profileData.educationLevel = getRandomItem(educationLevels);
        profileData.university = getRandomItem(universities);
        profileData.occupation = getRandomItem(occupations);
        profileData.company = getRandomItem(companies);
        profileData.monthlyIncome = getRandomNumber(3000, 15000);
      }
      
      // Add location information (medium complexity)
      if (complexity > 0.5) {
        profileData.location = getRandomItem(locations);
        profileData.nationality = getRandomItem(nationalities);
      }
      
      // Add match preferences (high complexity)
      if (complexity > 0.6) {
        profileData.matchPreferences = {
          minAge: getRandomNumber(18, 30),
          maxAge: getRandomNumber(30, 50),
          preferredEthnicities: getRandomItems(ethnicities, 0, 5),
          preferredLocations: getRandomItems(locations, 0, 3)
        };
        
        // 50% chance to add height range as array, 50% as string
        if (Math.random() > 0.5) {
          profileData.matchPreferences.heightRange = [getRandomNumber(150, 170), getRandomNumber(170, 190)];
        } else {
          profileData.matchPreferences.heightRange = `${getRandomNumber(150, 170)}cm - ${getRandomNumber(170, 190)}cm`;
        }
      }
      
      // Add family details (highest complexity)
      if (complexity > 0.7) {
        profileData.familyDetails = {
          environment: getRandomItem(familyEnvironments),
          additionalInfo: getRandomItem([
            'Close-knit family with strong values',
            'Family values education and career',
            'Family is very religious',
            'Family is traditional but open-minded',
            'Mixed cultural background',
            ''
          ])
        };
        
        // Add parents (with varying number of parents)
        if (Math.random() > 0.3) {
          const numParents = Math.floor(Math.random() * 3); // 0-2 parents
          if (numParents > 0) {
            profileData.familyDetails.parents = [];
            
            for (let p = 0; p < numParents; p++) {
              const parent = {
                name: `${profileData.name}'s ${p === 0 ? 'Father' : 'Mother'}`,
                relationship: p === 0 ? 'Father' : 'Mother',
                alive: getRandomBoolean(false),
                maritalStatus: getRandomItem(maritalStatuses),
                occupation: getRandomItem(parentOccupations)
              };
              
              // Add additional parent details with 50% probability
              if (Math.random() > 0.5) {
                parent.cityOfResidence = getRandomItem(locations);
                parent.areaOfResidence = getRandomItem(['Downtown', 'Suburbs', 'Rural', '']);
                parent.educationLevel = getRandomItem(educationLevels);
              }
              
              profileData.familyDetails.parents.push(parent);
            }
          }
        }
        
        // Add siblings (with varying number of siblings)
        if (Math.random() > 0.3) {
          const numSiblings = Math.floor(Math.random() * 4); // 0-3 siblings
          if (numSiblings > 0) {
            profileData.familyDetails.siblings = [];
            
            for (let s = 0; s < numSiblings; s++) {
              const sibling = {
                name: `${profileData.name}'s Sibling ${s+1}`,
                gender: getRandomItem(genders),
                maritalStatus: getRandomItem(maritalStatuses),
                occupation: getRandomItem(siblingOccupations)
              };
              
              // Add additional sibling details with 50% probability
              if (Math.random() > 0.5) {
                sibling.educationLevel = getRandomItem(educationLevels);
                sibling.age = getRandomNumber(18, 50);
              }
              
              profileData.familyDetails.siblings.push(sibling);
            }
          }
        }
      }
      
      // Save the profile
      console.log(`\nSaving profile ${i+1}/20: ${profileData.name}`);
      console.log(`Profile complexity: ${Math.round(complexity * 100)}%`);
      
      const result = await saveDemoProfile(profileData);
      
      if (result && result.success !== false) {
        console.log(`✅ Profile ${i+1} saved successfully with ID: ${result.id}`);
        results.success++;
      } else {
        console.error(`❌ Failed to save profile ${i+1}:`, result.error || result.message);
        results.failed++;
        results.errors.push({
          profile: i+1,
          error: result.error || result.message
        });
      }
    } catch (error) {
      console.error(`❌ Unexpected error saving profile ${i+1}:`, error);
      results.failed++;
      results.errors.push({
        profile: i+1,
        error: error.message
      });
    }
    
    // Add a small delay between profiles to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Print summary
  console.log('\n--- SUMMARY ---');
  console.log(`Total profiles attempted: 20`);
  console.log(`Successful: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors encountered:');
    results.errors.forEach(err => {
      console.log(`- Profile ${err.profile}: ${err.error}`);
    });
  }
}

// Run the generator
generateTestProfiles()
  .catch(error => console.error('Error in generateTestProfiles:', error))
  .finally(() => {
    // Exit after a delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 2000);
  });
