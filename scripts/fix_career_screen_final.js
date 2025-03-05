/**
 * Script to fix the CareerScreen.tsx file
 * This script will completely rewrite the file to ensure it has proper syntax
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'screens', 'CareerScreen.tsx');

// Create the new file content with proper syntax
const newContent = `"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function CareerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, dateOfBirth, gender, ethnicity, location, education } = route.params;

  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");
  const [income, setIncome] = useState("");
  const [showIncomePicker, setShowIncomePicker] = useState(false);

  useEffect(() => {
    // Any initialization logic can go here
  }, []);

  const handleSubmit = () => {
    if (!occupation) {
      alert("Please enter your occupation");
      return;
    }

    navigation.navigate("ProfilePic", {
      ...route.params,
      career: {
        occupation,
        company,
        income,
      },
    });
  };

  const incomeOptions = [
    "Less than $1,000",
    "$1,000 - $3,000",
    "$3,001 - $5,000",
    "$5,001 - $8,000",
    "$8,001 - $12,000",
    "$12,001 - $20,000",
    "More than $20,000",
    "Prefer not to say",
  ];

  const handleIncomeSelect = (value) => {
    setIncome(value);
    setShowIncomePicker(false);
  };
    
  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={5} totalSteps={7} />
        <Text style={styles.title}>Career Information</Text>
        
        <Text style={styles.label}>Occupation</Text>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Enter your occupation"
        />
        
        <Text style={styles.label}>Company/Organization (Optional)</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Enter your company or organization"
        />
        
        <Text style={styles.label}>Monthly Income (Optional)</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowIncomePicker(true)}>
          <Text>{income || "Select income range"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, !occupation && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!occupation}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <PickerModal
        visible={showIncomePicker}
        options={incomeOptions}
        onSelect={handleIncomeSelect}
        onClose={() => setShowIncomePicker(false)}
        title="Select Monthly Income"
      />
    </View>
  );
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
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    color: theme.textDark,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: theme.textLight,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 30,
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
});`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('CareerScreen.tsx has been fixed!');
