"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import PickerModal from "../components/PickerModal"
import ProgressBar from "../components/ProgressBar"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"

export default function ProfileDetailsScreen2() {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, dateOfBirth: dateOfBirthString, gender } = route.params
  const dateOfBirth = new Date(dateOfBirthString)
  const [maritalStatus, setMaritalStatus] = useState("")
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false)
  const [hasChildren, setHasChildren] = useState("")
  const [showChildrenPicker, setShowChildrenPicker] = useState(false)
  const [numberOfChildren, setNumberOfChildren] = useState("")
  const [showNumberOfChildrenPicker, setShowNumberOfChildrenPicker] = useState(false)
  const [religion, setReligion] = useState("")
  const [showReligionPicker, setShowReligionPicker] = useState(false)
  const [islamicSect, setIslamicSect] = useState("")
  const [showIslamicSectPicker, setShowIslamicSectPicker] = useState(false)
  const [otherSect, setOtherSect] = useState("")
  const [coverHead, setCoverHead] = useState("")
  const [showCoverHeadPicker, setShowCoverHeadPicker] = useState(false)
  const [coverHeadType, setCoverHeadType] = useState("")
  const [showCoverHeadTypePicker, setShowCoverHeadTypePicker] = useState(false)

  const handleSubmit = () => {
    const profileData = {
      ...route.params,
      dateOfBirth: dateOfBirthString,
      maritalStatus,
      hasChildren,
      numberOfChildren,
      religion,
      islamicSect,
      otherSect,
    }

    if (religion === "Islam" && route.params.gender === "female") {
      profileData.coverHead = coverHead
      if (coverHead === "yes") {
        profileData.coverHeadType = coverHeadType
      }
    }

    navigation.navigate("ProfileEthnicity", profileData)
  }

  const generateNumberOfChildrenOptions = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }))
  }

  console.log("Current state:", { religion, gender: route.params.gender, coverHead })

  console.log("Debug: ", { religion, gender: route.params.gender, name })

  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={4} totalSteps={gender === "male" ? 11 : 10} />
        <Text style={styles.title}>More about {name}</Text>

        <Text style={styles.label}>What is {name}'s marital status?</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowMaritalStatusPicker(true)}>
          <Text>{maritalStatus || "Select marital status"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showMaritalStatusPicker}
          onClose={() => setShowMaritalStatusPicker(false)}
          onSelect={(value) =>
            setMaritalStatus(
              value
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            )
          }
          options={[
            { label: "Never Married", value: "never_married" },
            { label: "Divorced", value: "divorced" },
            { label: "Widowed", value: "widowed" },
          ]}
          selectedValue={maritalStatus}
        />

        {(maritalStatus === "Divorced" || maritalStatus === "Widowed") && (
          <>
            <Text style={styles.label}>Does {name} have any children?</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowChildrenPicker(true)}>
              <Text>{hasChildren || "Select option"}</Text>
            </TouchableOpacity>
            <PickerModal
              visible={showChildrenPicker}
              onClose={() => setShowChildrenPicker(false)}
              onSelect={(value) => setHasChildren(value.charAt(0).toUpperCase() + value.slice(1))}
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              selectedValue={hasChildren}
            />

            {hasChildren === "Yes" && (
              <>
                <Text style={styles.label}>How many children does {name} have?</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowNumberOfChildrenPicker(true)}>
                  <Text>{numberOfChildren || "Select number of children"}</Text>
                </TouchableOpacity>
                <PickerModal
                  visible={showNumberOfChildrenPicker}
                  onClose={() => setShowNumberOfChildrenPicker(false)}
                  onSelect={(value) => setNumberOfChildren(value)}
                  options={generateNumberOfChildrenOptions()}
                  selectedValue={numberOfChildren}
                />
              </>
            )}
          </>
        )}

        <Text style={styles.label}>What is {name}'s religion?</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowReligionPicker(true)}>
          <Text>{religion || "Select religion"}</Text>
        </TouchableOpacity>
        <PickerModal
          visible={showReligionPicker}
          onClose={() => setShowReligionPicker(false)}
          onSelect={(value) => {
            setReligion(value)
            setCoverHead("")
            setCoverHeadType("")
          }}
          options={[
            { label: "Islam", value: "Islam" },
            { label: "Christianity", value: "Christianity" },
            { label: "Hinduism", value: "Hinduism" },
          ]}
          selectedValue={religion}
        />

        {religion === "Islam" && (
          <>
            <Text style={styles.label}>What is {name}'s Islamic sect?</Text>
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
              <>
                <Text style={styles.label}>Please specify:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter other Islamic sect"
                  value={otherSect}
                  onChangeText={setOtherSect}
                />
              </>
            )}

            {/* Check if the religion is Islam and the gender is female (case-insensitive) */}
            {religion === "Islam" && route.params.gender.toLowerCase() === "female" && (
              <>
                <Text style={styles.label}>Does {name} cover her head?</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowCoverHeadPicker(true)}>
                  <Text>{coverHead || "Select option"}</Text>
                </TouchableOpacity>
                <PickerModal
                  visible={showCoverHeadPicker}
                  onClose={() => setShowCoverHeadPicker(false)}
                  onSelect={(value) => setCoverHead(value)}
                  options={[
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ]}
                  selectedValue={coverHead}
                />
                {coverHead === "Yes" && (
                  <>
                    <Text style={styles.label}>Please specify:</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowCoverHeadTypePicker(true)}>
                      <Text>
                        {coverHeadType
                          ? coverHeadType === "dupatta"
                            ? "With a dupatta"
                            : "With an aabaya/hijaab"
                          : "Select option"}
                      </Text>
                    </TouchableOpacity>
                    <PickerModal
                      visible={showCoverHeadTypePicker}
                      onClose={() => setShowCoverHeadTypePicker(false)}
                      onSelect={(value) => setCoverHeadType(value)}
                      options={[
                        { label: "With a dupatta", value: "dupatta" },
                        { label: "With an aabaya/hijaab", value: "aabaya_hijaab" },
                      ]}
                      selectedValue={coverHeadType}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    flexGrow: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
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
    marginTop: 20,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

