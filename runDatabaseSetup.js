/**
 * Run database setup directly
 */
const { ensureDatabaseSetup } = require('./lib/databaseSetup');

// Run the database setup
async function run() {
  console.log('Running database setup...');
  try {
    const success = await ensureDatabaseSetup();
    console.log('Database setup completed, success:', success);
  } catch (error) {
    console.error('Error running database setup:', error);
  }
}

run();
