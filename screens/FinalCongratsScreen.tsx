import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import { theme } from "../styles/theme";
import ProgressBar from "../components/ProgressBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { supabase } from "../lib/supabaseClient";

// Import the profile saving functions
const { saveDemoProfile, saveRegularProfile } = require('../lib/demoData');



const FinalCongratsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [isSaving, setIsSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  // Check if the user is authenticated and if they're an admin
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session, the user is authenticated (admin or regular)
        if (session) {
          setIsAdmin(true);
          setIsDemo(false);
        } else {
          // No session means we're in demo mode
          setIsAdmin(false);
          setIsDemo(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Default to demo if there's an error
        setIsAdmin(false);
        setIsDemo(true);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Function to reset navigation and go to login screen
  const resetToLogin = () => {
    // First try to navigate to the root
    try {
      // Reset to the root navigator
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'index' }],
        })
      );
    } catch (error) {
      console.error("Navigation reset error:", error);
      // Fallback: try to go back to the beginning
      try {
        navigation.popToTop();
      } catch (e) {
        console.error("popToTop error:", e);
      }
    }
  };

  const handleFinish = async () => {
    try {
      // Show saving indicator
      setIsSaving(true)
      
      // Get all profile data from route params
      const profileData = route.params || {}
      
      // Save the profile data to Supabase using the appropriate function
      // If admin, save to regular tables, otherwise save to demo tables
      const { data, error } = isAdmin 
        ? await saveRegularProfile(profileData)
        : await saveDemoProfile(profileData);
      
      if (error) {
        console.error("Error saving profile:", error)
        Alert.alert(
          "Error Saving Profile",
          `There was an error saving your profile. ${isAdmin ? 'Your profile was not saved.' : 'Your profile was created in demo mode but not saved to the database.'}`,
          [{ text: "OK", onPress: resetToLogin }]
        )
        return
      }
      
      // Success message
      Alert.alert(
        "Profile Saved",
        `Your profile has been successfully saved to the ${isAdmin ? 'regular' : 'demo'} database!`,
        [{ text: "OK", onPress: resetToLogin }]
      )
    } catch (error) {
      console.error("Error in handleFinish:", error)
      Alert.alert(
        "Error",
        "An unexpected error occurred.",
        [{ text: "OK", onPress: resetToLogin }]
      )
    } finally {
      setIsSaving(false)
    }
  };
    


  
  
return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={13} totalSteps={13} />
        <Text style={styles.title}>Congratulations! 🎉</Text>
        <Text style={styles.subtitle}>You've completed the profile creation process.</Text>
        
        <View style={styles.iconContainer}>
          <AntDesign name="checkcircle" size={60} color={theme.success} />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleFinish}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Saving..." : "Finish & Save Profile"}
          </Text>
        </TouchableOpacity>
        
        {isDemo && (
          <Text style={styles.demoNote}>
            Note: You are in demo mode. Your profile will be saved to the demo database.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.primary,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.text,
    marginTop: 10,
    textAlign: "center",
    marginBottom: 30,
  },
  iconContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  demoNote: {
    marginTop: 20,
    color: theme.warning,
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default FinalCongratsScreen;