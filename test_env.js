require('dotenv').config();
console.log('Environment variables loaded successfully!');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('Service Role Key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
