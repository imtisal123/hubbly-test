"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function EducationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [educationLevel, setEducationLevel] = useState("")
  const [university, setUniversity] = useState("")
  const [showEducationLevelPicker, setShowEducationLevelPicker] = useState(false)

  const handleNext = () => {
    navigation.navigate("Location", {
      ...route.params,
      educationLevel,
      university,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={6} totalSteps={gender.toLowerCase() === "male" ? 11 : 10} />
        <Text style={styles.title}>Education Details for {name}</Text>

        <Text style={styles.label}>{`What is ${name}'s highest Education Level?`}</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEducationLevelPicker(true)}>
          <Text>{educationLevel || "Select education level"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showEducationLevelPicker}
          onClose={() => setShowEducationLevelPicker(false)}
          onSelect={(value) => setEducationLevel(value)}
          options={[
            { label: "High school", value: "High school" },
            { label: "Bachelors", value: "Bachelors" },
            { label: "Masters", value: "Masters" },
            { label: "PHD", value: "PHD" },
            { label: "MBBS", value: "MBBS" },
          ]}
          selectedValue={educationLevel}
        />

        <Text
          style={styles.label}
        >{`Which university did ${name} get ${gender.toLowerCase() === "male" ? "his" : "her"} highest educational degree from?`}</Text>
        <TextInput
          style={styles.input}
          value={university}
          onChangeText={setUniversity}
          placeholder="Enter university name"
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: theme.textLight,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

