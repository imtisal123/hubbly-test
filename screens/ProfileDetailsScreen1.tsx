"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import PickerModal from "../components/PickerModal"
import ProgressBar from "../components/ProgressBar"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"

export default function ProfileDetailsScreen1() {
  const route = useRoute()
  const { relation, name, gender: initialGender } = route.params
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [gender, setGender] = useState(
    initialGender ? initialGender.charAt(0).toUpperCase() + initialGender.slice(1) : "",
  )
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [height, setHeight] = useState("")
  const [showHeightPicker, setShowHeightPicker] = useState(false)
  const navigation = useNavigation()

  const generateDayOptions = () => {
    return Array.from({ length: 31 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }))
  }

  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]

  const generateYearOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const year = 2008 - i
      return { label: year.toString(), value: year.toString() }
    })
  }

  const generateHeightOptions = () => {
    const options = []
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        if (feet === 4 && inches < 6) continue // Start from 4 ft 6 inches
        if (feet === 7 && inches > 0) break // Stop at 7'0"
        const totalInches = feet * 12 + inches
        options.push({
          label: `${feet} ft ${inches} inches`,
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
    return `${feet} ft ${inches} inches`
  }

  const handleNext = () => {
    if (!day || !month || !year || !gender || !height) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    const dateOfBirth = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`)
    if (isNaN(dateOfBirth.getTime())) {
      Alert.alert("Error", "Please enter a valid date")
      return
    }
    navigation.navigate("ProfileDetails2", {
      relation,
      name,
      dateOfBirth: dateOfBirth.toISOString(),
      gender,
      height,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={3} totalSteps={10} />
        <Text style={styles.title}>Profile Details for {name}</Text>

        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateInputContainer}>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDayPicker(true)}>
            <Text>{day || "Day"}</Text>
          </TouchableOpacity>
          <Text style={styles.dateInputSeparator}>/</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowMonthPicker(true)}>
            <Text>{month ? monthOptions.find((m) => m.value === month)?.label : "Month"}</Text>
          </TouchableOpacity>
          <Text style={styles.dateInputSeparator}>/</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowYearPicker(true)}>
            <Text>{year || "Year"}</Text>
          </TouchableOpacity>
        </View>

        <PickerModal
          visible={showDayPicker}
          onClose={() => setShowDayPicker(false)}
          onSelect={(value) => setDay(value)}
          options={generateDayOptions()}
          selectedValue={day}
        />
        <PickerModal
          visible={showMonthPicker}
          onClose={() => setShowMonthPicker(false)}
          onSelect={(value) => setMonth(value)}
          options={monthOptions}
          selectedValue={month}
        />
        <PickerModal
          visible={showYearPicker}
          onClose={() => setShowYearPicker(false)}
          onSelect={(value) => setYear(value)}
          options={generateYearOptions()}
          selectedValue={year}
        />

        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowGenderPicker(true)}>
          <Text>{gender || "Select gender"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showGenderPicker}
          onClose={() => setShowGenderPicker(false)}
          onSelect={(value) => setGender(value.charAt(0).toUpperCase() + value.slice(1))}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
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
    marginTop: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateInput: {
    height: 40,
    flex: 1,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: theme.textLight,
  },
  dateInputSeparator: {
    fontSize: 20,
    marginHorizontal: 5,
    color: theme.text,
  },
})

