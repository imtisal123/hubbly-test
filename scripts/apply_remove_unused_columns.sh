#!/bin/bash

# Script to apply the remove_unused_columns.sql file to the Supabase database
# This script assumes that the Supabase CLI is installed and configured

echo "Applying SQL to remove unused columns..."
cd "$(dirname "$0")"

# Check if the SQL file exists
if [ ! -f "remove_unused_columns.sql" ]; then
  echo "Error: remove_unused_columns.sql file not found!"
  exit 1
fi

# Execute the SQL file using psql
# Note: You'll need to provide your Supabase connection details
# You can use environment variables or modify this script to include them
echo "Executing SQL file using psql..."
psql "$(grep SUPABASE_URL .env | cut -d '=' -f2 | sed 's/^https:\/\//postgresql:\/\/postgres:postgres@/')" -f remove_unused_columns.sql

if [ $? -eq 0 ]; then
  echo "Successfully removed unused columns from the database!"
else
  echo "Error executing SQL file. Please check the output above for details."
  exit 1
fi

echo "Done!"
