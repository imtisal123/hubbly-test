"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";

export default function EducationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, dateOfBirth, gender, ethnicity, location } = route.params;

  const [educationLevel, setEducationLevel] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  const handleNext = () => {
    if (!educationLevel) {
      alert("Please select your education level");
      return;
    }

    navigation.navigate("Career", {
      ...route.params,
      education: {
        level: educationLevel,
        institution,
        fieldOfStudy,
      },
    });
  };
  
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={4} totalSteps={7} />
        <Text style={styles.title}>Education Details</Text>
        
        <Text style={styles.label}>Highest Education Level</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEducationPicker(true)}>
          <Text>{educationLevel || "Select education level"}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Institution</Text>
        <TextInput
          style={styles.input}
          value={institution}
          onChangeText={setInstitution}
          placeholder="Enter your institution name"
        />
        
        <Text style={styles.label}>Field of Study</Text>
        <TextInput
          style={styles.input}
          value={fieldOfStudy}
          onChangeText={setFieldOfStudy}
          placeholder="Enter your field of study"
        />
        
        <TouchableOpacity
          style={[styles.button, !educationLevel && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!educationLevel}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <PickerModal
        visible={showEducationPicker}
        options={[
          { label: "High School", value: "High School" },
          { label: "Associate's Degree", value: "Associate's Degree" },
          { label: "Bachelor's Degree", value: "Bachelor's Degree" },
          { label: "Master's Degree", value: "Master's Degree" },
          { label: "Doctorate", value: "Doctorate" },
          { label: "Professional Degree", value: "Professional Degree" },
          { label: "Other", value: "Other" },
        ]}
        onSelect={(value) => {
          setEducationLevel(value);
          setShowEducationPicker(false);
        }}
        onClose={() => setShowEducationPicker(false)}
        selectedValue={educationLevel}
      />
    </View>
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: theme.border,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});