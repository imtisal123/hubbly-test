/**
 * Script to fix the CareerScreen.tsx file
 * This script will fix the import statement issue
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'screens', 'CareerScreen.tsx');

// Create the new file content with proper syntax
const newContent = `"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";

export default function CareerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, dateOfBirth, gender, ethnicity, location, education } = route.params;

  const [occupation, setOccupation] = useState("");
  const [company, setCompany] = useState("");
  const [income, setIncome] = useState("");
  const [showIncomePicker, setShowIncomePicker] = useState(false);

  useEffect(() => {
    // If we have career info in the route params, set it
    if (route.params?.career) {
      const { occupation: savedOccupation, company: savedCompany, income: savedIncome } = route.params.career;
      if (savedOccupation) setOccupation(savedOccupation);
      if (savedCompany) setCompany(savedCompany);
      if (savedIncome) setIncome(savedIncome);
    }
  }, [route.params]);

  const incomeRanges = [
    "Prefer not to say",
    "Under $30,000",
    "$30,000 - $50,000",
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "$100,000 - $150,000",
    "$150,000 - $200,000",
    "Over $200,000"
  ];

  const handleNext = () => {
    // Navigate to the next screen with all the accumulated data
    navigation.navigate("ProfilePic", {
      ...route.params,
      career: {
        occupation,
        company,
        income
      }
    });
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar 
          currentStep={gender.toLowerCase() === "male" ? 10 : 9} 
          totalSteps={gender.toLowerCase() === "male" ? 11 : 10} 
        />
        <Text style={styles.title}>Career Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Software Engineer"
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company/Organization</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Google"
            value={company}
            onChangeText={setCompany}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Income Range (Optional)</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowIncomePicker(true)}
          >
            <Text style={income ? styles.inputText : styles.placeholder}>
              {income || "Select income range"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <PickerModal
        visible={showIncomePicker}
        options={incomeRanges}
        onSelect={(value) => {
          setIncome(value);
          setShowIncomePicker(false);
        }}
        onClose={() => setShowIncomePicker(false)}
        title="Select Income Range"
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: theme.primaryDark,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: theme.textDark,
  },
  input: {
    backgroundColor: theme.textLight,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    color: theme.text,
  },
  inputText: {
    color: theme.text,
    fontSize: 16,
  },
  placeholder: {
    color: theme.border,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
});`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('CareerScreen.tsx has been fixed!');
