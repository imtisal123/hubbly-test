"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

const MatchPreferencesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [religion, setReligion] = useState("")
  const [sect, setSect] = useState("")
  const [otherSect, setOtherSect] = useState("")
  const [ethnicity, setEthnicity] = useState("")

  const [showReligionPicker, setShowReligionPicker] = useState(false)
  const [showSectPicker, setShowSectPicker] = useState(false)

  const handleNext = () => {
    if (selectedAges.length > 0 && religion && ethnicity) {
      navigation.navigate("FinalCongrats", {
        name,
        selectedAges,
        religion,
        sect: sect === "Other" ? otherSect : sect,
        ethnicity,
      })
    } else {
      alert("Please fill in all required fields")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={2} totalSteps={3} />
      <Text style={styles.title}>{`Please share ${name}'s preferences for a partner:`}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age Range (select all that apply):</Text>
        {["18-21", "22-25", "26-29", "30-33", "34-37", "38-41", "42+"].map((range) => (
          <TouchableOpacity
            key={range}
            style={styles.checkboxContainer}
            onPress={() => {
              setSelectedAges((prev) =>
                prev.includes(range) ? prev.filter((item) => item !== range) : [...prev, range],
              )
            }}
          >
            <View style={[styles.checkbox, selectedAges.includes(range) && styles.checked]} />
            <Text style={styles.checkboxLabel}>{range}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Religion:</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowReligionPicker(true)}>
          <Text>{religion || "Select religion"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showReligionPicker}
          onClose={() => setShowReligionPicker(false)}
          onSelect={(value) => {
            setReligion(value)
            setSect("")
            setOtherSect("")
          }}
          options={[
            { label: "Muslim", value: "Muslim" },
            { label: "Christian", value: "Christian" },
            { label: "Hindu", value: "Hindu" },
          ]}
          selectedValue={religion}
        />
      </View>

      {religion === "Muslim" && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sect:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowSectPicker(true)}>
              <Text>{sect || "Select sect"}</Text>
            </TouchableOpacity>
            <PickerModal
              visible={showSectPicker}
              onClose={() => setShowSectPicker(false)}
              onSelect={setSect}
              options={[
                { label: "Sunni", value: "Sunni" },
                { label: "Shia", value: "Shia" },
                { label: "Other", value: "Other" },
              ]}
              selectedValue={sect}
            />
            {sect === "Other" && (
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                onChangeText={setOtherSect}
                value={otherSect}
                placeholder="Please specify"
              />
            )}
          </View>
        </>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ethnicity:</Text>
        <TextInput style={styles.input} onChangeText={setEthnicity} value={ethnicity} placeholder="Enter ethnicity" />
      </View>

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
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
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

