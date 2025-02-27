"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function LocationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, gender } = route.params

  const [homeTown, setHomeTown] = useState("")
  const [currentCity, setCurrentCity] = useState("")
  const [openToMovingCity, setOpenToMovingCity] = useState("")
  const [openToMovingCountry, setOpenToMovingCountry] = useState("")
  const [showMovingCityPicker, setShowMovingCityPicker] = useState(false)
  const [showMovingCountryPicker, setShowMovingCountryPicker] = useState(false)

  const handleNext = () => {
    navigation.navigate("Nationality", {
      ...route.params,
      homeTown,
      currentCity,
      openToMovingCity,
      openToMovingCountry,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={6} totalSteps={13} />
        <Text style={styles.title}>Location Details for {name}</Text>

        <Text style={styles.label}>Home town (Where {name} grew up)</Text>
        <TextInput
          style={styles.input}
          value={homeTown}
          onChangeText={setHomeTown}
          placeholder={`Enter home town`}
          placeholderTextColor={theme.textLight}
        />

        <Text style={styles.label}>Current city of residence</Text>
        <TextInput
          style={styles.input}
          value={currentCity}
          onChangeText={setCurrentCity}
          placeholder={`Where does ${name} currently live?`}
          placeholderTextColor={theme.textLight}
        />

        <Text style={styles.label}>Open to moving city after marriage?</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowMovingCityPicker(true)}>
          <Text>{openToMovingCity || "Select option"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showMovingCityPicker}
          onClose={() => setShowMovingCityPicker(false)}
          onSelect={(value) => setOpenToMovingCity(value)}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={openToMovingCity}
        />

        <Text style={styles.label}>Open to moving country after marriage?</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowMovingCountryPicker(true)}>
          <Text>{openToMovingCountry || "Select option"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showMovingCountryPicker}
          onClose={() => setShowMovingCountryPicker(false)}
          onSelect={(value) => setOpenToMovingCountry(value)}
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
          selectedValue={openToMovingCountry}
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

