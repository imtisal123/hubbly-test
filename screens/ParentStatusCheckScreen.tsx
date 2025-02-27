import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { theme } from "../styles/theme"
import BackButton from "../components/BackButton"
import ProgressBar from "../components/ProgressBar"

const ParentStatusCheckScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name } = route.params

  const [motherAlive, setMotherAlive] = useState<boolean | null>(null)
  const [fatherAlive, setFatherAlive] = useState<boolean | null>(null)

  const handleNext = () => {
    if (motherAlive === null || fatherAlive === null) {
      alert("Please answer both questions before proceeding.")
      return
    }

    if (!motherAlive && !fatherAlive) {
      navigation.navigate("Congrats2", {
        ...route.params,
        motherAlive,
        fatherAlive,
      })
    } else if (motherAlive) {
      navigation.navigate("MotherDetails", {
        ...route.params,
        motherAlive,
        fatherAlive,
      })
    } else {
      navigation.navigate("FatherDetails", {
        ...route.params,
        motherAlive,
        fatherAlive,
      })
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ProgressBar currentStep={1} totalSteps={5} /> {/* Adjust total steps as needed */}
      <Text style={styles.title}>Parent Status Check</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{`Is ${name}'s mother still alive?`}</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, motherAlive === true && styles.selectedOption]}
            onPress={() => setMotherAlive(true)}
          >
            <Text style={[styles.optionText, motherAlive === true && styles.selectedOptionText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, motherAlive === false && styles.selectedOption]}
            onPress={() => setMotherAlive(false)}
          >
            <Text style={[styles.optionText, motherAlive === false && styles.selectedOptionText]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{`Is ${name}'s father still alive?`}</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, fatherAlive === true && styles.selectedOption]}
            onPress={() => setFatherAlive(true)}
          >
            <Text style={[styles.optionText, fatherAlive === true && styles.selectedOptionText]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, fatherAlive === false && styles.selectedOption]}
            onPress={() => setFatherAlive(false)}
          >
            <Text style={[styles.optionText, fatherAlive === false && styles.selectedOptionText]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    textAlign: "center",
    marginVertical: 20,
  },
  questionContainer: {
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  option: {
    backgroundColor: theme.textLight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedOption: {
    backgroundColor: theme.primary,
  },
  optionText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedOptionText: {
    color: theme.textLight,
  },
  nextButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: theme.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default ParentStatusCheckScreen

