"use client"

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { theme } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { getSiblings } from "../lib/profiles";

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
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.noProfileText}>No profile found</Text>
        <TouchableOpacity
          style={styles.createProfileButton}
          onPress={() => navigation.navigate("ProfileCreation")}
        >
          <Text style={styles.createProfileButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hello, {profile.name || "there"}!</Text>
            <Text style={styles.subtitle}>Welcome to Hubbly</Text>
          </View>
          <TouchableOpacity style={styles.profileImageContainer} onPress={() => navigation.navigate("ProfileDetails")}>
            {profile.profilePicture ? (
              <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>{profile.name ? profile.name[0] : "U"}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProfileDetails")}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>{profile.name || "Your Name"}</Text>
                <Text style={styles.cardSubtitle}>
                  {profile.gender || "Gender"} • {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "Date of Birth"}
                </Text>
                <Text style={styles.cardDetail}>
                  {profile.ethnicity || "Ethnicity"} • {profile.location?.city || "Location"}
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color={theme.textDark} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          
          {/* Parents Section */}
          <View style={styles.familyGroup}>
            <Text style={styles.familyGroupTitle}>Parents</Text>
            
            {/* Father */}
            <TouchableOpacity 
              style={styles.familyCard} 
              onPress={() => navigation.navigate("FatherDetails", { editing: true })}
            >
              <View style={styles.familyCardContent}>
                <View>
                  <Text style={styles.familyCardTitle}>
                    {profile.fatherDetails?.name || "Add Father Details"}
                  </Text>
                  {profile.fatherDetails ? (
                    <Text style={styles.familyCardSubtitle}>
                      {profile.fatherDetails.occupation || "Occupation"} • {profile.fatherDetails.education || "Education"}
                    </Text>
                  ) : (
                    <Text style={styles.familyCardSubtitle}>
                      Tap to add details
                    </Text>
                  )}
                </View>
                <Feather name={profile.fatherDetails ? "edit" : "plus"} size={20} color={theme.textDark} />
              </View>
            </TouchableOpacity>
            
            {/* Mother */}
            <TouchableOpacity 
              style={styles.familyCard} 
              onPress={() => navigation.navigate("MotherDetails", { editing: true })}
            >
              <View style={styles.familyCardContent}>
                <View>
                  <Text style={styles.familyCardTitle}>
                    {profile.motherDetails?.name || "Add Mother Details"}
                  </Text>
                  {profile.motherDetails ? (
                    <Text style={styles.familyCardSubtitle}>
                      {profile.motherDetails.occupation || "Occupation"} • {profile.motherDetails.education || "Education"}
                    </Text>
                  ) : (
                    <Text style={styles.familyCardSubtitle}>
                      Tap to add details
                    </Text>
                  )}
                </View>
                <Feather name={profile.motherDetails ? "edit" : "plus"} size={20} color={theme.textDark} />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Siblings Section */}
          <View style={styles.familyGroup}>
            <View style={styles.familyGroupHeader}>
              <Text style={styles.familyGroupTitle}>Siblings</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SiblingCountScreen", { editing: true })}>
                <Feather name="plus" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
            
            {siblings.length > 0 ? (
              siblings.map((sibling, index) => (
                <TouchableOpacity 
                  key={sibling.id || index}
                  style={styles.familyCard} 
                  onPress={() => navigation.navigate("SiblingDetails1", { 
                    siblingId: sibling.id,
                    editing: true 
                  })}
                >
                  <View style={styles.familyCardContent}>
                    <View>
                      <Text style={styles.familyCardTitle}>
                        {sibling.name || `Sibling ${index + 1}`}
                      </Text>
                      <Text style={styles.familyCardSubtitle}>
                        {sibling.gender || "Gender"} • {sibling.age ? `${sibling.age} years` : "Age"}
                      </Text>
                    </View>
                    <Feather name="edit" size={20} color={theme.textDark} />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity 
                style={styles.familyCard} 
                onPress={() => navigation.navigate("SiblingCountScreen")}
              >
                <View style={styles.familyCardContent}>
                  <Text style={styles.familyCardSubtitle}>
                    No siblings added yet. Tap to add.
                  </Text>
                  <Feather name="plus" size={20} color={theme.textDark} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.textDark,
  },
  noProfileText: {
    fontSize: 18,
    marginBottom: 20,
    color: theme.textDark,
  },
  createProfileButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createProfileButtonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textDark,
    marginTop: 5,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: theme.primaryLight,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.primaryLight,
  },
  profileImagePlaceholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
    color: theme.primaryDark,
  },
  card: {
    backgroundColor: theme.textLight,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.primaryDark,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.textDark,
    marginBottom: 3,
  },
  cardDetail: {
    fontSize: 14,
    color: theme.textDark,
  },
  familyGroup: {
    marginBottom: 20,
  },
  familyGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  familyGroupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.textDark,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  familyCard: {
    backgroundColor: theme.textLight,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  familyCardContent: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  familyCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.primaryDark,
    marginBottom: 3,
  },
  familyCardSubtitle: {
    fontSize: 14,
    color: theme.textDark,
  },
  signOutButton: {
    backgroundColor: theme.border,
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
  },
  signOutButtonText: {
    color: theme.textDark,
    fontSize: 16,
    fontWeight: "bold",
  },
});