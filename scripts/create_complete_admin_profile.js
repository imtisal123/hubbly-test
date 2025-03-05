/**
 * Script to create a single admin profile with complete data in all tables
 */
const { supabase, supabaseAdmin } = require('../lib/supabaseClient');
const { createAdminUser } = require('../lib/admin');
const { saveProfile } = require('../lib/demoData');

async function createCompleteAdminProfile() {
  try {
    console.log('Creating admin profile with complete data in all tables...');
    
    // Generate a unique email for the admin user
    const timestamp = Date.now();
    const email = `admin_complete_${timestamp}@hubbly.app`;
    const password = 'Admin123!';
    
    console.log(`Creating admin user: ${email}`);
    
    // Create the admin user
    const { user, error } = await createAdminUser(email, password);
    
    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }
    
    console.log(`Admin user created successfully: ${email}`);
    
    // Create complete profile data
    const profileData = {
      // Basic profile data
      first_name: 'Ahmed',
      last_name: 'Khan',
      gender: 'male',
      dob: '1990-01-15',
      phone: '+12025550123',
      email: email,
      
      // Personal details
      personal_details: {
        height: 175,
        body_type: 'Athletic',
        hair_color: 'Black',
        eye_color: 'Brown',
        ethnicity: 'South Asian',
        languages: ['English', 'Urdu', 'Arabic'],
        location: 'New York, NY',
        citizenship: 'United States',
        education_level: 'Masters',
        occupation: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        income_range: '$100,000 - $150,000',
        marital_status: 'Single',
        has_children: false,
        wants_children: true,
        smoking_status: 'Never',
        drinking_status: 'Never',
        hobbies: ['Reading', 'Hiking', 'Programming', 'Travel']
      },
      
      // Religious details
      religious_details: {
        religiosity: 'Practicing',
        prayer_frequency: 'Five times daily',
        quran_reading_frequency: 'Weekly',
        islamic_education: 'Weekend Islamic school',
        hijab_preference: 'Prefers hijab',
        beard_preference: 'Has beard',
        halal_strict: true
      },
      
      // Match preferences
      match_preferences: {
        preferred_ethnicities: ['South Asian', 'Middle Eastern', 'African'],
        preferred_locations: ['New York', 'New Jersey', 'Connecticut'],
        height_range: '155-175'
      },
      
      // Family details
      family_details: {
        family_type: 'Nuclear',
        living_with_family: true,
        willing_to_relocate: true,
        parents_born_in: 'Pakistan',
        siblings_count: 2,
        father_occupation: 'Doctor',
        father_ethnicity: 'Pakistani',
        mother_occupation: 'Teacher',
        mother_ethnicity: 'Pakistani',
        family_values: 'Traditional',
        family_religiosity: 'Practicing',
        family_description: 'Close-knit family with strong Islamic values'
      },
      
      // Siblings
      siblings: [
        {
          age: 32,
          gender: 'male',
          marital_status: 'Married'
        },
        {
          age: 28,
          gender: 'female',
          marital_status: 'Single'
        }
      ],
      
      // Parents
      parents: {
        father_living: true,
        mother_living: true,
        parents_marital_status: 'Married',
        father_country_of_origin: 'Pakistan',
        mother_country_of_origin: 'Pakistan'
      }
    };
    
    // Save the profile data
    console.log('Saving complete profile data...');
    await saveProfile(profileData, false, user.id);
    
    // Verify the data was saved
    console.log('\nVerifying data in all tables...');
    
    // Check profiles table
    const { data: profileData1, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    } else {
      console.log('Profile saved successfully:', profileData1.first_name, profileData1.last_name);
    }
    
    // Check personal_details table
    const { data: personalData, error: personalError } = await supabase
      .from('personal_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (personalError) {
      console.error('Error fetching personal details:', personalError);
    } else {
      console.log('Personal details saved successfully:', personalData);
    }
    
    // Check religious_details table
    const { data: religiousData, error: religiousError } = await supabase
      .from('religious_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (religiousError) {
      console.error('Error fetching religious details:', religiousError);
    } else {
      console.log('Religious details saved successfully:', religiousData);
    }
    
    // Check match_preferences table
    const { data: matchData, error: matchError } = await supabase
      .from('match_preferences')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (matchError) {
      console.error('Error fetching match preferences:', matchError);
    } else {
      console.log('Match preferences saved successfully:', matchData);
    }
    
    // Check family_details table
    const { data: familyData, error: familyError } = await supabase
      .from('family_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (familyError) {
      console.error('Error fetching family details:', familyError);
    } else {
      console.log('Family details saved successfully:', familyData);
    }
    
    // Check siblings table
    const { data: siblingsData, error: siblingsError } = await supabase
      .from('siblings')
      .select('*')
      .eq('user_id', user.id);
    
    if (siblingsError) {
      console.error('Error fetching siblings:', siblingsError);
    } else {
      console.log(`Siblings saved successfully: ${siblingsData.length} siblings`);
      console.log(siblingsData);
    }
    
    // Check parents table
    const { data: parentsData, error: parentsError } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (parentsError) {
      console.error('Error fetching parents:', parentsError);
    } else {
      console.log('Parents data saved successfully:', parentsData);
    }
    
    console.log('\nComplete admin profile creation finished.');
    
  } catch (error) {
    console.error('Unhandled error in createCompleteAdminProfile:', error);
  }
}

createCompleteAdminProfile().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
