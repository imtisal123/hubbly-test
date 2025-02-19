"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

export default function HomeScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [livingArrangement, setLivingArrangement] = useState("")
  const [homeOwnership, setHomeOwnership] = useState("")
  const [showLivingArrangementPicker, setShowLivingArrangementPicker] = useState(false)
  const [showHomeOwnershipPicker, setShowHomeOwnershipPicker] = useState(false)

  const handleSubmit = () => {
    navigation.navigate("Other", {
      ...route.params,
      livingArrangement,
      homeOwnership,
    })
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={9} totalSteps={10} />
      <Text style={styles.title}>Home Details for {name}</Text>

      <Text style={styles.label}>What is {name}'s living arrangement?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowLivingArrangementPicker(true)}>
        <Text>{livingArrangement || "Select living arrangement"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showLivingArrangementPicker}
        onClose={() => setShowLivingArrangementPicker(false)}
        onSelect={(value) => setLivingArrangement(value)}
        options={[
          { label: "Joint family system", value: "Joint family system" },
          { label: "Will be living separately from extended family", value: "Separate from extended family" },
        ]}
        selectedValue={livingArrangement}
      />

      <Text style={styles.label}>What is {name}'s home ownership status?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowHomeOwnershipPicker(true)}>
        <Text>{homeOwnership || "Select home ownership status"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showHomeOwnershipPicker}
        onClose={() => setShowHomeOwnershipPicker(false)}
        onSelect={(value) => setHomeOwnership(value)}
        options={[
          { label: "Rent", value: "Rent" },
          { label: "Own", value: "Own" },
        ]}
        selectedValue={homeOwnership}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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

