/**
 * Test script for saving a regular profile
 */
const { updateProfile } = require('./lib/profileManager');
const { v4: uuidv4 } = require('uuid');

async function testUpdateProfile() {
  console.log('Testing updateProfile function...');
  
  // Create a mock user ID
  const userId = uuidv4();
  
  const profileData = {
    name: 'Regular User',
    dateOfBirth: '1992-05-15',
    gender: 'Female',
    height: 165,
    ethnicity: 'Middle Eastern',
    location: 'Birmingham, UK',
    nationality: 'British',
    educationLevel: 'Master\'s Degree',
    university: 'University of Birmingham',
    occupation: 'Data Scientist',
    company: 'Tech Innovations Ltd',
    profilePicUrl: 'https://example.com/regular-profile.jpg',
    maritalStatus: 'Single',
    hasChildren: false,
    numberOfChildren: 0,
    religion: 'Islam',
    islamicSect: 'Sunni',
    // Use null instead of empty string for optional fields
    otherSect: null,
    coverHead: true,
    // Use null instead of empty string for optional fields
    coverHeadType: 'Hijab',
    monthlyIncome: '£60,000 - £80,000',
    
    // Match preferences
    matchPreferences: {
      minAge: 28,
      maxAge: 40,
      preferredEthnicities: ['Middle Eastern', 'Asian', 'White'],
      preferredLocations: ['Birmingham, UK', 'London, UK'],
      heightRange: '175cm - 190cm'
    },
    
    // Family details
    familyDetails: {
      environment: 'Modern but traditional values',
      additionalInfo: 'Family is very supportive and open-minded',
      
      // Parents
      parents: [
        {
          name: 'Father Name',
          relationship: 'Father',
          ethnicity: 'Middle Eastern',
          nationality: 'British',
          religion: 'Islam',
          occupation: 'Engineer'
        },
        {
          name: 'Mother Name',
          relationship: 'Mother',
          ethnicity: 'Middle Eastern',
          nationality: 'British',
          religion: 'Islam',
          occupation: 'Accountant'
        }
      ],
      
      // Siblings
      siblings: [
        {
          name: 'Brother Name',
          age: 32,
          gender: 'Male',
          maritalStatus: 'Married',
          profilePicUrl: 'https://example.com/brother-regular.jpg'
        }
      ]
    }
  };
  
  try {
    const result = await updateProfile(userId, profileData);
    
    if (result.success) {
      console.log('Regular profile saved successfully with ID:', result.id);
      console.log('Profile data:', result);
    } else {
      console.error('Failed to save regular profile:', result.error);
    }
  } catch (error) {
    console.error('Error in testUpdateProfile:', error);
  }
}

// Run the test
testUpdateProfile().catch(console.error);
