/**
 * Script to create a new admin user with a fresh email
 * 
 * This script creates a new admin user with email/password authentication,
 * allowing you to bypass the phone verification process.
 * 
 * Usage:
 * node scripts/create_new_admin.js
 */

require('dotenv').config();
const { supabaseAdmin } = require('../lib/supabaseClient');

async function main() {
  try {
    // Use a new email to avoid conflicts
    const email = `admin${Date.now()}@hubbly.app`;
    const password = 'Admin123!';
    
    console.log(`Creating new admin user with email: ${email}`);
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        role: 'admin',
        is_admin: true
      }
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Password:', password);
    console.log('\nYou can now use these credentials to log in to the app.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

main();
