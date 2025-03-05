/**
 * Script to fix the LoginSignupScreen.tsx file
 * This script will completely rewrite the file to ensure it has proper syntax
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'screens', 'LoginSignupScreen.tsx');

// Read the current file content
const currentContent = fs.readFileSync(filePath, 'utf8');

// Extract the important parts we need to preserve
const extractStyles = (content) => {
  const stylesMatch = content.match(/const styles = StyleSheet\.create\({[\s\S]*?\n}\);?/);
  return stylesMatch ? stylesMatch[0] : '';
};

const styles = extractStyles(currentContent);

// Create the new file content with proper syntax
const newContent = `"use client"

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
import { signInWithPhone, signUpWithPhone } from "../lib/auth";

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signUpWithPhone(phoneNumber, password);
      
      if (error) {
        // If user already exists, offer to log in instead
        if (error.message.includes("already exists")) {
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
        else if (error.message.includes("rate limit") || error.message.includes("too many") || error.message.includes("exceeded")) {
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
                  setPassword("admin123");
                }
              }
            ]
          );
        }
        // For other errors, show the error message
        else {
          Alert.alert("Sign Up Error", error.message);
        }

        return;
      }
      
      // If successful, navigate to profile creation
      Alert.alert(
        "Sign Up Successful", 
        "Your account has been created. Please create your profile.",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate("ProfileCreation") 
          }
        ]
      );
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signInWithPhone(phoneNumber, password);
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          Alert.alert("Login Failed", "Invalid phone number or password. Please try again.");
        } else {
          Alert.alert("Login Error", error.message);
        }
        return;
      }
      
      // If successful, navigate to home
      console.log("Login successful:", data);
      
      // Check if profile exists, if not, send to profile creation
      if (!data.user?.user_metadata?.hasProfile) {
        navigation.navigate("ProfileCreation");
        return;
      }
      
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    navigation.navigate("Home");
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    Alert.alert("Facebook Login", "Facebook login is not implemented yet");
  };

  const useDemoAccount = () => {
    // Use the admin test credentials from ADMIN-PROFILE-SETUP.md
    setPhoneNumber("admin_test@hubbly.app");
    setPassword("admin123");
    Alert.alert(
      "Demo Account",
      "Admin test credentials have been filled in. Press 'Log In' to continue.",
      [{ text: "OK" }]
    );
  };
  
  const goDirectlyToDemo = async () => {
    // Skip login completely and go to profile creation
    console.log("Bypassing login completely for demo");
    navigation.navigate("ProfileCreation");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <BackButton />
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

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.textLight} />
              ) : (
                <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Log In"}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.facebookButton}
              onPress={handleFacebookLogin}
              disabled={isLoading}
            >
              <Facebook color="#ffffff" size={20} />
              <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchContainer} onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.switchText}>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Text style={styles.switchTextBold}>{isSignUp ? "Log In" : "Sign Up"}</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoContainer} onPress={useDemoAccount}>
              <Text style={styles.demoText}>Use Demo Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoContainer} onPress={goDirectlyToDemo}>
              <Text style={styles.demoText}>Skip Login (Demo)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

${styles}`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('LoginSignupScreen.tsx has been fixed!');
