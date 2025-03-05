#!/bin/bash

# Comprehensive test script for the Hubbly Profile System

echo "=========================================="
echo "Testing Hubbly Profile System"
echo "=========================================="

# 1. Test creating a demo profile
echo ""
echo "1. Creating a demo profile..."
node testDemoProfile.js

# 2. Test creating a regular profile
echo ""
echo "2. Creating a regular profile..."
node testRegularProfile.js

# 3. Test profile utilities
echo ""
echo "3. Testing profile utilities..."
node testProfileUtils.js

echo ""
echo "=========================================="
echo "All tests completed!"
echo "=========================================="
