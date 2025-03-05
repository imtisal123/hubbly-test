-- Create match_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.match_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age_range INT4RANGE,
  height_range INT4RANGE,
  distance INT,
  ethnicity TEXT[],
  marital_status TEXT[],
  has_children BOOLEAN,
  education_level TEXT[],
  religiosity TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on match_preferences
ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for match_preferences
CREATE POLICY "Users can view their own match preferences"
ON public.match_preferences
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own match preferences"
ON public.match_preferences
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own match preferences"
ON public.match_preferences
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create demo_match_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_match_preferences (
  id UUID PRIMARY KEY,
  age_range INT4RANGE,
  height_range INT4RANGE,
  distance INT,
  ethnicity TEXT[],
  marital_status TEXT[],
  has_children BOOLEAN,
  education_level TEXT[],
  religiosity TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);
