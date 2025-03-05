/**
 * Script to reset an admin user's password using the Supabase service role
 * 
 * This script uses the service role key to update a user's password directly,
 * bypassing the normal authentication flow.
 * 
 * Usage:
 * node scripts/reset_admin_password.js admin@hubbly.app newpassword
 */

require('dotenv').config();
const { supabaseAdmin } = require('../lib/supabaseClient');

async function main() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.error('Usage: node scripts/reset_admin_password.js <email> <password>');
      process.exit(1);
    }
    
    console.log(`Resetting password for user: ${email}`);
    
    // First, look up the user by email to get their ID
    const { data: users, error: getUserError } = await supabaseAdmin
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .limit(1);
    
    if (getUserError) {
      console.error('Error finding user:', getUserError);
      process.exit(1);
    }
    
    if (!users || users.length === 0) {
      console.error(`No user found with email: ${email}`);
      
      // Create a new admin user instead
      console.log('Creating new admin user...');
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });
      
      if (createError) {
        console.error('Error creating admin user:', createError);
        process.exit(1);
      }
      
      console.log('✅ Admin user created successfully!');
      console.log('User ID:', newUser.user.id);
      console.log('Email:', newUser.user.email);
      process.exit(0);
    }
    
    const userId = users[0].id;
    console.log(`Found user with ID: ${userId}`);
    
    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );
    
    if (updateError) {
      console.error('Error updating password:', updateError);
      process.exit(1);
    }
    
    console.log('✅ Password reset successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

main();
