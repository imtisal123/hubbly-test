import { View, Text, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import ProgressBar from "../components/ProgressBar"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AntDesign } from "@expo/vector-icons"

const FinalCongratsScreen = () => {
  const navigation = useNavigation()

  const handleFinish = () => {
    // Navigate to the next screen or main app screen
    // For now, we'll just go back to the login screen
    navigation.navigate("LoginSignup")
  }

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={3} />
      <AntDesign name="checkcircle" size={100} color={theme.primary} style={styles.icon} />
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>The profile is now complete</Text>
      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.primaryDark,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default FinalCongratsScreen

