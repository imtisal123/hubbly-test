import React from 'react';
import { Stack } from 'expo-router';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

export default function OTPVerification() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Verify Phone',
          headerShown: false,
        }}
      />
      <OTPVerificationScreen />
    </>
  );
}
