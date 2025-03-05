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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{profile.name || "Not provided"}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{formatDate(profile.dateOfBirth)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Ethnicity:</Text>
              <Text style={styles.infoValue}>{profile.ethnicity || "Not provided"}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{profile.location || "Not provided"}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("ProfileDetails")}
            >
              <Feather name="edit" size={16} color={theme.textLight} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          {siblings.length > 0 ? (
            siblings.map((sibling, index) => (
              <View key={index} style={styles.familyCard}>
                <View style={styles.familyMember}>
                  <Image
                    source={
                      sibling.profilePicUrl
                        ? { uri: sibling.profilePicUrl }
                        : require("../assets/default-profile.png")
                    }
                    style={styles.familyPic}
                  />
                  <View style={styles.familyInfo}>
                    <Text style={styles.familyName}>{sibling.name}</Text>
                    <Text style={styles.familyRelation}>
                      {sibling.relation || "Sibling"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() =>
                      navigation.navigate("SiblingDetails", { siblingId: sibling.id })
                    }
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <TouchableOpacity
              style={styles.addFamilyButton}
              onPress={() => navigation.navigate("FamilyDetails")}
            >
              <Feather name="plus-circle" size={20} color={theme.primary} />
              <Text style={styles.addFamilyText}>Add Family Members</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
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
                  style: "destructive",
                },
              ]
            );
          }}
        >
          <Feather name="log-out" size={18} color={theme.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
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
    color: theme.textMedium,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.textDark,
  },
  profileCard: {
    backgroundColor: theme.textLight,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontWeight: "bold",
    color: theme.textDark,
  },
  infoValue: {
    flex: 1,
    color: theme.textMedium,
  },
  editButton: {
    backgroundColor: theme.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: theme.textLight,
    marginLeft: 5,
    fontWeight: "bold",
  },
  familyCard: {
    backgroundColor: theme.textLight,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  familyMember: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  familyPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.textDark,
  },
  familyRelation: {
    color: theme.textMedium,
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: theme.secondaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: theme.secondary,
    fontWeight: "bold",
  },
  addFamilyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.textLight,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: "dashed",
  },
  addFamilyText: {
    marginLeft: 10,
    color: theme.primary,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: theme.textLight,
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.border,
  },
  secondaryButtonText: {
    color: theme.textDark,
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: theme.danger,
    marginLeft: 5,
    fontWeight: "bold",
  },
});`;

// Write the new content to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('HomeScreen.tsx has been fixed!');
