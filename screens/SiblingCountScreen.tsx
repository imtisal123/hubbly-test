"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";



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
  };
    

  
return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={1} totalSteps={7} />
        <Text style={styles.title}>Sibling Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>How many sisters does {name} have?</Text>
          <TextInput
            style={styles.input}
            value={sisters}
            onChangeText={setSisters}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.textLight}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>How many brothers does {name} have?</Text>
          <TextInput
            style={styles.input}
            value={brothers}
            onChangeText={setBrothers}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.textLight}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
        >
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
    paddingBottom: 40,
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
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default SiblingCountScreen