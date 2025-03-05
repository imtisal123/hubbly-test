/**
 * Test Supabase connection
 */
const { createClient } = require('@supabase/supabase-js');

// Hardcoded values from .env
const supabaseUrl = 'https://jhpmzmjegvspxdnbazzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NzAxMjEsImV4cCI6MjA1NjI0NjEyMX0.Lsw4uwOnZJ1l_gMRtSEDhnZ-Vee8-756XKt0wHGZS_A';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG16bWplZ3ZzcHhkbmJhenp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDY3MDEyMSwiZXhwIjoyMDU2MjQ2MTIxfQ.Ks-MUJ-tgH3YRnxbQQ2Z4GhBYiJzXZDkOtRxzPSvvZ0';

// Create clients
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test anon key
  try {
    const { data: anonData, error: anonError } = await supabase.from('profiles').select('count').limit(1);
    if (anonError) {
      console.error('Error with anon key:', anonError);
    } else {
      console.log('Anon key works:', anonData);
    }
  } catch (error) {
    console.error('Exception with anon key:', error);
  }
  
  // Test service role key
  try {
    const { data: adminData, error: adminError } = await supabaseAdmin.from('profiles').select('count').limit(1);
    if (adminError) {
      console.error('Error with service role key:', adminError);
    } else {
      console.log('Service role key works:', adminData);
    }
  } catch (error) {
    console.error('Exception with service role key:', error);
  }
  
  // Test direct SQL query
  try {
    const { data: sqlData, error: sqlError } = await supabaseAdmin.rpc('exec_sql', { 
      sql: 'SELECT 1 as test' 
    });
    if (sqlError) {
      console.error('Error with SQL query:', sqlError);
    } else {
      console.log('SQL query works:', sqlData);
    }
  } catch (error) {
    console.error('Exception with SQL query:', error);
  }
}

testConnection();
