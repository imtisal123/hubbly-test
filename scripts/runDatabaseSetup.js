// This script will run the database setup to create all necessary tables in Supabase
// Run this script with: node scripts/runDatabaseSetup.js

// Use CommonJS require instead of ES modules
const setupDatabase = require('../lib/setupDatabase');

try {
  console.log('Starting database setup...');
  setupDatabase.setupDatabase()
    .then(() => {
      console.log('Database setup completed successfully!');
      console.log('Your database tables should now be created in Supabase.');
    })
    .catch((error) => {
      console.error('Error during database setup:', error);
    });
} catch (error) {
  console.error('Error running database setup script:', error);
}
