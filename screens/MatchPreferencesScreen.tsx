"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";



const MatchPreferencesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name } = route.params;
  
  const [ageRange, setAgeRange] = useState("");
  const [heightRange, setHeightRange] = useState("");
  const [educationPref, setEducationPref] = useState("");
  const [locationPref, setLocationPref] = useState("");
  const [showAgeRangePicker, setShowAgeRangePicker] = useState(false);
  const [showHeightRangePicker, setShowHeightRangePicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  
  const handleNext = () => {
    if (!ageRange || !heightRange || !educationPref || !locationPref) {
      alert("Please fill in all fields");
      return;
    }
    
    navigation.navigate("FinalCongrats", {
      ...route.params,
      ageRange,
      heightRange,
      educationPref,
      locationPref
    });
  };
      
  
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={7} totalSteps={7} />
        <Text style={styles.title}>Match Preferences</Text>
        <Text style={styles.subtitle}>Let us know what you're looking for in a match for {name}</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age Range</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowAgeRangePicker(true)}>
            <Text>{ageRange || "Select age range"}</Text>
          </TouchableOpacity>
          <PickerModal
            visible={showAgeRangePicker}
            onClose={() => setShowAgeRangePicker(false)}
            onSelect={(value) => setAgeRange(value)}
            options={[
              { label: "18-25", value: "18-25" },
              { label: "25-30", value: "25-30" },
              { label: "30-35", value: "30-35" },
              { label: "35-40", value: "35-40" },
              { label: "40-45", value: "40-45" },
              { label: "45-50", value: "45-50" },
              { label: "50+", value: "50+" },
            ]}
            selectedValue={ageRange}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height Range</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowHeightRangePicker(true)}>
            <Text>{heightRange || "Select height range"}</Text>
          </TouchableOpacity>
          <PickerModal
            visible={showHeightRangePicker}
            onClose={() => setShowHeightRangePicker(false)}
            onSelect={(value) => setHeightRange(value)}
            options={[
              { label: "5'0\" - 5'4\"", value: "5'0\" - 5'4\"" },
              { label: "5'4\" - 5'8\"", value: "5'4\" - 5'8\"" },
              { label: "5'8\" - 6'0\"", value: "5'8\" - 6'0\"" },
              { label: "6'0\" - 6'4\"", value: "6'0\" - 6'4\"" },
              { label: "6'4\"+", value: "6'4\"+" },
            ]}
            selectedValue={heightRange}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Education Preference</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowEducationPicker(true)}>
            <Text>{educationPref || "Select education preference"}</Text>
          </TouchableOpacity>
          <PickerModal
            visible={showEducationPicker}
            onClose={() => setShowEducationPicker(false)}
            onSelect={(value) => setEducationPref(value)}
            options={[
              { label: "High School", value: "High School" },
              { label: "Bachelors", value: "Bachelors" },
              { label: "Masters", value: "Masters" },
              { label: "PhD", value: "PhD" },
              { label: "No Preference", value: "No Preference" },
            ]}
            selectedValue={educationPref}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location Preference</Text>
          <TextInput
            style={styles.input}
            value={locationPref}
            onChangeText={setLocationPref}
            placeholder="Enter location preference"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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
    color: theme.primaryDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 5,
    padding: 10,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.border,
    marginRight: 10,
  },
  checked: {
    backgroundColor: theme.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: theme.text,
  },
})

export default MatchPreferencesScreen