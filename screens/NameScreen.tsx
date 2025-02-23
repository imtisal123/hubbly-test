"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"

const NameScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { relation, gender } = route.params
  const [name, setName] = useState("")

  const handleNext = () => {
    if (name.trim() === "") {
      Alert.alert("Error", "Please enter a name before proceeding.")
    } else {
      navigation.navigate("ProfileDetails1", { relation, name, gender })
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={2} totalSteps={gender.toLowerCase() === "male" ? 11 : 10} />
      <Text style={styles.title}>{`What is your ${relation}'s name?`}</Text>
      <TextInput style={styles.input} placeholder="Enter name" value={name} onChangeText={setName} />
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
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default NameScreen

