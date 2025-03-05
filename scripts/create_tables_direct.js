/**
 * Script to create missing tables in Supabase using direct REST API calls
 */
const { supabaseAdmin } = require('../lib/supabaseClient');

async function createTables() {
  try {
    console.log('Creating missing tables using direct REST API calls...');
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.niHWhg6zZRb9CNYah9uWZobu-btirSK_lSxcvlwgn6c';
    
    // Create religious_details table
    console.log('Creating religious_details table...');
    const religiousDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!religiousDetailsResponse.ok) {
      const errorData = await religiousDetailsResponse.json();
      console.error('Error creating religious_details table:', errorData);
    } else {
      console.log('Successfully created religious_details table');
    }
    
    // Create personal_details table
    console.log('Creating personal_details table...');
    const personalDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!personalDetailsResponse.ok) {
      const errorData = await personalDetailsResponse.json();
      console.error('Error creating personal_details table:', errorData);
    } else {
      console.log('Successfully created personal_details table');
    }
    
    // Create demo_religious_details table
    console.log('Creating demo_religious_details table...');
    const demoReligiousDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!demoReligiousDetailsResponse.ok) {
      const errorData = await demoReligiousDetailsResponse.json();
      console.error('Error creating demo_religious_details table:', errorData);
    } else {
      console.log('Successfully created demo_religious_details table');
    }
    
    // Create demo_personal_details table
    console.log('Creating demo_personal_details table...');
    const demoPersonalDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!demoPersonalDetailsResponse.ok) {
      const errorData = await demoPersonalDetailsResponse.json();
      console.error('Error creating demo_personal_details table:', errorData);
    } else {
      console.log('Successfully created demo_personal_details table');
    }
    
    // Add is_demo column to match_preferences
    console.log('Adding is_demo column to match_preferences...');
    const matchPrefResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!matchPrefResponse.ok) {
      const errorData = await matchPrefResponse.json();
      console.error('Error adding is_demo to match_preferences:', errorData);
    } else {
      console.log('Successfully added is_demo to match_preferences');
    }
    
    // Add is_demo column to family_details
    console.log('Adding is_demo column to family_details...');
    const familyDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
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
      })
    });
    
    if (!familyDetailsResponse.ok) {
      const errorData = await familyDetailsResponse.json();
      console.error('Error adding is_demo to family_details:', errorData);
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
