/**
 * Script to apply database updates using Supabase service role
 */
const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../lib/supabaseClient');

async function applyDatabaseUpdates() {
  try {
    console.log('Applying database updates...');
    
    // Add is_demo column to match_preferences
    console.log('Adding is_demo column to match_preferences...');
    const { error: matchPrefError } = await supabaseAdmin.rpc('alter_table_add_column', {
      table_name: 'match_preferences',
      column_name: 'is_demo',
      column_type: 'boolean',
      default_value: 'false'
    });
    
    if (matchPrefError) {
      console.error('Error adding is_demo to match_preferences:', matchPrefError);
    } else {
      console.log('Successfully added is_demo to match_preferences');
    }
    
    // Add is_demo column to family_details
    console.log('Adding is_demo column to family_details...');
    const { error: familyDetailsError } = await supabaseAdmin.rpc('alter_table_add_column', {
      table_name: 'family_details',
      column_name: 'is_demo',
      column_type: 'boolean',
      default_value: 'false'
    });
    
    if (familyDetailsError) {
      console.error('Error adding is_demo to family_details:', familyDetailsError);
    } else {
      console.log('Successfully added is_demo to family_details');
    }
    
    // Create religious_details table
    console.log('Creating religious_details table...');
    const createReligiousDetailsSQL = `
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
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'religious_details' AND policyname = 'Users can view their own religious details'
        ) THEN
          CREATE POLICY "Users can view their own religious details"
          ON public.religious_details
          FOR SELECT
          USING (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'religious_details' AND policyname = 'Users can insert their own religious details'
        ) THEN
          CREATE POLICY "Users can insert their own religious details"
          ON public.religious_details
          FOR INSERT
          WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'religious_details' AND policyname = 'Users can update their own religious details'
        ) THEN
          CREATE POLICY "Users can update their own religious details"
          ON public.religious_details
          FOR UPDATE
          USING (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
    `;
    
    const { error: religiousDetailsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createReligiousDetailsSQL
    });
    
    if (religiousDetailsError) {
      console.error('Error creating religious_details table:', religiousDetailsError);
    } else {
      console.log('Successfully created religious_details table');
    }
    
    // Create personal_details table
    console.log('Creating personal_details table...');
    const createPersonalDetailsSQL = `
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
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'personal_details' AND policyname = 'Users can view their own personal details'
        ) THEN
          CREATE POLICY "Users can view their own personal details"
          ON public.personal_details
          FOR SELECT
          USING (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'personal_details' AND policyname = 'Users can insert their own personal details'
        ) THEN
          CREATE POLICY "Users can insert their own personal details"
          ON public.personal_details
          FOR INSERT
          WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'personal_details' AND policyname = 'Users can update their own personal details'
        ) THEN
          CREATE POLICY "Users can update their own personal details"
          ON public.personal_details
          FOR UPDATE
          USING (auth.uid() = id OR auth.role() = 'authenticated');
        END IF;
      END $$;
    `;
    
    const { error: personalDetailsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createPersonalDetailsSQL
    });
    
    if (personalDetailsError) {
      console.error('Error creating personal_details table:', personalDetailsError);
    } else {
      console.log('Successfully created personal_details table');
    }
    
    // Create demo tables
    console.log('Creating demo tables...');
    const createDemoTablesSQL = `
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
    `;
    
    const { error: demoTablesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createDemoTablesSQL
    });
    
    if (demoTablesError) {
      console.error('Error creating demo tables:', demoTablesError);
    } else {
      console.log('Successfully created demo tables');
    }
    
    console.log('Database updates completed');
  } catch (error) {
    console.error('Unhandled error in applyDatabaseUpdates:', error);
  }
}

applyDatabaseUpdates().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
