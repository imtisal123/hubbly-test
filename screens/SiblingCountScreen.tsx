"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"

const SiblingCountScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [sisters, setSisters] = useState("")
  const [brothers, setBrothers] = useState("")

  const handleNext = () => {
    const totalSiblings = Number.parseInt(sisters) + Number.parseInt(brothers)
    if (totalSiblings > 0) {
      navigation.navigate("SiblingDetails1", {
        ...route.params,
        sisters: Number.parseInt(sisters) || 0,
        brothers: Number.parseInt(brothers) || 0,
        currentSibling: 1,
        totalSiblings,
      })
    } else {
      navigation.navigate("Congrats3", route.params)
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={1} totalSteps={7} />
      <Text style={styles.title}>{`How many siblings does ${name} have?`}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sisters:</Text>
        <TextInput
          style={styles.input}
          value={sisters}
          onChangeText={setSisters}
          keyboardType="numeric"
          placeholder="Enter number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Brothers:</Text>
        <TextInput
          style={styles.input}
          value={brothers}
          onChangeText={setBrothers}
          keyboardType="numeric"
          placeholder="Enter number"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SiblingCountScreen

