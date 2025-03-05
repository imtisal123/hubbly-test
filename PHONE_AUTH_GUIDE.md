# Phone Authentication Guide for Hubbly App

This guide explains how to set up and use phone-based authentication with OTP (One-Time Password) in your Hubbly app.

## Prerequisites

Before implementing phone authentication, you need to:

1. Enable phone authentication in your Supabase project
2. Set up a Twilio account for SMS delivery
3. Configure Supabase to use your Twilio credentials

## Setting Up Phone Authentication in Supabase

### Step 1: Enable Phone Authentication in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Settings
3. Under "Phone Signup", toggle it to "Enabled"
4. Save changes

### Step 2: Set Up Twilio Integration

1. Create a Twilio account at [twilio.com](https://www.twilio.com) if you don't have one
2. Get your Twilio Account SID, Auth Token, and a Twilio phone number
3. In your Supabase dashboard, go to Authentication → Settings → SMS Provider
4. Select "Twilio" as the provider
5. Enter your Twilio credentials:
   - Account SID
   - Auth Token
   - Messaging Service SID or Sender ID (your Twilio phone number)
6. Save changes

## Implementation

### Phone Authentication Flow

The phone authentication flow consists of two steps:

1. **Request OTP**: User enters their phone number, and an OTP is sent via SMS
2. **Verify OTP**: User enters the OTP received, and if valid, they are authenticated

### Using the Phone Authentication Utilities

We've created a `phone_auth_utils.js` file with helper functions for phone authentication. Here's how to use them:

#### Sign Up with Phone Number

```javascript
import { signUpWithPhone } from './phone_auth_utils';

// In your phone sign-up form submission handler
async function handlePhoneSignUp() {
  const phone = phoneInput.value; // Format: +1234567890
  
  const { success, error } = await signUpWithPhone(phone);
  
  if (success) {
    // Show OTP verification form
    showOTPVerificationForm(phone);
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Verify OTP

```javascript
import { verifyPhoneOTP } from './phone_auth_utils';

// In your OTP verification form submission handler
async function handleVerifyOTP() {
  const phone = phoneInput.value; // Same phone number used for sign-up
  const otp = otpInput.value; // OTP received via SMS
  
  const { success, user, error } = await verifyPhoneOTP(phone, otp);
  
  if (success) {
    // User is authenticated
    // Redirect to profile creation or dashboard
    navigate('/create-profile');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

#### Sign In with Phone Number

```javascript
import { signInWithPhone } from './phone_auth_utils';

// In your phone sign-in form submission handler
async function handlePhoneSignIn() {
  const phone = phoneInput.value; // Format: +1234567890
  
  const { success, error } = await signInWithPhone(phone);
  
  if (success) {
    // Show OTP verification form
    showOTPVerificationForm(phone);
  } else {
    // Show error message
    showError(error.message);
  }
}
```

### Creating a Profile After Authentication

Once a user is authenticated with their phone number, you can create a profile for them:

```javascript
import { createUserProfile } from './phone_auth_utils';

// In your profile creation form submission handler
async function handleCreateProfile() {
  // Gather profile data from form inputs
  const profileData = {
    name: nameInput.value,
    gender: genderSelect.value,
    // Add other profile fields
  };
  
  const { success, id, error } = await createUserProfile(profileData);
  
  if (success) {
    // Redirect to profile page or dashboard
    navigate('/profile');
  } else {
    // Show error message
    showError(error.message);
  }
}
```

## React Native Compatibility

When using phone authentication in a React Native app, there are some important considerations:

### Environment Variables in React Native

React Native doesn't support Node.js modules like `dotenv`, so you need to use Expo's environment variables system instead:

1. **Use EXPO_PUBLIC_ prefix**: All environment variables in React Native should use the `EXPO_PUBLIC_` prefix.

2. **Access variables directly**: Access them directly from `process.env.EXPO_PUBLIC_*` in your code.

3. **Define variables in app.json**: For Expo apps, you can define environment variables in your `app.json` file:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your-supabase-url",
      "supabaseAnonKey": "your-anon-key"
    }
  }
}
```

Then access them using `Constants.expoConfig.extra` from `expo-constants`.

### Use React Native Compatible Utilities

We've created a React Native compatible version of the phone authentication utilities in `phone_auth_utils_react_native.js`. This version:

- Uses ES module imports/exports instead of CommonJS
- Doesn't rely on Node.js specific modules
- Is compatible with React Native's environment

```javascript
// In your React Native component
import { signUpWithPhone, verifyPhoneOTP } from './phone_auth_utils_react_native';

// Use the functions as shown in the previous examples
```

### Testing in React Native

For testing phone authentication in React Native:

1. Use a real device or an emulator with Google Play Services
2. Use a real phone number that can receive SMS
3. For development, you can use Twilio's test credentials and phone numbers

## Testing with Admin API

For testing purposes, we've created an `admin_auth_utils.js` file that allows you to create users without sending actual SMS messages. This is useful for development and testing.

### Prerequisites for Admin API

1. You need your Supabase service role key (not the anon key)
2. Set the following environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Creating a Test Phone User

```javascript
import { adminCreatePhoneUser } from './admin_auth_utils';

// Create a phone user without sending an SMS
const { success, user, error } = await adminCreatePhoneUser(
  '+1234567890', // Phone number
  'Password123!', // Optional password
  { name: 'Test User' } // Optional user metadata
);

if (success) {
  console.log('Phone user created:', user.id);
} else {
  console.error('Error creating phone user:', error.message);
}
```

### Running the Test Script

We've created a test script that demonstrates how to use the Admin API:

```bash
# Set environment variables
export SUPABASE_URL=https://your-project-id.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run the test script
node test_admin_auth.js
```

## Handling Phone-to-Email Conversion

Supabase internally converts phone numbers to email format (e.g., `+1234567890@phone`) for its auth system. This can cause issues if these "emails" bounce.

### Solutions

1. **Use a Custom SMTP Provider**: Configure Supabase to use your own SMTP provider (like SendGrid or Mailgun) where you can set up proper handling for these system-generated emails.

2. **Disable Email Communications**: In your Supabase project settings, disable unnecessary email communications for phone-based authentication.

3. **Use Admin API for Testing**: For testing, use the Admin API to create users without sending emails or SMS messages.

## Security Considerations

1. **International Phone Numbers**: Always use the international format for phone numbers (e.g., `+1234567890`).

2. **Rate Limiting**: Implement rate limiting on your frontend to prevent abuse of the OTP system.

3. **OTP Expiry**: OTPs sent by Supabase expire after a short period (typically 5 minutes). Make sure your UI informs users about this.

4. **Row Level Security**: Ensure your database has proper RLS policies to protect user data.

## Next Steps

1. **Implement the UI**: Create the necessary forms for phone input and OTP verification.

2. **Set Up Error Handling**: Add comprehensive error handling for various scenarios (invalid phone number, expired OTP, etc.).

3. **Add Phone Validation**: Validate phone numbers on the client side before sending OTP requests.

4. **Configure SMTP Provider**: Set up a custom SMTP provider to handle the phone-to-email conversion issue.

5. **Test Thoroughly**: Test the authentication flow with various phone numbers and edge cases.
