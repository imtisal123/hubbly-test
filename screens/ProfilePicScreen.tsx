"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import { Camera } from "lucide-react-native"
import * as ImagePicker from "expo-image-picker"

export default function ProfilePicScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [image, setImage] = useState(null)
  const [showOnlyToMatches, setShowOnlyToMatches] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleNext = () => {
    if (gender.toLowerCase() === "male" && !image) {
      Alert.alert("Error", "Please upload at least one picture")
      return
    }
    // Here you would typically upload the image to your server
    // and then navigate to the next screen or complete the profile creation
    Alert.alert("Success", "Profile picture uploaded successfully", [
      { text: "OK", onPress: () => navigation.navigate("LoginSignup") },
    ])
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar
          currentStep={gender.toLowerCase() === "male" ? 11 : 10}
          totalSteps={gender.toLowerCase() === "male" ? 11 : 10}
        />
        <Text style={styles.title}>Profile Picture{gender.toLowerCase() === "female" ? " (Optional)" : ""}</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          {image ? <Image source={{ uri: image }} style={styles.image} /> : <Camera size={50} color={theme.primary} />}
        </TouchableOpacity>
        <Text style={styles.uploadText}>{image ? "Tap to change picture" : "Tap to upload picture"}</Text>

        {gender.toLowerCase() === "male" && <Text style={styles.mandatoryText}>Minimum 1 picture required</Text>}

        {gender.toLowerCase() === "female" && (
          <View>
            <Text style={styles.privacyText}>
              We handle all pictures with utmost privacy and they will not be shared with anyone without permission.
            </Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, showOnlyToMatches && styles.checkboxChecked]}
                onPress={() => setShowOnlyToMatches(!showOnlyToMatches)}
              >
                {showOnlyToMatches && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Only show {name}'s picture to profiles I match with</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{gender.toLowerCase() === "female" && !image ? "Skip" : "Next"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  uploadButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.textLight,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.text,
    fontSize: 18,
  },
  mandatoryText: {
    textAlign: "center",
    color: theme.primary,
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 18,
  },
  privacyText: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.text,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 5,
    padding: 10,
    backgroundColor: theme.background,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.textLight,
  },
  checkboxChecked: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  checkmark: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxLabel: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

