"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function CareerScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [employer, setEmployer] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [showIncomePicker, setShowIncomePicker] = useState(false)

  useEffect(() => {
    console.log("Debug: Gender is", gender, "Is male?", gender.toLowerCase() === "male")
    console.log("Debug: Rendering labels for", gender.toLowerCase() === "male" ? "male" : "non-male")
  }, [gender])

  const handleSubmit = () => {
    const careerData = {
      ...route.params,
      employer,
      jobTitle,
      monthlyIncome: gender.toLowerCase() === "male" ? monthlyIncome : undefined,
    }

    if (gender.toLowerCase() === "male") {
      navigation.navigate("Home", careerData)
    } else {
      navigation.navigate("Other", careerData)
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={8} totalSteps={gender.toLowerCase() === "male" ? 11 : 10} />
        <Text style={styles.title}>Career Details for {name}</Text>
        {/* Debug information */}
        {/* <Text style={styles.debugText}>Gender: {gender}, Is male? {gender.toLowerCase() === "male" ? "Yes" : "No"}</Text> */}
        <Text style={styles.label}>{gender.toLowerCase() === "male" ? "Employer" : "Employer (Optional)"}</Text>
        <TextInput style={styles.input} value={employer} onChangeText={setEmployer} placeholder="Enter employer name" />
        {/* Debug information */}
        {/* <Text style={styles.debugText}>Gender: {gender}, Is male? {gender.toLowerCase() === "male" ? "Yes" : "No"}</Text> */}
        <Text style={styles.label}>{gender.toLowerCase() === "male" ? "Job Title" : "Job Title (Optional)"}</Text>
        <TextInput style={styles.input} value={jobTitle} onChangeText={setJobTitle} placeholder="Enter job title" />
        {gender.toLowerCase() === "male" && (
          <>
            <Text style={styles.label}>Monthly Income</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowIncomePicker(true)}>
              <Text>{monthlyIncome || "Select income range"}</Text>
            </TouchableOpacity>
            <PickerModal
              visible={showIncomePicker}
              onClose={() => setShowIncomePicker(false)}
              onSelect={(value) => setMonthlyIncome(value)}
              options={[
                { label: "PKR 0 - PKR 100,000", value: "PKR 0 - PKR 100,000" },
                { label: "PKR 100,000 - PKR 200,000", value: "PKR 100,000 - PKR 200,000" },
                { label: "PKR 200,000 - PKR 500,000", value: "PKR 200,000 - PKR 500,000" },
                { label: "PKR 500,000 - PKR 1,000,000", value: "PKR 500,000 - PKR 1,000,000" },
                { label: "PKR 1,000,000+", value: "PKR 1,000,000+" },
              ]}
              selectedValue={monthlyIncome}
            />
            <Text style={styles.note}>
              Note: This information will not be shown to others but is used to show you profiles from similar income
              backgrounds.
            </Text>
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text,
    fontWeight: "bold",
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  note: {
    fontSize: 12,
    color: theme.text,
    fontStyle: "italic",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  debugText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
})

