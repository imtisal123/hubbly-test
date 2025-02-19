"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

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
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={1} totalSteps={10} />
      <Text style={styles.title}>Who are you creating this profile for?</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker(true)}>
        <Text style={styles.pickerButtonText}>{relation || "Select relation"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(value) => setRelation(value)}
        options={[
          { label: "Daughter", value: "Daughter" },
          { label: "Son", value: "Son" },
          { label: "Sister", value: "Sister" },
          { label: "Brother", value: "Brother" },
        ]}
        selectedValue={relation}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  pickerButton: {
    backgroundColor: theme.textLight,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: "center",
    width: "80%",
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.text,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    width: "80%",
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default ProfileCreationScreen

