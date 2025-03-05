/**
 * Script to create an admin user for the Hubbly app
 * 
 * This script creates an admin user with email/password authentication,
 * allowing you to bypass the phone verification process.
 * 
 * Usage:
 * node scripts/create_admin_user.js admin@example.com password123
 */

require('dotenv').config();
const { createAdminUser } = require('../lib/auth');

async function main() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.error('Usage: node scripts/create_admin_user.js <email> <password>');
      process.exit(1);
    }
    
    console.log(`Creating admin user with email: ${email}`);
    
    const result = await createAdminUser(email, password);
    
    if (result.success) {
      console.log('✅ Admin user created/signed in successfully!');
      console.log('User ID:', result.user.id);
      console.log('Email:', result.user.email);
      console.log('Role:', result.user.user_metadata.role);
      console.log('\nYou can now use these credentials to log in to the app.');
    } else {
      console.error('❌ Failed to create admin user:', result.message);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

main();
