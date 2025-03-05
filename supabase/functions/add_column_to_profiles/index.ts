// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

console.log("Add Column to Profiles Function initialized")

Deno.serve(async (req) => {
  try {
    // Get the column name and type from the request
    const { column_name, column_type } = await req.json()
    
    if (!column_name || !column_type) {
      return new Response(
        JSON.stringify({ error: "Column name and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }
    
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )
    
    // Execute SQL to add the column if it doesn't exist
    const { data, error } = await supabaseClient.rpc('add_column_if_not_exists', {
      table_name: 'profiles',
      column_name,
      column_type
    })
    
    if (error) {
      console.error("Error adding column:", error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Column '${column_name}' of type '${column_type}' added to profiles table`,
        data
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add_column_to_profiles' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"column_name":"new_column","column_type":"text"}'

*/
