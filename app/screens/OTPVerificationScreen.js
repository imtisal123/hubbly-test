import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { verifyPhoneOTP, signInWithPhoneOTP } from '../../phone_auth_utils_react_native';
import colors from '../../constants/colors';

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { phone } = params;

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP sent to your phone');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifying OTP for phone:', phone);
      const { success, error, user } = await verifyPhoneOTP(phone, otp);

      if (success) {
        Alert.alert(
          'Success',
          'Phone number verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('CreateProfile')
            }
          ]
        );
      } else {
        Alert.alert('Error', error?.message || 'Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setCanResend(false);
    
    try {
      // Resend OTP
      const { success, error } = await signInWithPhoneOTP(phone);
      
      if (success) {
        // Reset countdown
        setCountdown(30);
        Alert.alert('Success', 'A new verification code has been sent to your phone.');
      } else {
        Alert.alert('Error', error?.message || 'Failed to resend verification code.');
        setCanResend(true);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'An unexpected error occurred while resending the code.');
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone for display
  const formatPhoneForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters except the leading +
    const digits = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it's a US number (starts with +1 and has 10 digits after)
    if (digits.startsWith('+1') && digits.length === 12) {
      return `+1 (${digits.substring(2, 5)}) ${digits.substring(5, 8)}-${digits.substring(8)}`;
    }
    
    return phoneNumber;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Phone</Text>
      
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to {formatPhoneForDisplay(phone)}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.resendButton,
          !canResend && styles.resendButtonDisabled
        ]}
        onPress={handleResendOTP}
        disabled={isLoading || !canResend}
      >
        <Text 
          style={[
            styles.resendButtonText,
            !canResend && styles.resendButtonTextDisabled
          ]}
        >
          {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    letterSpacing: 2,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 10,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
});

export default OTPVerificationScreen;
