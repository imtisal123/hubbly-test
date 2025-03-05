// Script to confirm the admin test email
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or service role key');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'exists' : 'missing');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function confirmAdminTestEmail() {
  try {
    console.log('Looking up admin test user...');
    
    // First, find the user by email
    const { data: users, error: userError } = await supabaseAdmin
      .auth
      .admin
      .listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      return;
    }
    
    const adminUser = users.users.find(user => user.email === 'admin_test@hubbly.app');
    
    if (!adminUser) {
      console.error('Admin test user not found');
      return;
    }
    
    console.log('Found admin test user with ID:', adminUser.id);
    
    // Update the user to confirm their email
    const { data, error } = await supabaseAdmin
      .auth
      .admin
      .updateUserById(adminUser.id, {
        email_confirmed: true
      });
    
    if (error) {
      console.error('Error confirming email:', error);
      return;
    }
    
    console.log('Successfully confirmed admin test email!');
    console.log('User data:', data);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
confirmAdminTestEmail();
