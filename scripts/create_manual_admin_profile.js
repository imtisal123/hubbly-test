/**
 * Script to manually create an admin profile with complete data in all tables
 */
const { supabase, supabaseAdmin } = require('../lib/supabaseClient');
const { createAdminUser } = require('../lib/admin');

async function createManualAdminProfile() {
  try {
    console.log('Creating admin profile with complete data in all tables...');
    
    // Generate a unique email for the admin user
    const timestamp = Date.now();
    const email = `admin_manual_${timestamp}@hubbly.app`;
    const password = 'Admin123!';
    
    console.log(`Creating admin user: ${email}`);
    
    // Create the admin user
    const { user, error } = await createAdminUser(email, password);
    
    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }
    
    console.log(`Admin user created successfully: ${email} with ID: ${user.id}`);
    
    // Insert into profiles table
    console.log('Inserting into profiles table...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: 'Admin User',
        gender: 'Male',
        dob: '1990-01-01'
      });
    
    if (profileError) {
      console.error('Error inserting profile:', profileError);
    } else {
      console.log('Profile inserted successfully');
    }
    
    // Insert into personal_details table
    console.log('Inserting into personal_details table...');
    const { error: personalError } = await supabase
      .from('personal_details')
      .upsert({
        id: user.id,
        height: 175,
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
      });
    
    if (personalError) {
      console.error('Error inserting personal details:', personalError);
    } else {
      console.log('Personal details inserted successfully');
    }
    
    // Insert into religious_details table
    console.log('Inserting into religious_details table...');
    const { error: religiousError } = await supabase
      .from('religious_details')
      .upsert({
        id: user.id,
        religiosity: 'Practicing',
        prayer_frequency: 'Five times daily',
        quran_reading_frequency: 'Weekly',
        islamic_education: 'Weekend Islamic school',
        hijab_preference: 'Prefers hijab',
        beard_preference: 'Has beard',
        halal_strict: true
      });
    
    if (religiousError) {
      console.error('Error inserting religious details:', religiousError);
    } else {
      console.log('Religious details inserted successfully');
    }
    
    // Insert into match_preferences table
    console.log('Inserting into match_preferences table...');
    const { error: matchError } = await supabase
      .from('match_preferences')
      .upsert({
        id: user.id,
        preferred_ethnicities: ['South Asian', 'Middle Eastern', 'African'],
        preferred_locations: ['New York', 'New Jersey', 'Connecticut'],
        height_range: '155-175'
      });
    
    if (matchError) {
      console.error('Error inserting match preferences:', matchError);
    } else {
      console.log('Match preferences inserted successfully');
    }
    
    // Insert into family_details table
    console.log('Inserting into family_details table...');
    const { error: familyError } = await supabase
      .from('family_details')
      .upsert({
        id: user.id
      });
    
    if (familyError) {
      console.error('Error inserting family details:', familyError);
    } else {
      console.log('Family details inserted successfully');
    }
    
    // Insert into siblings table
    console.log('Inserting into siblings table...');
    const siblingsData = [
      {
        user_id: user.id,
        age: 32,
        gender: 'male',
        marital_status: 'Married'
      },
      {
        user_id: user.id,
        age: 28,
        gender: 'female',
        marital_status: 'Single'
      }
    ];
    
    const { error: siblingsError } = await supabase
      .from('siblings')
      .upsert(siblingsData);
    
    if (siblingsError) {
      console.error('Error inserting siblings:', siblingsError);
    } else {
      console.log('Siblings inserted successfully');
    }
    
    // Insert into parents table
    console.log('Inserting into parents table...');
    const parentsData = [
      {
        user_id: user.id,
        type: 'father',
        date_of_birth: '1960-05-15',
        education_level: 'Master\'s',
        profession: 'Doctor'
      },
      {
        user_id: user.id,
        type: 'mother',
        date_of_birth: '1962-08-20',
        education_level: 'Bachelor\'s',
        profession: 'Teacher'
      }
    ];
    
    const { error: parentsError } = await supabase
      .from('parents')
      .upsert(parentsData);
    
    if (parentsError) {
      console.error('Error inserting parents:', parentsError);
    } else {
      console.log('Parents inserted successfully');
    }
    
    // Verify the data was saved
    console.log('\nVerifying data in all tables...');
    
    // Check profiles table
    const { data: profileData, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileFetchError) {
      console.error('Error fetching profile:', profileFetchError);
    } else {
      console.log('Profile saved successfully:', profileData.name);
    }
    
    // Check personal_details table
    const { data: personalData, error: personalFetchError } = await supabase
      .from('personal_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (personalFetchError) {
      console.error('Error fetching personal details:', personalFetchError);
    } else {
      console.log('Personal details saved successfully:', personalData);
    }
    
    // Check religious_details table
    const { data: religiousData, error: religiousFetchError } = await supabase
      .from('religious_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (religiousFetchError) {
      console.error('Error fetching religious details:', religiousFetchError);
    } else {
      console.log('Religious details saved successfully:', religiousData);
    }
    
    // Check match_preferences table
    const { data: matchData, error: matchFetchError } = await supabase
      .from('match_preferences')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (matchFetchError) {
      console.error('Error fetching match preferences:', matchFetchError);
    } else {
      console.log('Match preferences saved successfully:', matchData);
    }
    
    // Check family_details table
    const { data: familyData, error: familyFetchError } = await supabase
      .from('family_details')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (familyFetchError) {
      console.error('Error fetching family details:', familyFetchError);
    } else {
      console.log('Family details saved successfully:', familyData);
    }
    
    // Check siblings table
    const { data: siblingsFetchData, error: siblingsFetchError } = await supabase
      .from('siblings')
      .select('*')
      .eq('user_id', user.id);
    
    if (siblingsFetchError) {
      console.error('Error fetching siblings:', siblingsFetchError);
    } else {
      console.log(`Siblings saved successfully: ${siblingsFetchData.length} siblings`);
      console.log(siblingsFetchData);
    }
    
    // Check parents table
    const { data: parentsData, error: parentsFetchError } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', user.id);
    
    if (parentsFetchError) {
      console.error('Error fetching parents:', parentsFetchError);
    } else {
      console.log('Parents data saved successfully:', parentsData);
    }
    
    console.log('\nComplete admin profile creation finished.');
    
  } catch (error) {
    console.error('Unhandled error in createManualAdminProfile:', error);
  }
}

createManualAdminProfile().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
