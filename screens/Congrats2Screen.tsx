import { View, Text, StyleSheet, TouchableOpacity , ScrollView} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { theme } from "../styles/theme";
import { Feather } from "@expo/vector-icons";



const Congrats2Screen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params
    
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.congratsText}>🎉 Congratulations on completing {name}'s parent's profile! 🎊</Text>
        <Text style={styles.instructionText}>Now please fill in a few more questions about {name}'s siblings.</Text>
        <View style={styles.iconContainer}>
          <Feather name="award" size={50} color={theme.primary} />
          <Feather name="smile" size={50} color={theme.primary} />
          <Feather name="star" size={50} color={theme.primary} />
        </View>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("SiblingCount", route.params)}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
    justifyContent: "space-around",
    marginBottom: 40,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default Congrats2Screen