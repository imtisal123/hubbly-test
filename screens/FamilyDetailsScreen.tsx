"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"
import { TouchableOpacity } from "react-native-gesture-handler"

const FamilyDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [familyEnvironment, setFamilyEnvironment] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [showEnvironmentPicker, setShowEnvironmentPicker] = useState(false)

  const handleNext = () => {
    if (familyEnvironment) {
      navigation.navigate("MatchPreferences", { name, familyEnvironment, additionalInfo })
    } else {
      alert("Please select a family environment")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={1} totalSteps={3} />
      <Text style={styles.title}>{`Please add ${name}'s family details:`}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Family environment:</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEnvironmentPicker(true)}>
          <Text>{familyEnvironment || "Select family environment"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showEnvironmentPicker}
          onClose={() => setShowEnvironmentPicker(false)}
          onSelect={(value) => setFamilyEnvironment(value)}
          options={[
            { label: "Liberal", value: "Liberal" },
            { label: "Moderate", value: "Moderate" },
            { label: "Conservative", value: "Conservative" },
          ]}
          selectedValue={familyEnvironment}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{`Is there anything else you would like to share about ${name}'s family:`}</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          onChangeText={setAdditionalInfo}
          value={additionalInfo}
          placeholder="Enter additional information here"
        />
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
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    backgroundColor: theme.textLight,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
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
})

export default FamilyDetailsScreen

