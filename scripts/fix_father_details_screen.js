/**
 * Script to fix the FatherDetailsScreen.tsx file
 * This script will completely rewrite the file to ensure it has proper syntax
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'screens', 'FatherDetailsScreen.tsx');

// Create the new file content with proper syntax
const newContent = `"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, View } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

const FatherDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, fatherAlive } = route.params

  const [maritalStatus, setMaritalStatus] = useState("")
  const [cityOfResidence, setCityOfResidence] = useState("")
  const [areaOfResidence, setAreaOfResidence] = useState("")
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)

  const handleNext = () => {
    if (!maritalStatus || !cityOfResidence) {
      alert("Please fill in all required fields.")
      return
    }

    navigation.navigate("FatherAdditionalInfo", {
      ...route.params,
      fatherMaritalStatus: maritalStatus,
      fatherCityOfResidence: cityOfResidence,
      fatherAreaOfResidence: areaOfResidence,
    })
  }

  if (!route.params.fatherAlive) {
    return (
      <View style={styles.container}>
        <BackButton />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProgressBar currentStep={1} totalSteps={7} />
          <Text style={styles.title}>Father Details</Text>
          <Text style={styles.subtitle}>Your father has passed away. We're sorry for your loss.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MotherDetails", route.params)}>
            <Text style={styles.buttonText}>Continue to Mother's Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={1} totalSteps={7} />
        <Text style={styles.title}>Father Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Marital Status</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
            <Text style={maritalStatus ? styles.inputText : styles.placeholderText}>
              {maritalStatus || "Select marital status"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>City of Residence</Text>
          <TextInput
            style={styles.input}
            value={cityOfResidence}
            onChangeText={setCityOfResidence}
            placeholder="Enter city of residence"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Area of Residence (Optional)</Text>
          <TextInput
            style={styles.input}
            value={areaOfResidence}
            onChangeText={setAreaOfResidence}
            placeholder="Enter area of residence"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !maritalStatus || !cityOfResidence ? styles.buttonDisabled : null]}
          onPress={handleNext}
          disabled={!maritalStatus || !cityOfResidence}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      <PickerModal
        visible={showMaritalStatusPicker}
        options={["Single", "Married", "Divorced", "Widowed"]}
        onSelect={(value) => {
          setMaritalStatus(value)
          setShowMaritalStatusPicker(false)
        }}
        onClose={() => setShowMaritalStatusPicker(false)}
        title="Select Marital Status"
      />
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: theme.primaryDark,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: theme.textMedium,
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
    justifyContent: "center",
  },
  inputText: {
    color: theme.textDark,
  },
  placeholderText: {
    color: theme.textMedium,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: theme.border,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default FatherDetailsScreen`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('FatherDetailsScreen.tsx has been fixed!');
