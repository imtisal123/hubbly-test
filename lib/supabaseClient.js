const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzAxMjEsImV4cCI6MjA1NjI0NjEyMX0.Lsw4uwOnZJ1l_gMRtSEDhnZ-Vee8-756XKt0wHGZS_A';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
