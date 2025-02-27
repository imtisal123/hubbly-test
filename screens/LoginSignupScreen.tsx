"use client"

import { useState } from "react"
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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import { Facebook } from "lucide-react-native"
import { signInWithPhone, signUpWithPhone } from "../lib/auth"

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const navigation = useNavigation()

  const handleSignUp = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password")
      return
    }
    
    setIsLoading(true)
    
    try {
      const { data, error } = await signUpWithPhone(phoneNumber, password)
      
      if (error) {
        Alert.alert("Sign Up Error", error.message)
        return
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
      )
    } catch (error) {
      console.error("Sign up error:", error)
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please enter both phone number and password")
      return
    }
    
    setIsLoading(true)
    
    try {
      const { data, error } = await signInWithPhone(phoneNumber, password)
      
      if (error) {
        Alert.alert("Login Error", error.message)
        return
      }
      
      // If successful, navigate to home screen
      navigation.navigate("Home")
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    Alert.alert("Facebook Login", "Facebook login is not implemented yet")
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-09%20at%201.42.56%E2%80%AFPM-k433KDUjNd6nqg8lwlOunNVTJZqLMO.png",
            }}
            style={styles.logo}
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                editable={!isLoading}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                editable={!isLoading}
              />
            </View>
          </View>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
          ) : (
            <>
              <View style={styles.buttonContainer}>
                {isSignUp ? (
                  <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.switchModeButton} 
                onPress={() => setIsSignUp(!isSignUp)}
              >
                <Text style={styles.switchModeText}>
                  {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>
              
              <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
                <Facebook color={theme.textLight} size={24} style={styles.facebookIcon} />
                <Text style={styles.buttonText}>Continue with Facebook</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 150,
    alignSelf: "center",
    marginBottom: 40,
    resizeMode: "contain",
  },
  formContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.text,
  },
  input: {
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginVertical: 5,
  },
  signUpButton: {
    backgroundColor: theme.primary,
  },
  loginButton: {
    backgroundColor: theme.primary,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  switchModeButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  switchModeText: {
    color: theme.primary,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    color: theme.textSecondary,
    paddingHorizontal: 10,
  },
  facebookButton: {
    flexDirection: "row",
    backgroundColor: "#4267B2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  facebookIcon: {
    marginRight: 10,
  },
  loader: {
    marginVertical: 20,
  },
})
