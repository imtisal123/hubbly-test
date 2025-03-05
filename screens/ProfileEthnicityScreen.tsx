"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";

const ethnicities = [
  "Punjabi",
  "Pashtun",
  "Sindhi",
  "Saraiki",
  "Muhajir",
  "Baloch",
  "Hindkowan/Hazarewal",
  "Brahui",
  "Kashmiri",
  "Pahari",
  "Chitrali",
  "Shina",
  "Balti",
  "Burusho",
  "Wakhi",
  "Khowar",
  "Other"
];

export default function ProfileEthnicityScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, dateOfBirth, gender } = route.params;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEthnicity, setSelectedEthnicity] = useState("");
  const [showAllEthnicities, setShowAllEthnicities] = useState(false);
  
  const filteredEthnicities = searchQuery.length > 0 
    ? ethnicities.filter(ethnicity => 
        ethnicity.toLowerCase().includes(searchQuery.toLowerCase()))
    : showAllEthnicities ? ethnicities : [];
  
  const handleNext = () => {
    if (!selectedEthnicity) {
      alert("Please select your ethnicity");
      return;
    }
    
    navigation.navigate("Location", {
      ...route.params,
      ethnicity: selectedEthnicity
    });
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.ethnicityItem,
        selectedEthnicity === item && styles.selectedItem
      ]}
      onPress={() => setSelectedEthnicity(item)}
    >
      <Text
        style={[
          styles.ethnicityText,
          selectedEthnicity === item && styles.selectedText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={3} totalSteps={7} />
        <Text style={styles.title}>What is your ethnicity?</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search ethnicity..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <TouchableOpacity
          style={styles.showAllButton}
          onPress={() => setShowAllEthnicities(!showAllEthnicities)}
        >
          <Text style={styles.showAllText}>
            {showAllEthnicities ? "Hide all ethnicities" : "Show all ethnicities"}
          </Text>
        </TouchableOpacity>
        
        <FlatList
          data={filteredEthnicities}
          renderItem={renderItem}
          keyExtractor={item => item}
          style={styles.list}
          scrollEnabled={false}
        />
        
        <TouchableOpacity
          style={[styles.button, !selectedEthnicity && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedEthnicity}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
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
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  searchInput: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: theme.textLight,
  },
  list: {
    marginBottom: 20,
  },
  ethnicityItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectedItem: {
    backgroundColor: theme.primaryLight,
  },
  ethnicityText: {
    fontSize: 16,
    color: theme.textDark,
  },
  selectedText: {
    fontWeight: "bold",
    color: theme.primary,
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
  showAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  showAllText: {
    fontSize: 16,
    color: theme.textDark,
  },
});