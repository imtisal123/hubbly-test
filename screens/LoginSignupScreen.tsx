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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import { Facebook } from "lucide-react-native"

export default function LoginSignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const navigation = useNavigation()

  const handleSignUp = () => {
    navigation.navigate("Placeholder")
  }

  const handleLogin = () => {
    navigation.navigate("Placeholder")
  }

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    console.log("Facebook login pressed")
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
            <Facebook color={theme.textLight} size={24} style={styles.facebookIcon} />
            <Text style={styles.buttonText}>Continue with Facebook</Text>
          </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.text,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: theme.primary,
  },
  loginButton: {
    backgroundColor: theme.primaryDark,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "500",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  facebookIcon: {
    marginRight: 10,
  },
})

