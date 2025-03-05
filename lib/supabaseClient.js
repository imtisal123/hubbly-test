const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with values from environment variables if available
// For React Native, we use the EXPO_PUBLIC_ prefix for environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzAxMjEsImV4cCI6MjA1NjI0NjEyMX0.Lsw4uwOnZJ1l_gMRtSEDhnZ-Vee8-756XKt0wHGZS_A';

// Service role key - this bypasses RLS policies
// IMPORTANT: This should be kept secure and only used server-side
// For React Native, we don't use the service role key in client code
// We'll only use it in our Node.js scripts, not in the React Native app
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.niHWhg6zZRb9CNYah9uWZobu-btirSK_lSxcvlwgn6c';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

// Create an admin client with service role key to bypass RLS
// This should only be used in server-side code, not in the React Native app
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabase,
  supabaseAdmin
};
