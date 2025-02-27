import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import { Feather } from "@expo/vector-icons"

const Congrats2Screen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  return (
    <View style={styles.container}>
      <Text style={styles.congratsText}>🎉 Congratulations on completing {name}'s parent's profile! 🎊</Text>
      <Text style={styles.instructionText}>Now please fill in a few more questions about {name}'s siblings.</Text>
      <View style={styles.iconContainer}>
        <Feather name="award" size={50} color={theme.primary} />
        <Feather name="smile" size={50} color={theme.primary} />
        <Feather name="star" size={50} color={theme.primary} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SiblingCount", { name })}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
    padding: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: theme.primaryDark,
  },
  instructionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: theme.text,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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

export default Congrats2Screen

