"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { theme } from "../styles/theme"
import { useAuth } from "../contexts/AuthContext"
import { Feather } from "@expo/vector-icons"
import { getSiblings } from "../lib/profiles"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [siblings, setSiblings] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Refresh profile data when the screen loads
    refreshProfile()
    
    // Fetch siblings data
    const fetchSiblings = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        const { data, error } = await getSiblings(user.id)
        if (error) throw error
        setSiblings(data || [])
      } catch (error) {
        console.error("Error fetching siblings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSiblings()
  }, [user])

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          onPress: async () => {
            await signOut()
          },
          style: "destructive" 
        }
      ]
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hubbly</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Feather name="log-out" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          {profile?.profile_pic_url ? (
            <Image 
              source={{ uri: profile.profile_pic_url }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="user" size={50} color={theme.textSecondary} />
            </View>
          )}
          
          <Text style={styles.profileName}>{profile?.name || "Your Profile"}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{profile?.name || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{profile?.gender || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{formatDate(profile?.date_of_birth)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ethnicity:</Text>
              <Text style={styles.infoValue}>{profile?.ethnicity || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{profile?.location || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nationality:</Text>
              <Text style={styles.infoValue}>{profile?.nationality || "Not provided"}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Education:</Text>
              <Text style={styles.infoValue}>{profile?.education_level || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>University:</Text>
              <Text style={styles.infoValue}>{profile?.university || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupation:</Text>
              <Text style={styles.infoValue}>{profile?.occupation || "Not provided"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Company:</Text>
              <Text style={styles.infoValue}>{profile?.company || "Not provided"}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Siblings:</Text>
              <Text style={styles.infoValue}>{siblings.length || 0}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => Alert.alert("Coming Soon", "Profile editing will be available in a future update.")}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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
    color: theme.text,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.cardBackground,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primary,
  },
  signOutButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  editProfileButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  editProfileButtonText: {
    color: theme.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})
