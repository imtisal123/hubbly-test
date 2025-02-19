import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"

export default function PlaceholderScreen() {
  const navigation = useNavigation()

  const handleNext = () => {
    navigation.navigate("ProfileCreation")
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Placeholder Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    paddingTop: 100, // Add padding to accommodate the back button
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.primaryDark,
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
  },
})

