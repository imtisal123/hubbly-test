"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"

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
  "Kohistani",
  "Torwali",
  "Hazara",
  "Burusho",
  "Wakhi",
  "Kalash",
  "Siddi",
  "Uzbek",
  "Nuristani",
  "Pamiri",
  "Meo",
  "Gujjar",
  "Rajput",
  "Jat",
  "Awan",
  "Syed",
  "Memon",
  "Bengali",
  "Rohingya",
  "Makrani",
  "Kohli",
  "Bheel",
  "Marwari",
  "Lohar",
  "Gondal",
  "Khosa",
  "Leghari",
  "Marri",
  "Bugti",
  "Mazari",
  "Afridi",
  "Yousafzai",
  "Khattak",
  "Wazir",
  "Mahsud",
  "Shinwari",
  "Turi",
  "Bangash",
  "Orakzai",
  "Kakar",
  "Luni",
  "Achakzai",
  "Zarkun",
  "Mengal",
  "Zehri",
  "Rind",
  "Domki",
  "Jamali",
  "Lashari",
  "Gichki",
  "Bizenjo",
  "Magsi",
  "Jatoi",
  "Talpur",
  "Chandio",
  "Bhutto",
  "Soomro",
  "Junejo",
  "Maher",
  "Abbasi",
  "Khan",
  "Malik",
  "Sheikh",
  "Qureshi",
  "Ansari",
  "Chaudhry",
]

export default function ProfileEthnicityScreen() {
  const route = useRoute()
  const { name, dateOfBirth: dateOfBirthString, gender } = route.params
  const dateOfBirth = new Date(dateOfBirthString) // Convert string back to Date object if needed
  const [ethnicity, setEthnicity] = useState("")
  const [filteredEthnicities, setFilteredEthnicities] = useState([])
  const navigation = useNavigation()

  useEffect(() => {
    if (ethnicity) {
      const filtered = ethnicities.filter((item) => item.toLowerCase().includes(ethnicity.toLowerCase()))
      setFilteredEthnicities(filtered)
    } else {
      setFilteredEthnicities([])
    }
  }, [ethnicity])

  const handleSubmit = () => {
    navigation.navigate("Education", {
      ...route.params,
      ethnicity,
    })
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={5} totalSteps={gender === "male" ? 11 : 10} />
      <Text style={styles.title}>What is {name}'s ethnicity?</Text>
      <TextInput
        style={styles.input}
        value={ethnicity}
        onChangeText={setEthnicity}
        placeholder="Start typing ethnicity"
      />
      {filteredEthnicities.length > 0 && (
        <FlatList
          data={filteredEthnicities}
          keyExtractor={(item) => item}
          style={styles.autocompleteList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.autocompleteItem} onPress={() => setEthnicity(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.primaryDark,
  },
  input: {
    height: 40,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: theme.textLight,
  },
  autocompleteList: {
    maxHeight: 200,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

