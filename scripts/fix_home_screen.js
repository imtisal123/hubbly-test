/**
 * Script to fix the HomeScreen.tsx file
 * This script will completely rewrite the file to ensure it has proper syntax
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'screens', 'HomeScreen.tsx');

// Create the new file content with proper syntax
const newContent = `"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import BackButton from "../components/BackButton"
import { theme } from "../styles/theme"
import { useAuth } from "../contexts/AuthContext"
import { Feather } from "@expo/vector-icons"
import { getSiblings } from "../lib/profiles"

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [siblings, setSiblings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Refresh profile data when the screen loads
    refreshProfile();
    
    // Fetch siblings data
    const fetchSiblings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await getSiblings(user.id);
        if (error) throw error;
        setSiblings(data || []);
      } catch (error) {
        console.error("Error fetching siblings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSiblings();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Hubbly</Text>
        <Text style={styles.subtitle}>Please create your profile to continue</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ProfileCreation")}
        >
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={signOut}
        >
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {profile.name || "User"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileDetails")}>
            <Image
              source={
                profile.profilePicUrl
                  ? { uri: profile.profilePicUrl }
                  : require("../assets/default-profile.png")
              }
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Profile</Text>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profile.name || "Not set"}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{formatDate(profile.dateOfBirth) || "Not set"}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{profile.gender || "Not set"}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Ethnicity:</Text>
            <Text style={styles.value}>{profile.ethnicity || "Not set"}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("ProfileDetails")}
          >
            <Feather name="edit" size={16} color={theme.textLight} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Family Information</Text>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Father:</Text>
            <Text style={styles.value}>{profile.fatherName || "Not set"}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Mother:</Text>
            <Text style={styles.value}>{profile.motherName || "Not set"}</Text>
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Siblings:</Text>
            <Text style={styles.value}>{siblings.length || "0"}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("FamilyDetails")}
          >
            <Feather name="edit" size={16} color={theme.textLight} />
            <Text style={styles.editButtonText}>Edit Family Info</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.matchButton]}
          onPress={() => navigation.navigate("MatchPreferences")}
        >
          <Text style={styles.buttonText}>Find Matches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            Alert.alert(
              "Sign Out",
              "Are you sure you want to sign out?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Sign Out",
                  onPress: signOut,
                },
              ]
            );
          }}
        >
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.textDark,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textMedium,
    marginBottom: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  card: {
    backgroundColor: theme.textLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.primaryDark,
  },
  profileItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 100,
    fontSize: 16,
    color: theme.textDark,
    fontWeight: "500",
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: theme.textDark,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: theme.primary,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: theme.textLight,
    marginLeft: 5,
    fontWeight: "500",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
  matchButton: {
    backgroundColor: theme.accent,
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryButtonText: {
    color: theme.textDark,
    fontSize: 16,
    fontWeight: "500",
  },
});`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('HomeScreen.tsx has been fixed!');
