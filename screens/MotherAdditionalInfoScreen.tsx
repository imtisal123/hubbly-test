"use client"

import { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";

const MotherAdditionalInfoScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [profession, setProfession] = useState("")
  const [education, setEducation] = useState("")
  const [showEducationPicker, setShowEducationPicker] = useState(false)

  const handleNext = () => {
    if (!profession || !education) {
      alert("Please fill in all fields.")
      return
    }

    navigation.navigate("MotherProfilePicUpload", {
      ...route.params,
      motherProfession: profession,
      motherEducation: education,
    })
  };
    



  
return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <BackButton style={styles.backButton} />
      <ProgressBar currentStep={4} totalSteps={5} />
      <Text style={styles.title}>{`${name}'s Mother's Additional Info`}</Text>

      <Text style={styles.label}>Profession</Text>
      <TextInput style={styles.input} value={profession} onChangeText={setProfession} placeholder="Enter profession" />

      <Text style={styles.label}>Highest Level of Education</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowEducationPicker(true)}>
        <Text>{education || "Select education level"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showEducationPicker}
        onClose={() => setShowEducationPicker(false)}
        onSelect={(value) => setEducation(value)}
        options={[
          { label: "High School", value: "High School" },
          { label: "Bachelors", value: "Bachelors" },
          { label: "Masters", value: "Masters" },
          { label: "PHD", value: "PHD" },
          { label: "MBBS", value: "MBBS" },
        ]}
        selectedValue={education}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    textAlign: "center",
    marginVertical: 20,
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

export default MotherAdditionalInfoScreen

