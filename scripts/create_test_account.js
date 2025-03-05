// Script to create a dedicated test account for demo purposes
const { supabaseAdmin } = require('../lib/supabaseClient');

async function createTestAccount() {
  console.log('Creating test account for demo purposes...');

  try {
    // Create test user with consistent credentials
    const testPhone = '+1234567890';
    const testEmail = 'test.demo@hubbly.app';
    const testPassword = 'demo123';

    console.log('Creating test user in auth...');
    
    // Create the user using regular signUp
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          phone: testPhone
        }
      }
    });

    if (authError) {
      // If user already exists, this is fine
      if (authError.message.includes('already registered')) {
        console.log('Test user already exists, proceeding with profile creation');
        
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (signInError) throw signInError;
        
        authData = signInData;
      } else {
        throw authError;
      }
    }
    
    const userId = authData?.user?.id;
    if (!userId) {
      throw new Error('Failed to get user ID');
    }
    
    console.log('Using test user with ID:', userId);
    
    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingProfile) {
      console.log('Profile already exists for test user');
    } else {
      // Create profile for test user
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { 
            id: userId,
            name: 'Demo User',
            gender: 'Male',
            date_of_birth: '1990-01-01',
            height: 175,
            ethnicity: 'Mixed',
            location: 'New York',
            nationality: 'American',
            education_level: 'Bachelor\'s',
            university: 'Demo University',
            occupation: 'Software Engineer',
            company: 'Hubbly Inc.',
            created_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) throw profileError;
      console.log('Created profile for test user');
    }
    
    // Check if parents already exist
    const { data: existingParents } = await supabaseAdmin
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (existingParents && existingParents.length > 0) {
      console.log('Parent records already exist for test user');
    } else {
      // Create parent records
      const { error: parentsError } = await supabaseAdmin
        .from('parents')
        .insert([
          {
            user_id: userId,
            type: 'father',
            date_of_birth: '1960-05-15',
            education_level: 'Master\'s',
            profession: 'Doctor'
          },
          {
            user_id: userId,
            type: 'mother',
            date_of_birth: '1962-08-20',
            education_level: 'Bachelor\'s',
            profession: 'Teacher'
          }
        ]);
      
      if (parentsError) throw parentsError;
      console.log('Created parent records for test user');
    }
    
    // Check if siblings already exist
    const { data: existingSiblings } = await supabaseAdmin
      .from('siblings')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (existingSiblings && existingSiblings.length > 0) {
      console.log('Sibling records already exist for test user');
    } else {
      // Create sibling records
      const { error: siblingsError } = await supabaseAdmin
        .from('siblings')
        .insert([
          {
            user_id: userId,
            gender: 'Male',
            date_of_birth: '1988-03-10',
            education_level: 'Bachelor\'s',
            occupation: 'Engineer',
            marital_status: 'Single'
          }
        ]);
      
      if (siblingsError) throw siblingsError;
      console.log('Created sibling records for test user');
    }
    
    // Check if match preferences already exist
    const { data: existingPreferences } = await supabaseAdmin
      .from('match_preferences')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (existingPreferences && existingPreferences.length > 0) {
      console.log('Match preferences already exist for test user');
    } else {
      // Create match preferences
      const { error: preferencesError } = await supabaseAdmin
        .from('match_preferences')
        .insert([
          {
            user_id: userId,
            preferred_ethnicities: ['Asian', 'Caucasian', 'Hispanic', 'Mixed'],
            preferred_locations: ['New York', 'Boston', 'San Francisco'],
            preferred_education_levels: ['Bachelor\'s', 'Master\'s', 'PhD'],
            height_range: '155-175'
          }
        ]);
      
      if (preferencesError) throw preferencesError;
      console.log('Created match preferences for test user');
    }
    
    console.log('Test account setup complete!');
    console.log('You can use these credentials to log in:');
    console.log('Phone: +1234567890');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('Error creating test account:', error);
  }
}

// Run the function
createTestAccount();
