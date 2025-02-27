-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  gender TEXT,
  date_of_birth DATE,
  height INTEGER,
  ethnicity TEXT,
  location TEXT,
  nationality TEXT,
  education_level TEXT,
  university TEXT,
  occupation TEXT,
  company TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('mother', 'father')),
  name TEXT,
  date_of_birth DATE,
  ethnicity TEXT,
  nationality TEXT,
  education_level TEXT,
  occupation TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Create siblings table
CREATE TABLE IF NOT EXISTS siblings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  gender TEXT,
  date_of_birth DATE,
  education_level TEXT,
  occupation TEXT,
  marital_status TEXT,
  profile_pic_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create match preferences table
CREATE TABLE IF NOT EXISTS match_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  min_age INTEGER,
  max_age INTEGER,
  preferred_ethnicities TEXT[],
  preferred_locations TEXT[],
  preferred_education_levels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create RLS (Row Level Security) policies
-- These policies ensure that users can only access their own data

-- Profiles policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Parents policy
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own parents"
  ON parents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parents"
  ON parents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parents"
  ON parents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parents"
  ON parents FOR DELETE
  USING (auth.uid() = user_id);

-- Siblings policy
ALTER TABLE siblings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own siblings"
  ON siblings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own siblings"
  ON siblings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own siblings"
  ON siblings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own siblings"
  ON siblings FOR DELETE
  USING (auth.uid() = user_id);

-- Match preferences policy
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own match preferences"
  ON match_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own match preferences"
  ON match_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own match preferences"
  ON match_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own match preferences"
  ON match_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at
BEFORE UPDATE ON parents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_siblings_updated_at
BEFORE UPDATE ON siblings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_match_preferences_updated_at
BEFORE UPDATE ON match_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
