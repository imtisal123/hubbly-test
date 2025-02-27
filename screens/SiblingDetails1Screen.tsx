"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

const SiblingDetails1Screen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, sisters, brothers, currentSibling, totalSiblings } = route.params

  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("")
  const [cityOfResidence, setCityOfResidence] = useState("")

  const [showAgePicker, setShowAgePicker] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)

  const handleNext = () => {
    if (!age || !gender || !maritalStatus || !cityOfResidence) {
      alert("Please fill in all fields")
      return
    }

    navigation.navigate("SiblingDetails2", {
      ...route.params,
      age,
      gender,
      maritalStatus,
      cityOfResidence,
    })
  }

  const generateAgeOptions = () => {
    return Array.from({ length: 51 }, (_, i) => ({ label: `${i} years`, value: i.toString() }))
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={currentSibling * 3 - 1} totalSteps={totalSiblings * 3 + 1} />
      <Text style={styles.title}>{`${name}'s ${
        currentSibling <= sisters ? "Sister" : "Brother"
      } Details (${currentSibling}/${totalSiblings})`}</Text>

      <Text style={styles.label}>Age</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowAgePicker(true)}>
        <Text>{age || "Select age"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showAgePicker}
        onClose={() => setShowAgePicker(false)}
        onSelect={(value) => setAge(value)}
        options={generateAgeOptions()}
        selectedValue={age}
      />

      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowGenderPicker(true)}>
        <Text>{gender || "Select gender"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        onSelect={(value) => setGender(value)}
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        selectedValue={gender}
      />

      <Text style={styles.label}>Marital Status</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
        <Text>{maritalStatus || "Select marital status"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showMaritalStatusPicker}
        onClose={() => setShowMaritalStatusPicker(false)}
        onSelect={(value) => setMaritalStatus(value)}
        options={[
          { label: "Not married", value: "Not married" },
          { label: "Married", value: "Married" },
          { label: "Divorced", value: "Divorced" },
          { label: "Separated", value: "Separated" },
          { label: "Widowed", value: "Widowed" },
        ]}
        selectedValue={maritalStatus}
      />

      <Text style={styles.label}>City of Residence</Text>
      <TextInput
        style={[styles.input, { height: 40 }]}
        value={cityOfResidence}
        onChangeText={setCityOfResidence}
        placeholder="Enter city of residence"
        placeholderTextColor={theme.textLight}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    textAlign: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default SiblingDetails1Screen

