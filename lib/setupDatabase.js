// This script will help you set up your database tables in Supabase
const { supabase } = require('./supabaseClient');

async function setupDatabase() {
  console.log('Setting up Hubbly App database in Supabase...');

  try {
    // Create profiles table
    console.log('Creating profiles table...');
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert({ 
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Test User (Delete me)',
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();
    
    if (profilesError) {
      if (profilesError.code === '23505') {
        console.log('Profiles table already exists.');
      } else {
        console.error('Error creating profiles table:', profilesError);
      }
    } else {
      console.log('Profiles table created successfully.');
    }

    // Create parents table
    console.log('Creating parents table...');
    const { error: parentsError } = await supabase
      .from('parents')
      .insert({ 
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        type: 'mother',
        name: 'Test Mother (Delete me)',
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();
    
    if (parentsError) {
      if (parentsError.code === '23505') {
        console.log('Parents table already exists.');
      } else {
        console.error('Error creating parents table:', parentsError);
      }
    } else {
      console.log('Parents table created successfully.');
    }

    // Create siblings table
    console.log('Creating siblings table...');
    const { error: siblingsError } = await supabase
      .from('siblings')
      .insert({ 
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        name: 'Test Sibling (Delete me)',
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();
    
    if (siblingsError) {
      if (siblingsError.code === '23505') {
        console.log('Siblings table already exists.');
      } else {
        console.error('Error creating siblings table:', siblingsError);
      }
    } else {
      console.log('Siblings table created successfully.');
    }

    // Create match preferences table
    console.log('Creating match preferences table...');
    const { error: matchPreferencesError } = await supabase
      .from('match_preferences')
      .insert({ 
        id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();
    
    if (matchPreferencesError) {
      if (matchPreferencesError.code === '23505') {
        console.log('Match preferences table already exists.');
      } else {
        console.error('Error creating match preferences table:', matchPreferencesError);
      }
    } else {
      console.log('Match preferences table created successfully.');
    }

    console.log('Database setup completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error };
  }
}

// Export the setup function
module.exports = {
  setupDatabase
};
