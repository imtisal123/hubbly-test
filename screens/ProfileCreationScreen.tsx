"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";

const ProfileCreationScreen = () => {
  const [relation, setRelation] = useState("")
  const [showPicker, setShowPicker] = useState(false)
  const navigation = useNavigation()

  const handleNext = () => {
    if (!relation) {
      Alert.alert("Error", "Please select a relation")
      return
    }
    const gender = relation === "Daughter" || relation === "Sister" ? "female" : "male"
    navigation.navigate("Name", { relation, gender })
  };
  
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Who are you creating this profile for?</Text>
        
        <TouchableOpacity 
          style={styles.pickerButton} 
          onPress={() => setShowPicker(true)}
        >
          <Text style={relation ? styles.pickerButtonTextSelected : styles.pickerButtonText}>
            {relation || "Select relation"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, !relation && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={!relation}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <PickerModal
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={(value) => setRelation(value)}
          options={[
            { label: "Son", value: "Son" },
            { label: "Daughter", value: "Daughter" },
            { label: "Brother", value: "Brother" },
            { label: "Sister", value: "Sister" },
          ]}
          selectedValue={relation}
        />
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
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
    color: theme.text,
  },
  pickerButton: {
    backgroundColor: theme.textLight,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 30,
    alignSelf: "center",
    width: "80%",
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.textMedium,
    textAlign: "center",
  },
  pickerButtonTextSelected: {
    fontSize: 16,
    color: theme.text,
    textAlign: "center",
    fontWeight: "500",
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
})

export default ProfileCreationScreen