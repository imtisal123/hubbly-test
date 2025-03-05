-- Create Admin Test Profile SQL Script

-- 1. Create admin user in auth.users
-- Note: This part needs to be done through the Supabase dashboard or API
-- as we can't directly insert into auth.users with SQL

-- 2. Insert admin profile
INSERT INTO profiles (
  id, 
  name, 
  gender, 
  date_of_birth, 
  height, 
  ethnicity, 
  location, 
  nationality, 
  education_level, 
  university, 
  occupation, 
  company, 
  profile_pic_url, 
  created_at, 
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID after creating the user
  'Admin User',
  'Male',
  '1990-01-01',
  180,
  'South Asian',
  'New York, NY',
  'American',
  'Master''s Degree',
  'Columbia University',
  'Software Engineer',
  'Hubbly Inc.',
  'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/admin_profile.jpg',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  gender = EXCLUDED.gender,
  date_of_birth = EXCLUDED.date_of_birth,
  height = EXCLUDED.height,
  ethnicity = EXCLUDED.ethnicity,
  location = EXCLUDED.location,
  nationality = EXCLUDED.nationality,
  education_level = EXCLUDED.education_level,
  university = EXCLUDED.university,
  occupation = EXCLUDED.occupation,
  company = EXCLUDED.company,
  profile_pic_url = EXCLUDED.profile_pic_url,
  updated_at = NOW();

-- 3. Insert mother data
INSERT INTO parents (
  user_id,
  type,
  name,
  date_of_birth,
  ethnicity,
  nationality,
  education_level,
  occupation,
  profile_pic_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'mother',
  'Sarah Johnson',
  '1965-05-15',
  'South Asian',
  'Indian',
  'Bachelor''s Degree',
  'Teacher',
  'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/mother_profile.jpg',
  NOW(),
  NOW()
) ON CONFLICT (user_id, type) DO UPDATE SET
  name = EXCLUDED.name,
  date_of_birth = EXCLUDED.date_of_birth,
  ethnicity = EXCLUDED.ethnicity,
  nationality = EXCLUDED.nationality,
  education_level = EXCLUDED.education_level,
  occupation = EXCLUDED.occupation,
  profile_pic_url = EXCLUDED.profile_pic_url,
  updated_at = NOW();

-- 4. Insert father data
INSERT INTO parents (
  user_id,
  type,
  name,
  date_of_birth,
  ethnicity,
  nationality,
  education_level,
  occupation,
  profile_pic_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'father',
  'Robert Johnson',
  '1962-08-22',
  'South Asian',
  'Pakistani',
  'Master''s Degree',
  'Doctor',
  'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/father_profile.jpg',
  NOW(),
  NOW()
) ON CONFLICT (user_id, type) DO UPDATE SET
  name = EXCLUDED.name,
  date_of_birth = EXCLUDED.date_of_birth,
  ethnicity = EXCLUDED.ethnicity,
  nationality = EXCLUDED.nationality,
  education_level = EXCLUDED.education_level,
  occupation = EXCLUDED.occupation,
  profile_pic_url = EXCLUDED.profile_pic_url,
  updated_at = NOW();

-- 5. Insert siblings data
-- First sibling
INSERT INTO siblings (
  user_id,
  name,
  gender,
  date_of_birth,
  education_level,
  occupation,
  marital_status,
  profile_pic_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Emily Johnson',
  'Female',
  '1992-03-10',
  'Bachelor''s Degree',
  'Marketing Manager',
  'Single',
  'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/sister_profile.jpg',
  NOW(),
  NOW()
);

-- Second sibling
INSERT INTO siblings (
  user_id,
  name,
  gender,
  date_of_birth,
  education_level,
  occupation,
  marital_status,
  profile_pic_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Michael Johnson',
  'Male',
  '1988-11-05',
  'PhD',
  'Research Scientist',
  'Married',
  'https://jhpmzmjegvspxdnbazzx.supabase.co/storage/v1/object/public/profile_pictures/default/brother_profile.jpg',
  NOW(),
  NOW()
);

-- 6. Insert match preferences
INSERT INTO match_preferences (
  user_id,
  min_age,
  max_age,
  preferred_ethnicities,
  preferred_locations,
  preferred_education_levels,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  25,
  35,
  ARRAY['South Asian', 'Middle Eastern', 'East Asian'],
  ARRAY['New York, NY', 'San Francisco, CA', 'Chicago, IL'],
  ARRAY['Bachelor''s Degree', 'Master''s Degree', 'PhD'],
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  min_age = EXCLUDED.min_age,
  max_age = EXCLUDED.max_age,
  preferred_ethnicities = EXCLUDED.preferred_ethnicities,
  preferred_locations = EXCLUDED.preferred_locations,
  preferred_education_levels = EXCLUDED.preferred_education_levels,
  updated_at = NOW();
