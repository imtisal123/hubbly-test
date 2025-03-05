# Hubbly App

A React Native mobile application for matrimonial matchmaking, built with Expo.

## Overview

Hubbly is a matrimonial app designed to help users create profiles for themselves or family members and find suitable matches based on preferences. The app features a comprehensive profile creation process, family information management, and match preferences.

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go (Android) or the Camera app (iOS)

## Features

- User authentication with phone number
- Comprehensive profile creation
- Family information management
- Match preferences
- Profile browsing

## Code Structure

The app is organized into the following directories:

- `/screens`: Contains all screen components
- `/components`: Reusable UI components
- `/lib`: Utility functions and API calls
- `/contexts`: React contexts for state management
- `/styles`: Global styles and theme
- `/scripts`: Utility scripts for development

## Syntax Fixes

The codebase has been thoroughly checked and fixed for common syntax errors:

- Fixed duplicate import statements
- Ensured proper return statements in all components
- Fixed missing semicolons after function declarations
- Ensured consistent component structure with ScrollView
- Fixed unbalanced braces, parentheses, and brackets
- Corrected improper component structure

## Scripts for Code Quality

Several scripts have been developed to maintain code quality:

- `comprehensive_screen_checker.js`: Checks all screens for common issues and can fix them automatically
- `fix_unbalanced_braces.js`: Specifically fixes unbalanced braces, parentheses, and brackets
- `verify_all_screens.js`: Verifies that all screens meet the required structure and syntax

To run the comprehensive checker with automatic fixes:

```bash
node scripts/comprehensive_screen_checker.js --fix
```

To verify all screens:

```bash
node scripts/verify_all_screens.js
```

## Verification

A verification script is included to check for common syntax errors:

```bash
node scripts/verify_all_screens.js
```

## Learn More

To learn more about the technologies used in this project:

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation documentation](https://reactnavigation.org/docs/getting-started)
