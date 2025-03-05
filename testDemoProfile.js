/**
 * Test script for saving a demo profile
 */
const { saveDemoProfile } = require('./lib/profileManager');

async function testSaveDemoProfile() {
  console.log('Testing saveDemoProfile function...');
  
  const demoProfile = {
    name: 'Demo User',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    height: 175,
    ethnicity: 'Asian',
    location: 'London, UK',
    nationality: 'British',
    educationLevel: 'Bachelor\'s Degree',
    university: 'University of London',
    occupation: 'Software Engineer',
    company: 'Tech Company',
    profilePicUrl: 'https://example.com/profile.jpg',
    maritalStatus: 'Single',
    hasChildren: false,
    numberOfChildren: 0,
    religion: 'Islam',
    islamicSect: 'Sunni',
    // Use null instead of empty string for optional fields
    otherSect: null,
    coverHead: false,
    // Use null instead of empty string for optional fields
    coverHeadType: null,
    monthlyIncome: '£50,000 - £70,000',
    
    // Match preferences
    matchPreferences: {
      minAge: 25,
      maxAge: 35,
      preferredEthnicities: ['Asian', 'Middle Eastern'],
      preferredLocations: ['London, UK', 'Manchester, UK'],
      heightRange: '160cm - 175cm'
    },
    
    // Family details
    familyDetails: {
      environment: 'Religious and traditional',
      additionalInfo: 'Close-knit family with strong values',
      
      // Parents
      parents: [
        {
          name: 'Father Name',
          relationship: 'Father',
          ethnicity: 'Asian',
          nationality: 'British',
          religion: 'Islam',
          occupation: 'Doctor'
        },
        {
          name: 'Mother Name',
          relationship: 'Mother',
          ethnicity: 'Asian',
          nationality: 'British',
          religion: 'Islam',
          occupation: 'Teacher'
        }
      ],
      
      // Siblings
      siblings: [
        {
          name: 'Brother Name',
          age: 28,
          gender: 'Male',
          maritalStatus: 'Married',
          profilePicUrl: 'https://example.com/brother.jpg'
        },
        {
          name: 'Sister Name',
          age: 24,
          gender: 'Female',
          maritalStatus: 'Single',
          profilePicUrl: 'https://example.com/sister.jpg'
        }
      ]
    }
  };
  
  try {
    const result = await saveDemoProfile(demoProfile);
    
    if (result.success) {
      console.log('Demo profile saved successfully with ID:', result.id);
      console.log('Profile data:', result);
    } else {
      console.error('Failed to save demo profile:', result.error);
    }
  } catch (error) {
    console.error('Error in testSaveDemoProfile:', error);
  }
}

// Run the test
testSaveDemoProfile().catch(console.error);
