import { View, Text, StyleSheet , ScrollView} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { theme } from "../styles/theme";
import ProgressBar from "../components/ProgressBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";



const Congrats3Screen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params
    
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={3} totalSteps={3} />
        <Text style={styles.congratsText}>🎉 Congratulations on completing {name}'s sibling's profile! 🎊</Text>
        <Text style={styles.instructionText}>You're almost done with the profile creation process.</Text>
        <View style={styles.iconContainer}>
          <Feather name="award" size={50} color={theme.primary} />
          <Feather name="smile" size={50} color={theme.primary} />
          <Feather name="star" size={50} color={theme.primary} />
        </View>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("FamilyDetails", route.params)}
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
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    marginBottom: 10,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default Congrats3Screen