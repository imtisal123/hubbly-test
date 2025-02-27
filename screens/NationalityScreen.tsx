"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function NationalityScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [nationality, setNationality] = useState("")
  const [isDualNational, setIsDualNational] = useState("")
  const [dualNationalityCountry, setDualNationalityCountry] = useState("")
  const [isPRHolder, setIsPRHolder] = useState("")
  const [prCountry, setPRCountry] = useState("")
  const [showDualNationalPicker, setShowDualNationalPicker] = useState(false)
  const [showPRPicker, setShowPRPicker] = useState(false)

  const handleNext = () => {
    navigation.navigate("Education", {
      ...route.params,
      nationality,
      isDualNational,
      dualNationalityCountry,
      isPRHolder,
      prCountry,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={7} totalSteps={13} />
        <Text style={styles.title}>Nationality Details for {name}</Text>

        <Text style={styles.label}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={nationality}
          onChangeText={setNationality}
          placeholder="Enter nationality"
          placeholderTextColor={theme.textLight}
        />

        <Text style={styles.label}>Is {name} a dual national?</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDualNationalPicker(true)}>
          <Text>{isDualNational || "Select option"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showDualNationalPicker}
          onClose={() => setShowDualNationalPicker(false)}
          onSelect={(value) => setIsDualNational(value)}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={isDualNational}
        />

        {isDualNational === "Yes" && (
          <>
            <Text style={styles.label}>Which country is {name} a dual national of?</Text>
            <TextInput
              style={styles.input}
              value={dualNationalityCountry}
              onChangeText={setDualNationalityCountry}
              placeholder="Enter country name"
              placeholderTextColor={theme.textLight}
            />
          </>
        )}

        <Text style={styles.label}>PR/Greencard holder</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPRPicker(true)}>
          <Text>{isPRHolder || "Select option"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showPRPicker}
          onClose={() => setShowPRPicker(false)}
          onSelect={(value) => setIsPRHolder(value)}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={isPRHolder}
        />

        {isPRHolder === "Yes" && (
          <>
            <Text style={styles.label}>Which country is {name} a PR/Greencard holder of?</Text>
            <TextInput
              style={styles.input}
              value={prCountry}
              onChangeText={setPRCountry}
              placeholder="Enter country name"
              placeholderTextColor={theme.textLight}
            />
          </>
        )}

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
    marginBottom: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

