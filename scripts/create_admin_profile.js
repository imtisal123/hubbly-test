// Script to create an admin test profile with complete data
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.3eTQfQHJUYQXs2U9oDmFwQXfuLCzB7Wbvj7hJXQnZYA';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { v4: uuidv4 } = require('uuid');

async function createAdminProfile() {
  console.log('Creating admin test profile...');

  try {
    // 1. Create admin user in auth
    const adminEmail = 'admin.test@hubbly.app';
    const adminPassword = 'admin123';
    const adminPhone = '+1234567890';

    console.log('Creating admin user in auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          phone: adminPhone,
        },
      },
    });

    if (authError) {
      // If user already exists, try to sign in
      if (authError.message.includes('already registered')) {
        console.log('Admin user already exists, signing in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (signInError) throw signInError;
        
        console.log('Signed in as admin user');
        var userId = signInData.user.id;
      } else {
        throw authError;
      }
    } else {
      console.log('Admin user created successfully');
      var userId = authData.user.id;
    }

    // 2. Create or update profile
    console.log('Creating admin profile...');
    const profileData = {
      id: userId,
      name: 'Admin User',
      gender: 'Male',
      date_of_birth: '1990-01-01',
      height: 180,
      ethnicity: 'South Asian',
      location: 'New York, NY',
      nationality: 'American',
      education_level: 'Master\'s Degree',
      university: 'Columbia University',
      occupation: 'Software Engineer',
      company: 'Hubbly Inc.',
      profile_pic_url: 'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/admin_profile.jpg',
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select();

    if (profileError) throw profileError;
    console.log('Admin profile created/updated successfully');

    // 3. Create mother data
    console.log('Creating mother data...');
    const motherData = {
      user_id: userId,
      type: 'mother',
      date_of_birth: '1965-05-15',
      education_level: 'Bachelor\'s Degree',
      profession: 'Teacher',
      profile_pic_url: 'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/mother_profile.jpg',
      updated_at: new Date().toISOString()
    };

    const { error: motherError } = await supabase
      .from('parents')
      .upsert(motherData, { onConflict: 'user_id,type' })
      .select();

    if (motherError) throw motherError;
    console.log('Mother data created/updated successfully');

    // 4. Create father data
    console.log('Creating father data...');
    const fatherData = {
      user_id: userId,
      type: 'father',
      date_of_birth: '1962-08-22',
      education_level: 'Master\'s Degree',
      profession: 'Engineer',
      profile_pic_url: 'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/father_profile.jpg',
      updated_at: new Date().toISOString()
    };

    const { error: fatherError } = await supabase
      .from('parents')
      .upsert(fatherData, { onConflict: 'user_id,type' })
      .select();

    if (fatherError) throw fatherError;
    console.log('Father data created/updated successfully');

    // 5. Create siblings data
    console.log('Creating siblings data...');
    
    // First sibling
    const sibling1Data = {
      user_id: userId,
      gender: 'Female',
      date_of_birth: '1992-03-10',
      education_level: 'Bachelor\'s Degree',
      marital_status: 'Single',
      profile_pic_url: 'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/sister_profile.jpg',
      updated_at: new Date().toISOString()
    };

    const { error: sibling1Error } = await supabase
      .from('siblings')
      .insert(sibling1Data)
      .select();

    if (sibling1Error) throw sibling1Error;
    
    // Second sibling
    const sibling2Data = {
      user_id: userId,
      gender: 'Male',
      date_of_birth: '1988-11-05',
      education_level: 'PhD',
      marital_status: 'Married',
      profile_pic_url: 'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/brother_profile.jpg',
      updated_at: new Date().toISOString()
    };

    const { error: sibling2Error } = await supabase
      .from('siblings')
      .insert(sibling2Data)
      .select();

    if (sibling2Error) throw sibling2Error;
    console.log('Siblings data created successfully');

    // 6. Create match preferences
    console.log('Creating match preferences...');
    const preferencesData = {
      user_id: userId,
      preferred_ethnicities: ['South Asian', 'Middle Eastern', 'East Asian'],
      preferred_locations: ['New York, NY', 'San Francisco, CA', 'Chicago, IL'],
      preferred_education_levels: ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD'],
      height_range: '155-175',
      updated_at: new Date().toISOString()
    };

    const { error: preferencesError } = await supabase
      .from('match_preferences')
      .upsert(preferencesData, { onConflict: 'user_id' })
      .select();

    if (preferencesError) throw preferencesError;
    console.log('Match preferences created/updated successfully');

    console.log('\nAdmin test profile created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin.test@hubbly.app');
    console.log('Password: admin123');
    console.log('Phone: +1234567890');

    return { success: true };
  } catch (error) {
    console.error('Error creating admin profile:', error);
    return { success: false, error };
  }
}

// Run the function
createAdminProfile();
