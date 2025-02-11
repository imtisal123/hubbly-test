"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import PickerModal from "../components/PickerModal"
import ProgressBar from "../components/ProgressBar"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"

export default function ProfileDetailsScreen1({ route }) {
  const { relation, name } = route.params
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [gender, setGender] = useState("")
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [height, setHeight] = useState("")
  const [showHeightPicker, setShowHeightPicker] = useState(false)
  const navigation = useNavigation()

  const generateHeightOptions = () => {
    const options = []
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        // Stop at 7'0"
        if (feet === 7 && inches > 0) break

        const totalInches = feet * 12 + inches
        options.push({
          label: `${feet}'${inches}"`,
          value: totalInches.toString(),
        })
      }
    }
    return options
  }

  const formatHeight = (heightInInches) => {
    if (!heightInInches) return "Select height"
    const feet = Math.floor(Number.parseInt(heightInInches) / 12)
    const inches = Number.parseInt(heightInInches) % 12
    return `${feet}'${inches}"`
  }

  const handleNext = () => {
    navigation.navigate("ProfileDetails2", { relation, name, dateOfBirth, gender, height })
  }

  return (
    <ScrollView style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={4} />
      <Text style={styles.title}>Profile Details for {name}</Text>

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{dateOfBirth.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false)
            if (selectedDate) setDateOfBirth(selectedDate)
          }}
        />
      )}

      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowGenderPicker(true)}>
        <Text>{gender || "Select gender"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        onSelect={(value) => setGender(value)}
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        selectedValue={gender}
      />

      <Text style={styles.label}>Height</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowHeightPicker(true)}>
        <Text>{formatHeight(height)}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showHeightPicker}
        onClose={() => setShowHeightPicker(false)}
        onSelect={(value) => setHeight(value)}
        options={generateHeightOptions()}
        selectedValue={height}
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
})

