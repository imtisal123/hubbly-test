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
  const { name, gender } = route.params;

  const [employer, setEmployer] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [showIncomePicker, setShowIncomePicker] = useState(false);

  useEffect(() => {
    console.log("Debug: Gender is", gender, "Is male?", gender.toLowerCase() === "male");
    console.log("Debug: Rendering labels for", gender.toLowerCase() === "male" ? "male" : "non-male");
  }, [gender]);

  const handleSubmit = () => {
    const careerData = {
      ...route.params,
      employer,
      jobTitle,
      monthlyIncome: gender.toLowerCase() === "male" ? monthlyIncome : undefined,
    };

    if (gender.toLowerCase() === "male") {
      navigation.navigate("Home", careerData);
    } else {
      navigation.navigate("Other", careerData);
    }
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
    setMonthlyIncome(value);
    setShowIncomePicker(false);
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={6} totalSteps={7} />
        <Text style={styles.title}>Career Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employer</Text>
          <TextInput
            style={styles.input}
            value={employer}
            onChangeText={setEmployer}
            placeholder="Enter your employer"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={jobTitle}
            onChangeText={setJobTitle}
            placeholder="Enter your job title"
          />
        </View>

        {gender.toLowerCase() === "male" && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Monthly Income (PKR)</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowIncomePicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {monthlyIncome || "Select your monthly income"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!employer || !jobTitle || (gender.toLowerCase() === "male" && !monthlyIncome))
              ? styles.buttonDisabled
              : null,
          ]}
          onPress={handleSubmit}
          disabled={
            !employer || !jobTitle || (gender.toLowerCase() === "male" && !monthlyIncome)
          }
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
  pickerButton: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
    justifyContent: "center",
  },
  pickerButtonText: {
    color: theme.textDark,
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
});`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('CareerScreen.tsx has been fixed!');
