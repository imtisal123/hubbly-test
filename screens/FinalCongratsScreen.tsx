"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native"
// Fix: Import saveProfile from demoData instead of profileUtils
import { saveProfile } from "../lib/demoData"
import { useAuth } from "../contexts/AuthContext"
import { useProfile } from "../contexts/ProfileContext"
import { theme } from "../styles/theme"

// Define the navigation parameter types
type RootStackParamList = {
  MainTabs: {
    profile: any;
    originalProfile: any;
  };
  FinalCongrats: {
    profile: any;
    profilePicture?: string;
    image?: string;
  };
};

type NavigationProps = NavigationProp<RootStackParamList>;

type RouteParams = {
  params: {
    profile: any;
    profilePicture?: string;
    image?: string;
  };
};

export default function FinalCongratsScreen({ route }: { route: RouteParams }) {
  // Use the properly defined NavigationProps type
  const navigation = useNavigation<NavigationProps>()
  const { user, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  // Extract profile data safely and log it for debugging
  const profileData = route.params?.profile || {}
  console.log('Original profile data in FinalCongratsScreen:', JSON.stringify(profileData, null, 2))
  
  // PERMANENT FIX: Get the profile data from the ProfileContext using the hook
  const { state: profileState, dispatch } = useProfile()
  console.log('Profile context state in FinalCongratsScreen:', JSON.stringify(profileState, null, 2))
  
  // Update the profile context with the route params data if needed
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      // Use the new NORMALIZE_PROFILE action to handle both camelCase and snake_case properties
      dispatch({ type: 'NORMALIZE_PROFILE', payload: profileData })
    }
  }, [profileData, dispatch])
  
  // Log all possible sources of name for debugging
  console.log('NAME FIELD SOURCES in FinalCongratsScreen:', JSON.stringify({
    'profileData.name': profileData?.name,
    'profileState.name': profileState?.name,
    'route.params.profile.name': route.params?.profile?.name,
    'user.name': user?.name
  }, null, 2));
  
  // Combine the profile data from the route params and the profile context
  // Log all possible sources of profile picture for debugging
  console.log('PROFILE PICTURE SOURCES in FinalCongratsScreen:', JSON.stringify({
    'profileData.profilePicture': profileData?.profilePicture,
    'profileData.profile_pic_url': profileData?.profile_pic_url,
    'profileState.profilePicture': profileState?.profilePicture,
    'route.params.profilePicture': route.params?.profilePicture,
    'route.params.profile.profilePicture': route.params?.profile?.profilePicture,
    'route.params.profile.profile_pic_url': route.params?.profile?.profile_pic_url,
    'route.params.image': route.params?.image
  }, null, 2));
  
  const combinedProfileData = {
    ...profileData,
    ...(profileState || {}),  // Safely spread the profile state
    // Ensure we have the name from the profile state if available
    // Important: prioritize profileData.name first as it comes from user input
    name: profileData.name || (profileState && profileState.name) || route.params?.profile?.name || 'User',
    // Explicitly handle profile picture from all possible sources
    profilePicture: profileData.profilePicture || profileData.profile_pic_url || 
                   (route.params && 'profilePicture' in route.params ? route.params.profilePicture : undefined) || 
                   route.params?.profile?.profilePicture || route.params?.profile?.profile_pic_url || 
                   (route.params && 'image' in route.params ? route.params.image : undefined) || 
                   profileState?.profilePicture || profileState?.profile_pic_url
  }
  
  console.log('Combined profile data in FinalCongratsScreen:', JSON.stringify(combinedProfileData, null, 2))
  
  // Add default values for essential fields ONLY if they're missing
  const enhancedProfileData = {
    ...combinedProfileData,  // Keep all combined data first
    // Only set defaults for missing fields
    name: combinedProfileData.name || 'User',
    gender: combinedProfileData.gender || 'Not specified',
    religion: combinedProfileData.religion || 'Not specified',
    ethnicity: combinedProfileData.ethnicity || 'Not specified',
    maritalStatus: combinedProfileData.maritalStatus || combinedProfileData.marital_status || 'Not specified',
    // Add a default profile picture only if none exists
    // Log the profile picture before setting default
    profilePicture: combinedProfileData.profilePicture || 'https://reactnative.dev/img/tiny_logo.png'
  }
  
  // Log the profile picture that will be used
  console.log('PROFILE PICTURE SELECTED:', enhancedProfileData.profilePicture);
  
  // Update the profile context with the enhanced data to ensure it has the latest values
  // Use a ref to track if we've already updated the context
  const hasUpdatedContext = useRef(false);
  
  useEffect(() => {
    // Only update once when the component mounts and we have valid data
    if (enhancedProfileData && Object.keys(enhancedProfileData).length > 0 && !hasUpdatedContext.current) {
      hasUpdatedContext.current = true; // Mark as updated to prevent future runs
      console.log('Updating ProfileContext with enhanced data (ONE-TIME):', JSON.stringify(enhancedProfileData, null, 2));
      // Use the new NORMALIZE_PROFILE action to handle both camelCase and snake_case properties
      dispatch({ type: 'NORMALIZE_PROFILE', payload: enhancedProfileData });
    }
  }, []); // Empty dependency array means this effect runs only once when component mounts
  
  console.log('Enhanced profile data in FinalCongratsScreen:', JSON.stringify(enhancedProfileData, null, 2))

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      if (user && Object.keys(profileData).length > 0) {
        const { success, data, error } = await saveProfile(user.id, profileData)
        if (success) {
          if (refreshProfile) {
            await refreshProfile()
          }
          Alert.alert("Success", "Your profile has been saved successfully!", [
            {
              text: "OK",
              onPress: () => {
                // Navigate to MainTabs instead of ProfileView to show bottom tabs
                // Ensure we have the most complete profile data by merging all sources
                const profileToPass = data || enhancedProfileData;
                
                // Create a comprehensive profile object with all fields
                const finalProfileToPass = {
                  ...profileToPass,
                  // Explicitly include critical fields with fallbacks
                  id: profileToPass.id || profileData.id,
                  name: profileData.name || profileToPass.name || enhancedProfileData.name || 'User',
                  gender: profileData.gender || profileToPass.gender || enhancedProfileData.gender || 'Not specified',
                  religion: profileData.religion || profileToPass.religion || enhancedProfileData.religion || 'Not specified',
                  ethnicity: profileData.ethnicity || profileToPass.ethnicity || enhancedProfileData.ethnicity || 'Not specified',
                  maritalStatus: profileData.maritalStatus || profileData.marital_status || 
                                profileToPass.maritalStatus || profileToPass.marital_status || 
                                enhancedProfileData.maritalStatus || 'Not specified',
                  // Ensure profile picture is passed correctly by checking all possible sources
                  profilePicture: profileData.profilePicture || profileData.profile_pic_url || 
                                 (route.params && 'profilePicture' in route.params ? route.params.profilePicture : undefined) || 
                                 (route.params && 'image' in route.params ? route.params.image : undefined) || 
                                 profileToPass.profilePicture || profileToPass.profile_pic_url || 
                                 enhancedProfileData.profilePicture || 'https://reactnative.dev/img/tiny_logo.png'
                };
                
                // Final update to the profile context before navigation
                // Use the new NORMALIZE_PROFILE action to handle both camelCase and snake_case properties
                dispatch({ type: 'NORMALIZE_PROFILE', payload: finalProfileToPass });
                
                // Log the final profile picture URL for debugging
                console.log('FINAL PROFILE PICTURE URL:', finalProfileToPass.profilePicture);
                console.log('FINAL NAVIGATION: MainTabs with profile:', JSON.stringify(finalProfileToPass, null, 2));
                console.log('Original profile data (Debug):', JSON.stringify(profileData, null, 2));
                
                // Extra check to ensure profile picture is passed correctly
                if (user?.id) {
                  console.log(`Navigating to MainTabs with authenticated user ID: ${user.id}`);
                } else {
                  console.log('Navigating to MainTabs in demo mode with profile:', JSON.stringify(finalProfileToPass, null, 2));
                }
                
                // Reset navigation stack to prevent going back to onboarding screens
                navigation.reset({
                  index: 0,
                  routes: [{ 
                    name: "MainTabs", 
                    params: { 
                      profile: finalProfileToPass,
                      originalProfile: profileData  // Pass the original profile data separately for reference
                    } 
                  }],
                } as any)
              }
            },
          ])
        } else {
          console.error("Error saving profile:", error)
          Alert.alert("Error", error?.message || "There was an error saving your profile.", [
            {
              text: "OK",
              onPress: () => {
                console.log('Navigating to MainTabs with profile after error:', JSON.stringify(enhancedProfileData, null, 2))
                console.log('Original profile data after error (Debug):', JSON.stringify(profileData, null, 2))
                navigation.reset({
                  index: 0,
                  routes: [{ 
                    name: "MainTabs", 
                    params: { 
                      profile: enhancedProfileData,
                      originalProfile: profileData  // Pass the original profile data separately
                    } 
                  }],
                })
              }
            },
          ])
        }
      } else {
        // For demo purposes, allow navigation without saving
        Alert.alert("Demo Mode", "Profile would be saved in production.", [
          {
            text: "OK",
            onPress: () => {
              console.log('Navigating to MainTabs in demo mode with profile:', JSON.stringify(enhancedProfileData, null, 2))
              console.log('Original profile data in demo mode (Debug):', JSON.stringify(profileData, null, 2))
              navigation.reset({
                index: 0,
                routes: [{ 
                  name: "MainTabs", 
                  params: { 
                    profile: enhancedProfileData,
                    originalProfile: profileData  // Pass the original profile data separately
                  } 
                }],
              })
            }
          },
        ])
      }
    } catch (error) {
      console.error("Exception in handleFinish:", error)
      Alert.alert("Error", "An unexpected error occurred.", [
        {
          text: "OK",
          onPress: () => {
            console.log('Navigating to MainTabs after exception with profile:', JSON.stringify(enhancedProfileData, null, 2))
            console.log('Original profile data after exception (Debug):', JSON.stringify(profileData, null, 2))
            navigation.reset({
              index: 0,
              routes: [{ 
                name: "MainTabs", 
                params: { 
                  profile: enhancedProfileData,
                  originalProfile: profileData  // Pass the original profile data separately
                } 
              }],
            })
          }
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>Your profile is complete</Text>
        <Text style={styles.description}>
          You've successfully set up your profile. Now you can start exploring potential matches and connect with
          compatible individuals.
        </Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Start Exploring</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

