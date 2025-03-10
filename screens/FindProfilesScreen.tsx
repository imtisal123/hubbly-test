"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { Heart, X } from "lucide-react-native"
import { useAuth } from "../contexts/AuthContext"

// Mock data for demonstration
const DEMO_PROFILES = [
  {
    id: "1",
    name: "Sarah",
    age: 28,
    location: "New York, NY",
    profession: "Software Engineer",
    education: "Masters in Computer Science",
    height: 65,
    religion: "Islam",
    sect: "Sunni",
    ethnicity: "Pakistani",
    photoUrl: "https://reactnative.dev/img/tiny_logo.png",
    bio: "I enjoy hiking, reading, and trying new restaurants. Looking for someone with similar interests and values.",
  },
  {
    id: "2",
    name: "Aisha",
    age: 26,
    location: "Chicago, IL",
    profession: "Doctor",
    education: "Medical Degree",
    height: 63,
    religion: "Islam",
    sect: "Sunni",
    ethnicity: "Indian",
    photoUrl: "https://reactnative.dev/img/tiny_logo.png",
    bio: "I love traveling, cooking, and spending time with family. Looking for someone kind and ambitious.",
  },
  {
    id: "3",
    name: "Fatima",
    age: 30,
    location: "Los Angeles, CA",
    profession: "Marketing Manager",
    education: "MBA",
    height: 67,
    religion: "Islam",
    sect: "Shia",
    ethnicity: "Arab",
    photoUrl: "https://reactnative.dev/img/tiny_logo.png",
    bio: "Passionate about art, music, and community service. Looking for someone who shares my values and zest for life.",
  },
]

export default function FindProfilesScreen() {
  const { profile } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProfiles, setLikedProfiles] = useState([])
  const [dislikedProfiles, setDislikedProfiles] = useState([])

  const currentProfile = DEMO_PROFILES[currentIndex]

  const handleLike = () => {
    setLikedProfiles([...likedProfiles, currentProfile.id])
    goToNextProfile()
  }

  const handleDislike = () => {
    setDislikedProfiles([...dislikedProfiles, currentProfile.id])
    goToNextProfile()
  }

  const goToNextProfile = () => {
    if (currentIndex < DEMO_PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Format height from inches to feet and inches
  const formatHeight = (heightInInches) => {
    if (!heightInInches) return "N/A"
    const feet = Math.floor(heightInInches / 12)
    const inches = heightInInches % 12
    return `${feet}' ${inches}"`
  }

  // Check if we've gone through all profiles
  const noMoreProfiles =
    currentIndex >= DEMO_PROFILES.length - 1 &&
    (likedProfiles.includes(DEMO_PROFILES[currentIndex]?.id) ||
      dislikedProfiles.includes(DEMO_PROFILES[currentIndex]?.id))

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Find Matches</Text>

        {noMoreProfiles ? (
          <View style={styles.noMoreProfilesContainer}>
            <Text style={styles.noMoreProfilesText}>No more profiles to show right now.</Text>
            <Text style={styles.checkBackText}>Check back later for new matches!</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileCard}>
              <Image
                source={{ uri: currentProfile.photoUrl }}
                style={styles.profileImage}
                onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
              />

              <View style={styles.profileInfo}>
                <Text style={styles.nameAge}>
                  {currentProfile.name}, {currentProfile.age}
                </Text>
                <Text style={styles.location}>{currentProfile.location}</Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Profession:</Text>
                    <Text style={styles.detailValue}>{currentProfile.profession}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Education:</Text>
                    <Text style={styles.detailValue}>{currentProfile.education}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Height:</Text>
                    <Text style={styles.detailValue}>{formatHeight(currentProfile.height)}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Religion:</Text>
                    <Text style={styles.detailValue}>
                      {currentProfile.religion} - {currentProfile.sect}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Ethnicity:</Text>
                    <Text style={styles.detailValue}>{currentProfile.ethnicity}</Text>
                  </View>
                </View>

                <Text style={styles.bioLabel}>About Me:</Text>
                <Text style={styles.bioText}>{currentProfile.bio}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={handleDislike}>
                  <X size={30} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
                  <Heart size={30} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#FF69B4",
  },
  profileCard: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    marginBottom: 100, // Extra margin for bottom tab bar
  },
  profileImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    padding: 16,
  },
  nameAge: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  likeButton: {
    backgroundColor: "#FF69B4",
  },
  dislikeButton: {
    backgroundColor: "#999",
  },
  noMoreProfilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noMoreProfilesText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  checkBackText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
})

