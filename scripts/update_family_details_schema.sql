-- Create family_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.family_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_values TEXT,
  family_type TEXT,
  living_with_family BOOLEAN,
  willing_to_relocate BOOLEAN,
  parents_born_in TEXT,
  siblings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT FALSE
);

-- Enable RLS on family_details
ALTER TABLE public.family_details ENABLE ROW LEVEL SECURITY;

-- Create policies for family_details
CREATE POLICY "Users can view their own family details"
ON public.family_details
FOR SELECT
USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own family details"
ON public.family_details
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Users can update their own family details"
ON public.family_details
FOR UPDATE
USING (auth.uid() = id OR auth.role() = 'authenticated');

-- Create demo_family_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.demo_family_details (
  id UUID PRIMARY KEY,
  family_values TEXT,
  family_type TEXT,
  living_with_family BOOLEAN,
  willing_to_relocate BOOLEAN,
  parents_born_in TEXT,
  siblings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_demo BOOLEAN DEFAULT TRUE
);
