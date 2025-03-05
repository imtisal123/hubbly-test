/**
 * Script to generate SQL commands for creating tables and updating schema
 * This creates a SQL file that can be executed in the Supabase dashboard SQL editor
 */
const fs = require('fs');
const path = require('path');

// SQL commands to create tables and update schema
const sqlCommands = `
-- Create religious_details table
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

-- Enable RLS on religious_details
ALTER TABLE public.religious_details ENABLE ROW LEVEL SECURITY;

-- Create policies for religious_details
CREATE POLICY "Users can view their own religious details"
ON public.religious_details
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own religious details"
ON public.religious_details
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own religious details"
ON public.religious_details
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create personal_details table
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

-- Enable RLS on personal_details
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;

-- Create policies for personal_details
CREATE POLICY "Users can view their own personal details"
ON public.personal_details
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own personal details"
ON public.personal_details
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own personal details"
ON public.personal_details
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create demo_religious_details table
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

-- Create demo_personal_details table
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

-- Add is_demo column to match_preferences if it doesn't exist
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

-- Add is_demo column to family_details if it doesn't exist
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
`;

// Write SQL commands to file
const outputPath = path.join(__dirname, 'update_schema.sql');
fs.writeFileSync(outputPath, sqlCommands);

console.log(`SQL script generated at: ${outputPath}`);
console.log('Instructions:');
console.log('1. Go to the Supabase dashboard for your project');
console.log('2. Navigate to the SQL Editor');
console.log('3. Copy and paste the contents of the generated SQL file');
console.log('4. Execute the SQL commands');
console.log('5. Verify that the tables have been created successfully');
