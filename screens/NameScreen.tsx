"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"

export default function NameScreen({ route }) {
  const { relation } = route.params
  const [name, setName] = useState("")
  const navigation = useNavigation()

  const handleNext = () => {
    if (name.trim()) {
      navigation.navigate("ProfileDetails1", { relation, name })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is their name?</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  input: {
    width: "100%",
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
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})

