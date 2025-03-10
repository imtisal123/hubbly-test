import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";
import { useProfile } from "../contexts/ProfileContext";



const ParentStatusCheckScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { name } = route.params
  const { dispatch } = useProfile()

  const [motherAlive, setMotherAlive] = useState<boolean | null>(null)
  const [fatherAlive, setFatherAlive] = useState<boolean | null>(null)

  // Initialize profile data in context when component mounts
  useEffect(() => {
    if (route.params) {
      console.log('Updating ProfileContext from ParentStatusCheckScreen:', JSON.stringify(route.params, null, 2));
      dispatch({ type: 'NORMALIZE_PROFILE', payload: route.params });
    }
  }, []);

  const handleNext = () => {
    if (motherAlive === null || fatherAlive === null) {
      alert("Please answer both questions before proceeding.")
      return
    }
    
    // Create updated profile data
    const profileData = {
      ...route.params,
      motherAlive,
      fatherAlive,
    };
    
    // Update the profile context with the parent status data
    console.log('Updating ProfileContext with parent status:', JSON.stringify(profileData, null, 2));
    dispatch({ type: 'NORMALIZE_PROFILE', payload: profileData });

    if (!motherAlive && !fatherAlive) {
      // If both parents are not alive, we still need to save this information
      // before skipping to the next screen
      navigation.navigate("Congrats2", profileData)
    } else if (motherAlive) {
      navigation.navigate("MotherDetails", profileData)
    } else {
      navigation.navigate("FatherDetails", profileData)
    }
  };
    


  
  
return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={1} totalSteps={7} />
        <Text style={styles.title}>Parent Status Check</Text>
        
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Is {name}'s father alive?</Text>
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
        
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Is {name}'s mother alive?</Text>
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
        
        <TouchableOpacity 
          style={[styles.button, (motherAlive === null || fatherAlive === null) && styles.buttonDisabled]} 
          onPress={handleNext}
          disabled={motherAlive === null || fatherAlive === null}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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
    borderColor: theme.primary,
  },
  optionText: {
    fontSize: 16,
    color: theme.text,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "bold",
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
    backgroundColor: theme.text,
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default ParentStatusCheckScreen