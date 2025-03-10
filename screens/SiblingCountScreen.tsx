"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import { useProfile } from "../contexts/ProfileContext";



const SiblingCountScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { name } = route.params
  const { dispatch } = useProfile()

  const [sisters, setSisters] = useState("")
  const [brothers, setBrothers] = useState("")
  
  // Initialize profile data in context when component mounts
  useEffect(() => {
    if (route.params) {
      console.log('Updating ProfileContext from SiblingCountScreen:', JSON.stringify(route.params, null, 2));
      dispatch({ type: 'NORMALIZE_PROFILE', payload: route.params });
    }
  }, []);

  const handleNext = () => {
    const sistersCount = Number.parseInt(sisters) || 0;
    const brothersCount = Number.parseInt(brothers) || 0;
    const totalSiblings = sistersCount + brothersCount;
    
    // Create updated profile data
    const profileData = {
      ...route.params,
      sisters: sistersCount,
      brothers: brothersCount,
      totalSiblings,
    };
    
    // Update the profile context with the sibling count data
    console.log('Updating ProfileContext with sibling count:', JSON.stringify(profileData, null, 2));
    dispatch({ type: 'NORMALIZE_PROFILE', payload: profileData });
    
    if (totalSiblings > 0) {
      navigation.navigate("SiblingDetails1", {
        ...profileData,
        currentSibling: 1,
      })
    } else {
      // Even if there are no siblings, we still save this information
      // before skipping to the next screen
      navigation.navigate("Congrats3", profileData)
    }
  };
    

  
return (
    <View style={styles.container}>
      <BackButton />
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