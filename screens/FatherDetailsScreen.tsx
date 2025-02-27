"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, View } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"
import PickerModal from "../components/PickerModal"

const FatherDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [maritalStatus, setMaritalStatus] = useState("")
  const [cityOfResidence, setCityOfResidence] = useState("")
  const [areaOfResidence, setAreaOfResidence] = useState("")
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)

  if (!route.params.fatherAlive) {
    return (
      <View style={styles.container}>
        <BackButton />
        <ProgressBar currentStep={6} totalSteps={8} />
        <Text style={styles.title}>Father's Details</Text>
        <Text style={styles.message}>Father is not alive. Proceeding to next section.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NextScreenAfterParents", route.params)}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleNext = () => {
    if (!maritalStatus || !cityOfResidence) {
      alert("Please fill in all required fields.")
      return
    }

    navigation.navigate("FatherAdditionalInfo", {
      ...route.params,
      fatherMaritalStatus: maritalStatus,
      fatherCityOfResidence: cityOfResidence,
      fatherAreaOfResidence: areaOfResidence,
    })
  }

  return (
    <ScrollView style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={6} totalSteps={8} />
      <Text style={styles.title}>{`${name}'s Father's Details`}</Text>

      <Text style={styles.label}>Marital Status*</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
        <Text>{maritalStatus || "Select marital status"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showMaritalStatusPicker}
        onClose={() => setShowMaritalStatusPicker(false)}
        onSelect={(value) => setMaritalStatus(value)}
        options={[
          { label: "Married", value: "Married" },
          { label: "Divorced", value: "Divorced" },
          { label: "Separated", value: "Separated" },
          { label: "Widowed", value: "Widowed" },
        ]}
        selectedValue={maritalStatus}
      />

      <Text style={styles.label}>City of Residence*</Text>
      <TextInput
        style={styles.input}
        value={cityOfResidence}
        onChangeText={setCityOfResidence}
        placeholder="Enter city of residence"
      />

      <Text style={styles.label}>Area of Residence (Optional)</Text>
      <TextInput
        style={styles.input}
        value={areaOfResidence}
        onChangeText={setAreaOfResidence}
        placeholder="Enter area of residence"
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    textAlign: "center",
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    color: theme.text,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default FatherDetailsScreen

