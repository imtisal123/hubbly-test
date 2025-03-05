/**
 * Test script to create a demo profile with family details
 */
const { saveDemoProfile } = require('./lib/demoData');

async function createDemoProfileWithFamily() {
  console.log('Creating a demo profile with family details...');
  
  // Create a sample profile with family details
  const profileData = {
    name: 'Test User',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    height: 175,
    ethnicity: 'Asian',
    maritalStatus: 'Single',
    hasChildren: false,
    religion: 'Islam',
    islamicSect: 'Sunni',
    coverHead: false,
    
    // Add family details
    familyDetails: {
      environment: 'Religious and traditional',
      additionalInfo: 'Close-knit family with strong values',
      
      // Add parents
      parents: [
        {
          name: 'Father Name',
          relationship: 'Father',
          occupation: 'Engineer',
          maritalStatus: 'Married'
        },
        {
          name: 'Mother Name',
          relationship: 'Mother',
          occupation: 'Teacher',
          maritalStatus: 'Married'
        }
      ],
      
      // Add siblings
      siblings: [
        {
          name: 'Brother Name',
          gender: 'Male',
          maritalStatus: 'Single',
          occupation: 'Student'
        },
        {
          name: 'Sister Name',
          gender: 'Female',
          maritalStatus: 'Married',
          occupation: 'Doctor'
        }
      ]
    }
  };
  
  try {
    // Save the profile
    const result = await saveDemoProfile(profileData);
    
    if (result.success) {
      console.log(`Demo profile created successfully with ID: ${result.id}`);
      console.log('Profile data:', result);
    } else {
      console.error('Failed to create demo profile:', result.error || result.message);
    }
  } catch (error) {
    console.error('Unexpected error creating demo profile:', error);
  }
}

// Run the test
createDemoProfileWithFamily()
  .catch(error => console.error('Error in createDemoProfileWithFamily:', error))
  .finally(() => {
    // Exit after a short delay to ensure all logs are printed
    setTimeout(() => process.exit(0), 1000);
  });
