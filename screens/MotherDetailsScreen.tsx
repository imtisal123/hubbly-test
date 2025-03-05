"use client"

import { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import PickerModal from "../components/PickerModal";


const MotherDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, fatherMaritalStatus, fatherCityOfResidence, fatherAreaOfResidence, motherAlive, fatherAlive } =
    route.params

  const [maritalStatus, setMaritalStatus] = useState(fatherMaritalStatus === "Married" ? fatherMaritalStatus : "")
  const [cityOfResidence, setCityOfResidence] = useState(fatherMaritalStatus === "Married" ? fatherCityOfResidence : "")
  const [areaOfResidence, setAreaOfResidence] = useState(fatherMaritalStatus === "Married" ? fatherAreaOfResidence : "")
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)

  const handleNext = () => {
    if (!maritalStatus || !cityOfResidence) {
      alert("Please fill in all required fields.")
      return
    }

    navigation.navigate("MotherAdditionalInfo", {
      ...route.params,
      motherMaritalStatus: maritalStatus,
      motherCityOfResidence: cityOfResidence,
      motherAreaOfResidence: areaOfResidence,
    })
  }

  if (!route.params.motherAlive) {
    return (
      <View style={styles.container}>
        <BackButton style={styles.backButton} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ProgressBar currentStep={4} totalSteps={7} />
          <Text style={styles.title}>Mother's Details</Text>
          <Text style={styles.message}>You indicated that your mother is not alive. We're sorry for your loss.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("MotherAdditionalInfo", {
                ...route.params,
                motherMaritalStatus: "Deceased",
                motherCityOfResidence: "N/A",
                motherAreaOfResidence: "N/A",
              })
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={4} totalSteps={7} />
        <Text style={styles.title}>Mother's Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Marital Status</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowMaritalStatusPicker(true)}
          >
            <Text style={maritalStatus ? styles.inputText : styles.placeholderText}>
              {maritalStatus || "Select marital status"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City of Residence</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={cityOfResidence}
            onChangeText={setCityOfResidence}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Area of Residence (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area"
            value={areaOfResidence}
            onChangeText={setAreaOfResidence}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button,
            (!maritalStatus || !cityOfResidence) && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={!maritalStatus || !cityOfResidence}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        
        <PickerModal
          visible={showMaritalStatusPicker}
          onClose={() => setShowMaritalStatusPicker(false)}
          onSelect={(value) => setMaritalStatus(value)}
          options={[
            { label: "Single", value: "Single" },
            { label: "Married", value: "Married" },
            { label: "Divorced", value: "Divorced" },
            { label: "Widowed", value: "Widowed" },
          ]}
          selectedValue={maritalStatus}
        />
      </ScrollView>
    </View>
  );
};

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
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: theme.textDark,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
    justifyContent: "center",
  },
  inputText: {
    color: theme.textDark,
  },
  placeholderText: {
    color: theme.textMedium,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: theme.border,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: theme.text,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default MotherDetailsScreen;
