"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import PickerModal from "../components/PickerModal"
import ProgressBar from "../components/ProgressBar"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"

export default function ProfileCreationScreen() {
  const [relation, setRelation] = useState("")
  const [otherRelation, setOtherRelation] = useState("")
  const [showPicker, setShowPicker] = useState(false)
  const navigation = useNavigation()

  const handleNext = () => {
    navigation.navigate("Name", { relation: relation === "Other" ? otherRelation : relation })
  }

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={1} totalSteps={4} />
      <Text style={styles.title}>Who are you creating this profile for?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text>{relation || "Select relation"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(value) => setRelation(value)}
        options={[
          { label: "Daughter", value: "Daughter" },
          { label: "Son", value: "Son" },
          { label: "Brother", value: "Brother" },
          { label: "Sister", value: "Sister" },
          { label: "Relative", value: "Relative" },
          { label: "Other", value: "Other" },
        ]}
        selectedValue={relation}
      />
      {relation === "Other" && (
        <TextInput
          style={styles.input}
          placeholder="Please specify"
          value={otherRelation}
          onChangeText={setOtherRelation}
        />
      )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
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
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

