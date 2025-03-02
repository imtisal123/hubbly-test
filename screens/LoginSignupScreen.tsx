"use client"

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { theme } from "../styles/theme";
import { Facebook } from "lucide-react-native";
import { signInWithPhone, signInWithPhoneOTP } from "../lib/auth";
import { createAdminUser } from "../lib/admin";

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use OTP-based phone authentication
      const { success, error, message, phoneNumber: formattedPhone } = await signInWithPhoneOTP(phoneNumber);
      
      if (!success) {
        // If user already exists, offer to log in instead
        if (error?.message?.includes("already exists")) {
          Alert.alert(
            "Account Exists", 
            "This phone number is already registered. Would you like to log in instead?",
            [
              { 
                text: "Cancel", 
                style: "cancel" 
              },
              { 
                text: "Log In", 
                onPress: () => handleLogin() 
              }
            ]
          );
        } 
        // For rate limit errors, provide more helpful guidance
        else if (error?.message?.includes("rate limit") || error?.message?.includes("too many") || error?.message?.includes("exceeded")) {
          Alert.alert(
            "Rate Limit Reached", 
            "Too many sign-up attempts. Please try again later or use a different phone number.",
            [
              { 
                text: "OK" 
              },
              { 
                text: "Try Demo Account", 
                onPress: () => {
                  setPhoneNumber("+1234567890");
                }
              }
            ]
          );
        }
        // For other errors, show the error message
        else {
          Alert.alert("Sign Up Error", error?.message || "Failed to send verification code");
        }
        return;
      }
      
      // If successful, navigate to OTP verification screen with the formatted phone number
      navigation.navigate("otp-verification", { phone: formattedPhone || phoneNumber });
      
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (isAdminMode) {
      if (!email || !password) {
        Alert.alert("Error", "Please enter your email and password");
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log("Attempting admin login with:", email);
        // Use the createAdminUser function which will sign in if the user exists
        const { success, error, message, user } = await createAdminUser(email, password);
        
        if (success) {
          console.log("Admin login successful:", user?.id);
          // Navigate to the home screen or admin dashboard
          navigation.navigate("index");
        } else {
          console.error("Admin login failed:", error);
          // Show a more specific error message
          if (error?.message?.includes("already registered")) {
            Alert.alert(
              "Login Error", 
              "This email is already registered. Please use the correct password or try a different email."
            );
          } else if (error?.message?.includes("Invalid login credentials")) {
            Alert.alert("Login Error", "Invalid email or password. Please try again.");
          } else {
            Alert.alert("Login Error", message || error?.message || "Failed to log in");
          }
        }
      } catch (error) {
        console.error("Admin login error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!phoneNumber) {
        Alert.alert("Error", "Please enter your phone number");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // For regular users, use phone-based login
        if (password) {
          // If password is provided, use password-based authentication
          const { data, error } = await signInWithPhone(phoneNumber, password);
          
          if (error) {
            Alert.alert("Login Error", error.message);
            return;
          }
          
          // Navigate to the home screen
          navigation.navigate("index");
        } else {
          // If no password, use OTP-based authentication
          const { success, error } = await signInWithPhoneOTP(phoneNumber);
          
          if (!success) {
            Alert.alert("Login Error", error?.message || "Failed to send verification code");
            return;
          }
          
          // Navigate to OTP verification screen
          navigation.navigate("otp-verification", { phone: phoneNumber });
        }
      } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    Alert.alert("Facebook Login", "Facebook login is not implemented yet");
  };

  const useDemoAccount = () => {
    // Skip login completely and go to profile creation
    console.log("Bypassing login for demo");
    navigation.navigate("ProfileCreation");
  };
  
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    // Clear fields when switching modes
    setEmail('');
    setPhoneNumber('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <BackButton style={styles.backButton} />
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%201.42.56%E2%80%AFPM-k433KDUjNd6nqg8lwlOunNVTJZqLMO.png",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? "Sign up to find your perfect match" : "Log in to continue your journey"}
          </Text>

          <View style={styles.form}>
            {isAdminMode ? (
              // Admin login form
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </>
            ) : (
              // Regular user login/signup form
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                {!isSignUp && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                )}
              </>
            )}
            
            <TouchableOpacity
              style={styles.button}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignUp ? "Sign Up with Phone" : "Log In"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.facebookButton}
              onPress={handleFacebookLogin}
              disabled={isLoading}
            >
              <Facebook color="#fff" size={20} style={styles.facebookIcon} />
              <Text style={styles.facebookButtonText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={useDemoAccount}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>Use Demo Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adminModeButton}
              onPress={toggleAdminMode}
            >
              <Text style={styles.adminModeText}>
                {isAdminMode ? "Switch to Regular Login" : "Admin Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: theme.primaryDark,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: theme.textMedium,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.textDark,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  facebookIcon: {
    marginRight: 10,
  },
  facebookButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  switchButtonText: {
    fontSize: 14,
    color: theme.textMedium,
  },
  demoButton: {
    alignItems: "center",
    marginBottom: 10,
  },
  demoButtonText: {
    fontSize: 14,
    color: theme.textMedium,
    textDecorationLine: "underline",
  },
  adminModeButton: {
    alignItems: "center",
    marginBottom: 10,
  },
  adminModeText: {
    fontSize: 14,
    color: theme.textMedium,
  },
});