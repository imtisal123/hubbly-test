/**
 * Database setup and validation
 * This file contains functions to ensure the database schema is correct
 */
const { supabaseAdmin, supabase } = require('./supabaseClient');

/**
 * Ensure the profiles table has all required columns
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureProfilesTable() {
  console.log('Ensuring profiles table has all required columns...');
  
  try {
    // Try to select from the profiles table directly to check if it exists
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      // If the error is about the table not existing, we need to create it
      // But we can't do that with the anon key, so we'll need to inform the user
      if (profilesError.message.includes('relation "profiles" does not exist') || 
          profilesError.message.includes('relation "public.profiles" does not exist')) {
        console.error('The profiles table does not exist and cannot be created with the current permissions.');
        console.error('Please run the following SQL in the Supabase dashboard:');
        console.error(`
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT,
          date_of_birth DATE,
          gender TEXT,
          height NUMERIC,
          ethnicity TEXT,
          location TEXT,
          nationality TEXT,
          education_level TEXT,
          university TEXT,
          occupation TEXT,
          company TEXT,
          profile_pic_url TEXT,
          marital_status TEXT,
          has_children BOOLEAN DEFAULT false,
          number_of_children INTEGER,
          religion TEXT,
          islamic_sect TEXT,
          other_sect TEXT,
          cover_head BOOLEAN DEFAULT false,
          cover_head_type TEXT,
          monthly_income TEXT,
          is_demo BOOLEAN DEFAULT false
        );
        
        -- Set up Row Level Security (RLS)
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        -- Allow users to view their own profile
        CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
        
        -- Allow users to update their own profile
        CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
        
        -- Allow users to insert their own profile
        CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
        `);
        return false;
      } else {
        console.error('Error checking profiles table:', profilesError);
        return false;
      }
    }
    
    // If we got here, the table exists
    console.log('Profiles table exists');
    
    // We can't check for columns with the anon key, so we'll assume they exist
    console.log('Cannot check for required columns with current permissions.');
    console.log('If you encounter issues with missing columns, please run the following SQL in the Supabase dashboard:');
    console.log(`
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height NUMERIC;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ethnicity TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education_level TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_children BOOLEAN DEFAULT false;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS number_of_children INTEGER;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religion TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS islamic_sect TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS other_sect TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_head BOOLEAN DEFAULT false;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_head_type TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_income TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
    `);
    
    console.log('Profiles table setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureProfilesTable:', error);
    return false;
  }
}

/**
 * Ensure the match_preferences table exists
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureMatchPreferencesTable() {
  console.log('Ensuring match_preferences table exists...');
  
  try {
    // Try to select from the match_preferences table directly to check if it exists
    const { data: matchPreferencesData, error: matchPreferencesError } = await supabase
      .from('match_preferences')
      .select('id')
      .limit(1);
    
    if (matchPreferencesError) {
      // If the error is about the table not existing, we need to create it
      // But we can't do that with the anon key, so we'll need to inform the user
      if (matchPreferencesError.message.includes('relation "match_preferences" does not exist') || 
          matchPreferencesError.message.includes('relation "public.match_preferences" does not exist')) {
        console.error('The match_preferences table does not exist and cannot be created with the current permissions.');
        console.error('Please run the following SQL in the Supabase dashboard:');
        console.error(`
        CREATE TABLE public.match_preferences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          preferred_ethnicities TEXT[],
          preferred_locations TEXT[],
          preferred_education_levels TEXT[],
          height_range TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Set up Row Level Security (RLS)
        ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;

        -- Create policies
        -- Allow users to view their own match preferences
        CREATE POLICY "Users can view own match preferences" ON public.match_preferences
          FOR SELECT USING (auth.uid() = user_id);

        -- Allow users to update their own match preferences
        CREATE POLICY "Users can update own match preferences" ON public.match_preferences
          FOR UPDATE USING (auth.uid() = user_id);

        -- Allow users to insert their own match preferences
        CREATE POLICY "Users can insert own match preferences" ON public.match_preferences
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Allow users to delete their own match preferences
        CREATE POLICY "Users can delete own match preferences" ON public.match_preferences
          FOR DELETE USING (auth.uid() = user_id);
        `);
        return false;
      } else {
        console.error('Error checking match_preferences table:', matchPreferencesError);
        return false;
      }
    }
    
    // If we got here, the table exists
    console.log('match_preferences table exists');
    
    // We can't check for columns with the anon key, so we'll assume they exist
    console.log('Cannot check for required columns with current permissions.');
    console.log('If you encounter issues with missing columns, please run the following SQL in the Supabase dashboard:');
    console.log(`
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS preferred_ethnicities TEXT[];
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS preferred_locations TEXT[];
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS preferred_education_levels TEXT[];
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS height_range TEXT;
    ALTER TABLE public.match_preferences ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    `);
    
    console.log('match_preferences table setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureMatchPreferencesTable:', error);
    return false;
  }
}

/**
 * Ensure the parents table exists
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureParentsTable() {
  console.log('Ensuring parents table exists...');
  
  try {
    // Try to select from the parents table directly to check if it exists
    const { data: parentsData, error: parentsError } = await supabase
      .from('parents')
      .select('id')
      .limit(1);
    
    if (parentsError) {
      // If the error is about the table not existing, we need to create it
      // But we can't do that with the anon key, so we'll need to inform the user
      if (parentsError.message.includes('relation "parents" does not exist') || 
          parentsError.message.includes('relation "public.parents" does not exist')) {
        console.error('The parents table does not exist and cannot be created with the current permissions.');
        console.error('Please run the following SQL in the Supabase dashboard:');
        console.error(`
        CREATE TABLE public.parents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          type TEXT,
          alive BOOLEAN DEFAULT true,
          marital_status TEXT,
          city_of_residence TEXT,
          area_of_residence TEXT,
          profile_pic_url TEXT,
          education_level TEXT,
          occupation TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Set up Row Level Security (RLS)
        ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

        -- Create policies
        -- Allow users to view their own parents
        CREATE POLICY "Users can view own parents" ON public.parents
          FOR SELECT USING (auth.uid() = user_id);

        -- Allow users to update their own parents
        CREATE POLICY "Users can update own parents" ON public.parents
          FOR UPDATE USING (auth.uid() = user_id);

        -- Allow users to insert their own parents
        CREATE POLICY "Users can insert own parents" ON public.parents
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Allow users to delete their own parents
        CREATE POLICY "Users can delete own parents" ON public.parents
          FOR DELETE USING (auth.uid() = user_id);
        `);
        return false;
      } else {
        console.error('Error checking parents table:', parentsError);
        return false;
      }
    }
    
    // If we got here, the table exists
    console.log('parents table exists');
    
    // We can't check for columns with the anon key, so we'll assume they exist
    console.log('Cannot check for required columns with current permissions.');
    console.log('If you encounter issues with missing columns, please run the following SQL in the Supabase dashboard:');
    console.log(`
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS type TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS alive BOOLEAN DEFAULT true;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS marital_status TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS city_of_residence TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS area_of_residence TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS education_level TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS occupation TEXT;
    ALTER TABLE public.parents ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    `);
    
    console.log('parents table setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureParentsTable:', error);
    return false;
  }
}

/**
 * Ensure the siblings table exists
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureSiblingsTable() {
  console.log('Ensuring siblings table exists...');
  
  try {
    // Try to select from the siblings table directly to check if it exists
    const { data: siblingsData, error: siblingsError } = await supabase
      .from('siblings')
      .select('id')
      .limit(1);
    
    if (siblingsError) {
      // If the error is about the table not existing, we need to create it
      // But we can't do that with the anon key, so we'll need to inform the user
      if (siblingsError.message.includes('relation "siblings" does not exist') || 
          siblingsError.message.includes('relation "public.siblings" does not exist')) {
        console.error('The siblings table does not exist and cannot be created with the current permissions.');
        console.error('Please run the following SQL in the Supabase dashboard:');
        console.error(`
        CREATE TABLE public.siblings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          gender TEXT,
          marital_status TEXT,
          education_level TEXT,
          profession TEXT,
          city_of_residence TEXT,
          area_of_residence TEXT,
          profile_pic_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Set up Row Level Security (RLS)
        ALTER TABLE public.siblings ENABLE ROW LEVEL SECURITY;

        -- Create policies
        -- Allow users to view their own siblings
        CREATE POLICY "Users can view own siblings" ON public.siblings
          FOR SELECT USING (auth.uid() = user_id);

        -- Allow users to update their own siblings
        CREATE POLICY "Users can update own siblings" ON public.siblings
          FOR UPDATE USING (auth.uid() = user_id);

        -- Allow users to insert their own siblings
        CREATE POLICY "Users can insert own siblings" ON public.siblings
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Allow users to delete their own siblings
        CREATE POLICY "Users can delete own siblings" ON public.siblings
          FOR DELETE USING (auth.uid() = user_id);
        `);
        return false;
      } else {
        console.error('Error checking siblings table:', siblingsError);
        return false;
      }
    }
    
    // If we got here, the table exists
    console.log('siblings table exists');
    
    // We can't check for columns with the anon key, so we'll assume they exist
    console.log('Cannot check for required columns with current permissions.');
    console.log('If you encounter issues with missing columns, please run the following SQL in the Supabase dashboard:');
    console.log(`
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS marital_status TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS education_level TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS profession TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS city_of_residence TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS area_of_residence TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS profile_pic_url TEXT;
    ALTER TABLE public.siblings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    `);
    
    console.log('siblings table setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureSiblingsTable:', error);
    return false;
  }
}

/**
 * Ensure the family_details table exists
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureFamilyDetailsTable() {
  console.log('Ensuring family_details table exists...');
  
  try {
    // Try to select from the family_details table directly to check if it exists
    const { data: familyDetailsData, error: familyDetailsError } = await supabase
      .from('family_details')
      .select('id')
      .limit(1);
    
    if (familyDetailsError) {
      // If the error is about the table not existing, we need to create it
      // But we can't do that with the anon key, so we'll need to inform the user
      if (familyDetailsError.message.includes('relation "family_details" does not exist') || 
          familyDetailsError.message.includes('relation "public.family_details" does not exist')) {
        console.error('The family_details table does not exist and cannot be created with the current permissions.');
        console.error('Please run the following SQL in the Supabase dashboard:');
        console.error(`
        CREATE TABLE public.family_details (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          family_environment TEXT,
          additional_info TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Set up Row Level Security (RLS)
        ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;

        -- Create policies
        -- Allow users to view their own family details
        CREATE POLICY "Users can view own family details" ON public.family_details
          FOR SELECT USING (auth.uid() = user_id);

        -- Allow users to update their own family details
        CREATE POLICY "Users can update own family details" ON public.family_details
          FOR UPDATE USING (auth.uid() = user_id);

        -- Allow users to insert their own family details
        CREATE POLICY "Users can insert own family details" ON public.family_details
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Allow users to delete their own family details
        CREATE POLICY "Users can delete own family details" ON public.family_details
          FOR DELETE USING (auth.uid() = user_id);

        GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_details TO authenticated;
        GRANT SELECT, INSERT ON public.family_details TO anon;
        `);
        return false;
      } else {
        console.error('Error checking family_details table:', familyDetailsError);
        return false;
      }
    }
    
    // If we got here, the table exists
    console.log('family_details table exists');
    
    // We can't check for columns with the anon key, so we'll assume they exist
    console.log('Cannot check for required columns with current permissions.');
    console.log('If you encounter issues with missing columns, please run the following SQL in the Supabase dashboard:');
    console.log(`
    ALTER TABLE public.family_details ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
    ALTER TABLE public.family_details ADD COLUMN IF NOT EXISTS family_environment TEXT;
    ALTER TABLE public.family_details ADD COLUMN IF NOT EXISTS additional_info TEXT;
    ALTER TABLE public.family_details ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    `);
    
    console.log('family_details table setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureFamilyDetailsTable:', error);
    return false;
  }
}

/**
 * Ensure all required database tables and columns exist
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
async function ensureDatabaseSetup() {
  console.log('Setting up database...');
  
  try {
    // Ensure all tables exist with required columns
    const profilesSuccess = await ensureProfilesTable();
    const matchPreferencesSuccess = await ensureMatchPreferencesTable();
    const parentsSuccess = await ensureParentsTable();
    const siblingsSuccess = await ensureSiblingsTable();
    const familyDetailsSuccess = await ensureFamilyDetailsTable();
    
    const success = profilesSuccess && 
                   matchPreferencesSuccess && 
                   parentsSuccess && 
                   siblingsSuccess && 
                   familyDetailsSuccess;
    
    console.log('Database setup complete, success:', success);
    return success;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

module.exports = {
  ensureDatabaseSetup,
  ensureProfilesTable,
  ensureMatchPreferencesTable,
  ensureParentsTable,
  ensureSiblingsTable,
  ensureFamilyDetailsTable
};
