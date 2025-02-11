"use client"

import { useState } from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native"
import PickerModal from "../components/PickerModal"
import ProgressBar from "../components/ProgressBar"
import { theme } from "../styles/theme"

export default function ProfileDetailsScreen2({ route }) {
  const { name } = route.params
  const [maritalStatus, setMaritalStatus] = useState("")
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)
  const [hasChildren, setHasChildren] = useState("")
  const [showChildrenPicker, setShowChildrenPicker] = useState(false)
  const [religion, setReligion] = useState("")
  const [showReligionPicker, setShowReligionPicker] = useState(false)
  const [islamicSect, setIslamicSect] = useState("")
  const [showIslamicSectPicker, setShowIslamicSectPicker] = useState(false)
  const [otherSect, setOtherSect] = useState("")

  const handleSubmit = () => {
    console.log("Profile details:", { ...route.params, maritalStatus, hasChildren, religion, islamicSect, otherSect })
  }

  return (
    <ScrollView style={styles.container}>
      <ProgressBar currentStep={4} totalSteps={4} />
      <Text style={styles.title}>More about {name}</Text>

      <Text style={styles.label}>What is {name}'s marital status?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
        <Text>{maritalStatus ? maritalStatus.replace("_", " ") : "Select marital status"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showMaritalStatusPicker}
        onClose={() => setShowMaritalStatusPicker(false)}
        onSelect={(value) => setMaritalStatus(value)}
        options={[
          { label: "Never Married", value: "never_married" },
          { label: "Divorced", value: "divorced" },
          { label: "Widowed", value: "widowed" },
        ]}
        selectedValue={maritalStatus}
      />

      {maritalStatus === "divorced" && (
        <>
          <Text style={styles.label}>Do you have any children?</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowChildrenPicker(true)}>
            <Text>{hasChildren || "Select option"}</Text>
          </TouchableOpacity>
          <PickerModal
            visible={showChildrenPicker}
            onClose={() => setShowChildrenPicker(false)}
            onSelect={(value) => setHasChildren(value)}
            options={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
            selectedValue={hasChildren}
          />
        </>
      )}

      <Text style={styles.label}>What is {name}'s religion?</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowReligionPicker(true)}>
        <Text>{religion || "Select religion"}</Text>
      </TouchableOpacity>
      <PickerModal
        visible={showReligionPicker}
        onClose={() => setShowReligionPicker(false)}
        onSelect={(value) => setReligion(value)}
        options={[
          { label: "Islam", value: "Islam" },
          { label: "Christianity", value: "Christianity" },
          { label: "Hinduism", value: "Hinduism" },
        ]}
        selectedValue={religion}
      />

      {religion === "Islam" && (
        <>
          <Text style={styles.label}>What is their Islamic sect?</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowIslamicSectPicker(true)}>
            <Text>{islamicSect || "Select Islamic sect"}</Text>
          </TouchableOpacity>
          <PickerModal
            visible={showIslamicSectPicker}
            onClose={() => setShowIslamicSectPicker(false)}
            onSelect={(value) => setIslamicSect(value)}
            options={[
              { label: "Sunni", value: "Sunni" },
              { label: "Shia", value: "Shia" },
              { label: "Other", value: "Other" },
            ]}
            selectedValue={islamicSect}
          />
          {islamicSect === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={otherSect}
              onChangeText={setOtherSect}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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

