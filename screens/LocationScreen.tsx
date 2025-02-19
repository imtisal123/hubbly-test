"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function LocationScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [nationality, setNationality] = useState("")
  const [homeTown, setHomeTown] = useState("")
  const [currentCity, setCurrentCity] = useState("")
  const [isPRHolder, setIsPRHolder] = useState("")
  const [openToMovingCity, setOpenToMovingCity] = useState("")
  const [openToMovingCountry, setOpenToMovingCountry] = useState("")
  const [showPRPicker, setShowPRPicker] = useState(false)
  const [showMovingCityPicker, setShowMovingCityPicker] = useState(false)
  const [showMovingCountryPicker, setShowMovingCountryPicker] = useState(false)

  const handleNext = () => {
    navigation.navigate("Career", {
      ...route.params,
      nationality,
      homeTown,
      currentCity,
      isPRHolder,
      openToMovingCity,
      openToMovingCountry,
    })
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={7} totalSteps={8} />
      <Text style={styles.title}>Location Details for {name}</Text>

      <Text style={styles.label}>Nationality</Text>
      <TextInput
        style={styles.input}
        value={nationality}
        onChangeText={setNationality}
        placeholder="Enter nationality"
      />

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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 100,
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
  input: {
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
    marginBottom: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

