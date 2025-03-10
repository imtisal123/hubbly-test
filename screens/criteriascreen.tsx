import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from "react-native"
import { useAuth } from "../contexts/AuthContext"
import { useProfile } from "../contexts/ProfileContext"
import PickerModal from "../components/PickerModal"
import { saveProfile } from "../lib/demoData"

export default function CriteriaScreen() {
  const { profile: authProfile, user, refreshProfile } = useAuth()
  const { state: profileState } = useProfile()
  
  // Combine profile data from different sources
  const profile = { ...(authProfile || {}), ...(profileState || {}) }
  const matchPreferences = profile?.matchPreferences || {}
  
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false)
  
  // State for match preferences
  const [ageRange, setAgeRange] = useState(`${matchPreferences.minAge || 18}-${matchPreferences.maxAge || 45}`)
  const [heightRange, setHeightRange] = useState(matchPreferences.heightRange || "Any")
  const [educationPref, setEducationPref] = useState(matchPreferences.minEducation || "Any")
  const [religionPref, setReligionPref] = useState(matchPreferences.religion || "Any")
  const [ethnicityPref, setEthnicityPref] = useState(matchPreferences.ethnicity || "Any")
  
  // State for picker modals
  const [showAgeRangePicker, setShowAgeRangePicker] = useState(false)
  const [showHeightRangePicker, setShowHeightRangePicker] = useState(false)
  const [showEducationPicker, setShowEducationPicker] = useState(false)
  const [showReligionPicker, setShowReligionPicker] = useState(false)
  const [showEthnicityPicker, setShowEthnicityPicker] = useState(false)
  
  // Handle saving match preferences
  const handleSavePreferences = async () => {
    try {
      // Parse age range
      const [minAge, maxAge] = ageRange.split('-').map(age => parseInt(age.trim()))
      
      // Create updated match preferences
      const updatedMatchPreferences = {
        ...matchPreferences,
        minAge,
        maxAge,
        heightRange,
        minEducation: educationPref,
        religion: religionPref,
        ethnicity: ethnicityPref
      }
      
      // Create updated profile data
      const updatedProfile = {
        ...profile,
        matchPreferences: updatedMatchPreferences
      }
      
      // Save to database if user is authenticated
      if (user && user.id) {
        const { success, error } = await saveProfile(user.id, updatedProfile)
        
        if (success) {
          if (refreshProfile) {
            await refreshProfile()
          }
          Alert.alert("Success", "Your match preferences have been updated!")
        } else {
          console.error("Error saving match preferences:", error)
          Alert.alert("Error", error?.message || "There was an error saving your match preferences.")
        }
      } else {
        // Demo mode
        Alert.alert("Demo Mode", "Match preferences would be saved in production.")
      }
      
      // Exit editing mode
      setIsEditing(false)
    } catch (error) {
      console.error("Exception in handleSavePreferences:", error)
      Alert.alert("Error", "An unexpected error occurred.")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Match Criteria</Text>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Preferences</Text>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Age Range:</Text>
              {!isEditing ? (
                <Text style={styles.criteriaValue}>
                  {matchPreferences.minAge || "Any"} - {matchPreferences.maxAge || "Any"}
                </Text>
              ) : (
                <TouchableOpacity style={styles.editableValue} onPress={() => setShowAgeRangePicker(true)}>
                  <Text style={styles.editableText}>{ageRange || "Select age range"}</Text>
                </TouchableOpacity>
              )}
              <PickerModal
                visible={showAgeRangePicker}
                onClose={() => setShowAgeRangePicker(false)}
                onSelect={(value) => setAgeRange(value)}
                options={[
                  { label: "18-25", value: "18-25" },
                  { label: "25-30", value: "25-30" },
                  { label: "30-35", value: "30-35" },
                  { label: "35-40", value: "35-40" },
                  { label: "40-45", value: "40-45" },
                  { label: "45-50", value: "45-50" },
                  { label: "50+", value: "50+" },
                ]}
                selectedValue={ageRange}
              />
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Height Range:</Text>
              {!isEditing ? (
                <Text style={styles.criteriaValue}>
                  {formatHeight(matchPreferences.minHeight)} - {formatHeight(matchPreferences.maxHeight)}
                </Text>
              ) : (
                <TouchableOpacity style={styles.editableValue} onPress={() => setShowHeightRangePicker(true)}>
                  <Text style={styles.editableText}>{heightRange || "Select height range"}</Text>
                </TouchableOpacity>
              )}
              <PickerModal
                visible={showHeightRangePicker}
                onClose={() => setShowHeightRangePicker(false)}
                onSelect={(value) => setHeightRange(value)}
                options={[
                  { label: "5'0\" - 5'4\"", value: "5'0\" - 5'4\"" },
                  { label: "5'4\" - 5'8\"", value: "5'4\" - 5'8\"" },
                  { label: "5'8\" - 6'0\"", value: "5'8\" - 6'0\"" },
                  { label: "6'0\" - 6'4\"", value: "6'0\" - 6'4\"" },
                  { label: "6'4\"+", value: "6'4\"+" },
                ]}
                selectedValue={heightRange}
              />
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Marital Status:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.maritalStatus || "Any"}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background</Text>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Religion:</Text>
              {!isEditing ? (
                <Text style={styles.criteriaValue}>{matchPreferences.religion || "Any"}</Text>
              ) : (
                <TouchableOpacity style={styles.editableValue} onPress={() => setShowReligionPicker(true)}>
                  <Text style={styles.editableText}>{religionPref || "Select religion preference"}</Text>
                </TouchableOpacity>
              )}
              <PickerModal
                visible={showReligionPicker}
                onClose={() => setShowReligionPicker(false)}
                onSelect={(value) => setReligionPref(value)}
                options={[
                  { label: "Any", value: "Any" },
                  { label: "Islam", value: "Islam" },
                  { label: "Christianity", value: "Christianity" },
                  { label: "Judaism", value: "Judaism" },
                  { label: "Hinduism", value: "Hinduism" },
                  { label: "Buddhism", value: "Buddhism" },
                  { label: "Sikhism", value: "Sikhism" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={religionPref}
              />
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Sect:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.sect || "Any"}</Text>
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Ethnicity:</Text>
              {!isEditing ? (
                <Text style={styles.criteriaValue}>{matchPreferences.ethnicity || "Any"}</Text>
              ) : (
                <TouchableOpacity style={styles.editableValue} onPress={() => setShowEthnicityPicker(true)}>
                  <Text style={styles.editableText}>{ethnicityPref || "Select ethnicity preference"}</Text>
                </TouchableOpacity>
              )}
              <PickerModal
                visible={showEthnicityPicker}
                onClose={() => setShowEthnicityPicker(false)}
                onSelect={(value) => setEthnicityPref(value)}
                options={[
                  { label: "Any", value: "Any" },
                  { label: "South Asian", value: "South Asian" },
                  { label: "Middle Eastern", value: "Middle Eastern" },
                  { label: "East Asian", value: "East Asian" },
                  { label: "African", value: "African" },
                  { label: "European", value: "European" },
                  { label: "Hispanic/Latino", value: "Hispanic/Latino" },
                  { label: "Mixed", value: "Mixed" },
                  { label: "Other", value: "Other" },
                ]}
                selectedValue={ethnicityPref}
              />
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Nationality:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.nationality || "Any"}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Career</Text>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Minimum Education:</Text>
              {!isEditing ? (
                <Text style={styles.criteriaValue}>{matchPreferences.minEducation || "Any"}</Text>
              ) : (
                <TouchableOpacity style={styles.editableValue} onPress={() => setShowEducationPicker(true)}>
                  <Text style={styles.editableText}>{educationPref || "Select education preference"}</Text>
                </TouchableOpacity>
              )}
              <PickerModal
                visible={showEducationPicker}
                onClose={() => setShowEducationPicker(false)}
                onSelect={(value) => setEducationPref(value)}
                options={[
                  { label: "Any", value: "Any" },
                  { label: "High School", value: "High School" },
                  { label: "Associate's Degree", value: "Associate's Degree" },
                  { label: "Bachelor's Degree", value: "Bachelor's Degree" },
                  { label: "Master's Degree", value: "Master's Degree" },
                  { label: "Doctorate", value: "Doctorate" },
                  { label: "Professional Degree", value: "Professional Degree" },
                ]}
                selectedValue={educationPref}
              />
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Profession:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.profession || "Any"}</Text>
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Minimum Income:</Text>
              <Text style={styles.criteriaValue}>
                {matchPreferences.minIncome ? `$${matchPreferences.minIncome}` : "Any"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>City:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.city || "Any"}</Text>
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Country:</Text>
              <Text style={styles.criteriaValue}>{matchPreferences.country || "Any"}</Text>
            </View>

            <View style={styles.criteriaItem}>
              <Text style={styles.criteriaLabel}>Willing to Relocate:</Text>
              <Text style={styles.criteriaValue}>
                {matchPreferences.willingToRelocate === true
                  ? "Yes"
                  : matchPreferences.willingToRelocate === false
                    ? "No"
                    : "Not specified"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

// Helper function to format height
function formatHeight(heightInInches) {
  if (!heightInInches) return "Any"

  const feet = Math.floor(heightInInches / 12)
  const inches = heightInInches % 12
  return `${feet}' ${inches}"`
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  editButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  criteriaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  criteriaLabel: {
    fontSize: 16,
    color: "#666",
  },
  criteriaValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  editableValue: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  editableText: {
    fontSize: 16,
    color: "#333",
  },
})

