"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"

export default function OtherScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [additionalInfo, setAdditionalInfo] = useState("")

  const handleNext = () => {
    navigation.navigate("Congrats1", {
      ...route.params,
      additionalInfo,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={gender === "male" ? 10 : 9} totalSteps={gender === "male" ? 11 : 10} />
        <Text style={styles.title}>Additional Information</Text>

        <Text style={styles.label}>
          Is there anything else you would like to share about {name} e.g. Hobbies/Interests:
        </Text>
        <TextInput
          style={styles.textArea}
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          placeholder="Enter additional information"
          multiline
          numberOfLines={4}
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
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.text,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  textArea: {
    height: 120,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: "top",
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

