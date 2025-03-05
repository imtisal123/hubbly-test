/**
 * Script to create missing tables in Supabase
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function createTables() {
  try {
    console.log('Creating missing tables...');
    
    // Create religious_details table
    console.log('Creating religious_details table...');
    const { error: religiousDetailsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.religious_details (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          religiosity INTEGER,
          prayer_frequency TEXT,
          quran_reading_frequency TEXT,
          islamic_education TEXT,
          islamic_education_details TEXT,
          hijab_preference TEXT,
          beard_preference TEXT,
          halal_strict BOOLEAN,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_demo BOOLEAN DEFAULT FALSE
        );
        
        ALTER TABLE public.religious_details ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view their own religious details"
        ON public.religious_details
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Users can insert their own religious details"
        ON public.religious_details
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Users can update their own religious details"
        ON public.religious_details
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
      `
    });
    
    if (religiousDetailsError) {
      console.error('Error creating religious_details table:', religiousDetailsError);
    } else {
      console.log('Successfully created religious_details table');
    }
    
    // Create personal_details table
    console.log('Creating personal_details table...');
    const { error: personalDetailsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.personal_details (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          smoking TEXT,
          drinking TEXT,
          diet_preference TEXT,
          exercise_frequency TEXT,
          interests TEXT[],
          hobbies TEXT[],
          languages TEXT[],
          about_me TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_demo BOOLEAN DEFAULT FALSE
        );
        
        ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view their own personal details"
        ON public.personal_details
        FOR SELECT
        USING (auth.uid() = id OR auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Users can insert their own personal details"
        ON public.personal_details
        FOR INSERT
        WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        
        CREATE POLICY IF NOT EXISTS "Users can update their own personal details"
        ON public.personal_details
        FOR UPDATE
        USING (auth.uid() = id OR auth.role() = 'authenticated');
      `
    });
    
    if (personalDetailsError) {
      console.error('Error creating personal_details table:', personalDetailsError);
    } else {
      console.log('Successfully created personal_details table');
    }
    
    // Create demo_religious_details table
    console.log('Creating demo_religious_details table...');
    const { error: demoReligiousDetailsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.demo_religious_details (
          id UUID PRIMARY KEY,
          religiosity INTEGER,
          prayer_frequency TEXT,
          quran_reading_frequency TEXT,
          islamic_education TEXT,
          islamic_education_details TEXT,
          hijab_preference TEXT,
          beard_preference TEXT,
          halal_strict BOOLEAN,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_demo BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    if (demoReligiousDetailsError) {
      console.error('Error creating demo_religious_details table:', demoReligiousDetailsError);
    } else {
      console.log('Successfully created demo_religious_details table');
    }
    
    // Create demo_personal_details table
    console.log('Creating demo_personal_details table...');
    const { error: demoPersonalDetailsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.demo_personal_details (
          id UUID PRIMARY KEY,
          smoking TEXT,
          drinking TEXT,
          diet_preference TEXT,
          exercise_frequency TEXT,
          interests TEXT[],
          hobbies TEXT[],
          languages TEXT[],
          about_me TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_demo BOOLEAN DEFAULT TRUE
        );
      `
    });
    
    if (demoPersonalDetailsError) {
      console.error('Error creating demo_personal_details table:', demoPersonalDetailsError);
    } else {
      console.log('Successfully created demo_personal_details table');
    }
    
    // Add is_demo column to match_preferences
    console.log('Adding is_demo column to match_preferences...');
    const { error: matchPrefError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'match_preferences' 
                AND column_name = 'is_demo'
            ) THEN
                ALTER TABLE public.match_preferences ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
            END IF;
        END $$;
      `
    });
    
    if (matchPrefError) {
      console.error('Error adding is_demo to match_preferences:', matchPrefError);
    } else {
      console.log('Successfully added is_demo to match_preferences');
    }
    
    // Add is_demo column to family_details
    console.log('Adding is_demo column to family_details...');
    const { error: familyDetailsError } = await supabaseAdmin.rpc('execute_sql', {
      sql: `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'family_details' 
                AND column_name = 'is_demo'
            ) THEN
                ALTER TABLE public.family_details ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
            END IF;
        END $$;
      `
    });
    
    if (familyDetailsError) {
      console.error('Error adding is_demo to family_details:', familyDetailsError);
    } else {
      console.log('Successfully added is_demo to family_details');
    }
    
    console.log('Database updates completed');
  } catch (error) {
    console.error('Unhandled error in createTables:', error);
  }
}

createTables().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
