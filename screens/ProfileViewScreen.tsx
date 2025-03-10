"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView, Platform } from "react-native"
import { ChevronDown, ChevronUp, User, Users, Heart } from "lucide-react-native"
import { useAuth } from "../contexts/AuthContext"
import { useProfile } from "../contexts/ProfileContext"

export default function ProfileViewScreen({ route, navigation }: any) {
  const [activeTab, setActiveTab] = useState("profile")
  const [expanded, setExpanded] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  
  // Fallback image URL that's guaranteed to work
  const fallbackImageUrl = "https://reactnative.dev/img/tiny_logo.png"

  const { profile: contextProfile } = useAuth()
  // Get profile data from the ProfileContext
  const { state: profileContextState, dispatch } = useProfile()
  
  // Get profile from route params or auth context
  console.log("Route params in ProfileViewScreen:", JSON.stringify(route?.params, null, 2))
  console.log("Profile context state:", JSON.stringify(profileContextState, null, 2))
  
  // The profile could come directly in route.params or nested in route.params.profile
  // This handles both MainTabs navigation and direct ProfileView navigation
  let rawProfile: any = null
  
  // Check all possible sources of profile data
  const originalProfile = route?.params?.originalProfile;
  console.log("Original profile data from route params:", JSON.stringify(originalProfile, null, 2));
  
  if (route?.params?.profile) {
    console.log("Found profile in route.params.profile")
    // Combine with original profile data if available, prioritizing original data
    rawProfile = originalProfile ? { ...route.params.profile, ...originalProfile } : route.params.profile
  } else if (route?.params) {
    console.log("Found profile in route.params directly")
    rawProfile = originalProfile ? { ...route.params, ...originalProfile } : route.params
  } else if (contextProfile) {
    console.log("Found profile in auth context")
    rawProfile = originalProfile ? { ...contextProfile, ...originalProfile } : contextProfile
  } else {
    console.log("No profile source found")
  }
  
  console.log("Raw profile data:", JSON.stringify(rawProfile, null, 2))
  
  // Enhanced logging for profile data
  if (rawProfile) {
    console.log('Profile picture URL:', rawProfile.profile_pic_url || rawProfile.profilePicture || 'No profile picture URL found')
    console.log('Name:', rawProfile.name || 'No name found')
    console.log('Age:', rawProfile.age || 'No age found')
    console.log('DateOfBirth:', rawProfile.dateOfBirth || rawProfile.date_of_birth || 'No dateOfBirth found')
    console.log('Marital Status:', rawProfile.maritalStatus || rawProfile.marital_status || 'No marital status found')
    console.log('Ethnicity:', rawProfile.ethnicity || 'No ethnicity found')
    console.log('Religion:', rawProfile.religion || 'No religion found')
  }
  
  // Sync profile data with ProfileContext when the component mounts - only once
  // Use a ref to track if we've already updated the context
  const hasUpdatedContext = useRef(false);
  
  useEffect(() => {
    // Only run this effect once when the component mounts and we have profile data
    if (rawProfile && !hasUpdatedContext.current) {
      hasUpdatedContext.current = true; // Mark as updated to prevent future runs
      
      // Log all possible sources of the name field for debugging
      console.log('NAME FIELD SOURCES (ONE-TIME):', JSON.stringify({
        'rawProfile.name': rawProfile?.name,
        'originalProfile.name': originalProfile?.name,
        'route.params.profile.name': route?.params?.profile?.name,
        'route.params.name': route?.params?.name,
        'contextProfile.name': contextProfile?.name
      }, null, 2));
      
      // Update the ProfileContext with the profile data from navigation using the new NORMALIZE_PROFILE action
      // This will handle both camelCase and snake_case properties automatically
      
      // Combine all possible sources of profile data for normalization
      const combinedProfileData = {
        ...rawProfile,
        ...(originalProfile || {}),
        ...(route?.params?.profile || {}),
        // Include any direct properties from route.params that might be relevant
        name: route?.params?.name || rawProfile.name || originalProfile?.name,
        profilePicture: route?.params?.profilePicture || route?.params?.image || rawProfile.profilePicture || rawProfile.profile_pic_url
      };
      
      // Log the combined data before normalization
      console.log('Combined profile data before normalization (ONE-TIME):', JSON.stringify(combinedProfileData, null, 2));
      
      // Use the NORMALIZE_PROFILE action to properly handle all profile data
      dispatch({ type: 'NORMALIZE_PROFILE', payload: combinedProfileData });
      
      console.log('Dispatched NORMALIZE_PROFILE action with (ONE-TIME):', JSON.stringify(combinedProfileData, null, 2));
    }
  }, []);  // Empty dependency array means this effect runs only once when component mounts

  // Create a normalized profile object that combines data from all sources
  // Use the normalized profile data from ProfileContext as the primary source of truth
  const combinedProfile = {
    ...rawProfile,
    ...profileContextState,
    // Ensure critical fields have fallbacks
    name: profileContextState.name || rawProfile.name || originalProfile?.name || route?.params?.name || 'N/A',
    profilePicture: profileContextState.profilePicture || rawProfile.profilePicture || rawProfile.profile_pic_url || 
                   route?.params?.profilePicture || route?.params?.image || fallbackImageUrl,
    ethnicity: profileContextState.ethnicity || rawProfile.ethnicity || originalProfile?.ethnicity || 'Not specified',
    religion: profileContextState.religion || rawProfile.religion || originalProfile?.religion || 'Not specified',
    maritalStatus: profileContextState.maritalStatus || rawProfile.maritalStatus || rawProfile.marital_status || 
                  originalProfile?.maritalStatus || originalProfile?.marital_status || 'Not specified',
  };
  
  // Create parents array from mother/father fields if not already present
  const parentsArray = [];
  
  // Add mother to parents array if mother information exists
  // Don't check motherAlive as it might not be set correctly
  // Instead, check if any mother fields exist
  if (combinedProfile.motherMaritalStatus || combinedProfile.motherCityOfResidence || 
      combinedProfile.motherAreaOfResidence || combinedProfile.motherProfession || 
      combinedProfile.motherEducation || combinedProfile.motherProfilePic) {
    parentsArray.push({
      type: 'mother',
      marital_status: combinedProfile.motherMaritalStatus || 'Not specified',
      city_of_residence: combinedProfile.motherCityOfResidence || 'Not specified',
      area_of_residence: combinedProfile.motherAreaOfResidence || 'Not specified',
      profession: combinedProfile.motherProfession || 'Not specified',
      education_level: combinedProfile.motherEducation || 'Not specified',
      profile_pic_url: combinedProfile.motherProfilePic || null
    });
    console.log('Created mother object from fields:', JSON.stringify(parentsArray[0], null, 2));
  }
  
  // Add father to parents array if father information exists
  // Don't check fatherAlive as it might not be set correctly
  // Instead, check if any father fields exist
  if (combinedProfile.fatherMaritalStatus || combinedProfile.fatherCityOfResidence || 
      combinedProfile.fatherAreaOfResidence || combinedProfile.fatherProfession || 
      combinedProfile.fatherEducation || combinedProfile.fatherProfilePic) {
    parentsArray.push({
      type: 'father',
      marital_status: combinedProfile.fatherMaritalStatus || 'Not specified',
      city_of_residence: combinedProfile.fatherCityOfResidence || 'Not specified',
      area_of_residence: combinedProfile.fatherAreaOfResidence || 'Not specified',
      profession: combinedProfile.fatherProfession || 'Not specified',
      education_level: combinedProfile.fatherEducation || 'Not specified',
      profile_pic_url: combinedProfile.fatherProfilePic || null
    });
    console.log('Created father object from fields:', JSON.stringify(parentsArray[parentsArray.length - 1], null, 2));
  }
  
  // Create siblings array from individual sibling fields if not already present
  const siblingsArray = [];
  const totalSisters = Number.parseInt(combinedProfile.sisters) || 0;
  const totalBrothers = Number.parseInt(combinedProfile.brothers) || 0;
  
  // Log all sibling-related keys in the profile for debugging
  const siblingKeys = Object.keys(combinedProfile).filter(key => key.includes('sibling'));
  console.log('All sibling-related keys in profile:', siblingKeys);
  
  // Add sisters
  for (let i = 1; i <= totalSisters; i++) {
    const siblingData = {
      gender: "Female",
      age: combinedProfile[`sibling${i}_age`] || "Not specified",
      marital_status: combinedProfile[`sibling${i}_marital_status`] || "Not specified",
      profession: combinedProfile[`sibling${i}_profession`] || "Not specified",
      education_level: combinedProfile[`sibling${i}_education_level`] || combinedProfile[`sibling${i}_education`] || "Not specified",
      city_of_residence: combinedProfile[`sibling${i}_city_of_residence`] || "Not specified",
      area_of_residence: combinedProfile[`sibling${i}_area_of_residence`] || "Not specified",
      profile_pic_url: combinedProfile[`sibling${i}_profile_pic_url`] || null
    };
    siblingsArray.push(siblingData);
    console.log(`Created sister ${i} object from fields:`, JSON.stringify(siblingData, null, 2));
  }
  
  // Add brothers
  for (let i = 1; i <= totalBrothers; i++) {
    const siblingNumber = totalSisters + i;
    const siblingData = {
      gender: "Male",
      age: combinedProfile[`sibling${siblingNumber}_age`] || "Not specified",
      marital_status: combinedProfile[`sibling${siblingNumber}_marital_status`] || "Not specified",
      profession: combinedProfile[`sibling${siblingNumber}_profession`] || "Not specified",
      education_level: combinedProfile[`sibling${siblingNumber}_education_level`] || combinedProfile[`sibling${siblingNumber}_education`] || "Not specified",
      city_of_residence: combinedProfile[`sibling${siblingNumber}_city_of_residence`] || "Not specified",
      area_of_residence: combinedProfile[`sibling${siblingNumber}_area_of_residence`] || "Not specified",
      profile_pic_url: combinedProfile[`sibling${siblingNumber}_profile_pic_url`] || null
    };
    siblingsArray.push(siblingData);
    console.log(`Created brother ${i} object from fields:`, JSON.stringify(siblingData, null, 2));
  }
  
  // Final profile with constructed parents and siblings arrays
  const profile = rawProfile ? {
    ...combinedProfile,
    // Always use our constructed arrays to ensure consistency
    // This ensures we always have the latest data from individual fields
    parents: parentsArray.length > 0 ? parentsArray : 
             (combinedProfile.parents && combinedProfile.parents.length > 0) ? 
             combinedProfile.parents : [],
    siblings: siblingsArray.length > 0 ? siblingsArray : 
              (combinedProfile.siblings && combinedProfile.siblings.length > 0) ? 
              combinedProfile.siblings : [],
    // Calculate age from dateOfBirth if age is not provided
    age: profileContextState.age || rawProfile.age || (() => {
      try {
        const dobString = rawProfile.dateOfBirth || rawProfile.date_of_birth || profileContextState.dateOfBirth;
        if (!dobString) return null;
        
        const dob = typeof dobString === 'string' 
          ? new Date(dobString) 
          : dobString;
        
        // Check if date parsing was successful
        if (isNaN(dob.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        return age;
      } catch (error) {
        console.error('Error calculating age:', error);
        return null;
      }
    })()
  } : null
  
  // Log the profile data to help with debugging - with debounce to prevent excessive logging
  const logCounter = useRef(0);
  
  // Use a ref to track if we've already logged the profile data
  const hasLoggedProfile = useRef(false);
  
  useEffect(() => {
    // Only log once when the profile is first available
    if (profile && !hasLoggedProfile.current) {
      hasLoggedProfile.current = true;
      
      console.log('FINAL PROFILE DATA (ONE-TIME):', JSON.stringify(profile, null, 2))
      console.log('Raw profile data (ONE-TIME):', JSON.stringify(rawProfile, null, 2))
      console.log('Profile picture URL:', profile?.profile_pic_url || profile?.profilePicture || 'No profile picture URL found')
      console.log('Name:', profile?.name || 'No name found')
      console.log('Age:', profile?.age || 'No age found')
      console.log('DateOfBirth:', profile?.dateOfBirth || 'No dateOfBirth found')
      console.log('Marital Status:', profile?.maritalStatus || 'No marital status found')
      console.log('Ethnicity:', profile?.ethnicity || 'No ethnicity found')
      console.log('Religion:', profile?.religion || 'No religion found')
      
      // Add more detailed debugging for the name field
      console.log('DEBUG NAME SOURCES (ONE-TIME):', JSON.stringify({
        'rawProfile.name': rawProfile?.name,
        'originalProfile.name': originalProfile?.name,
        'profileContextState.name': profileContextState?.name,
        'route.params.profile.name': route?.params?.profile?.name,
        'route.params.name': route?.params?.name,
        'contextProfile.name': contextProfile?.name,
        'final profile.name': profile?.name
      }, null, 2))
      
      console.log('Route params (ONE-TIME):', JSON.stringify(route?.params, null, 2))
      console.log('Auth context (ONE-TIME):', contextProfile ? JSON.stringify(contextProfile, null, 2) : 'null')
    }
  }, [profile])
  
  // Fallback image URL is already defined elsewhere in the file

  useEffect(() => {
    console.log("ProfileViewScreen mounted with profile:", profile)
  }, [])

  const toggleExpanded = () => {
    setExpanded(!expanded)
    if (!expanded) {
      if (scrollViewRef.current) {
        // Properly handle the scrollTo method with type checking
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
      }
    }
  }

  // Format height from inches to feet and inches
  const formatHeight = (heightInInches: number | undefined | null): string => {
    if (!heightInInches) return "N/A"

    const feet = Math.floor(heightInInches / 12)
    const inches = heightInInches % 12
    return `${feet}' ${inches}"`
  }

  // Format religion with sect if available
  const formatReligion = () => {
    const religion = profile?.religion || "N/A"
    const sect = profile?.islamicSect || profile?.sect

    if (sect) {
      return `${religion} - ${sect}`
    }
    return religion
  }

  // Format location from city and area
  const formatLocation = () => {
    const city = profile?.city || ""
    const area = profile?.area || ""

    if (city && area) {
      return `${city}, ${area}`
    } else if (city) {
      return city
    } else if (area) {
      return area
    }
    return "N/A"
  }

  // Determine profile management type
  const getProfileManagementType = () => {
    const relation = profile?.relation || ""

    if (
      relation.toLowerCase().includes("son") ||
      relation.toLowerCase().includes("daughter") ||
      relation.toLowerCase().includes("child")
    ) {
      return "Parent managed profile"
    } else if (
      relation.toLowerCase().includes("brother") ||
      relation.toLowerCase().includes("sister") ||
      relation.toLowerCase().includes("sibling")
    ) {
      return "Sibling managed profile"
    } else if (relation.toLowerCase().includes("self")) {
      return "Self managed profile"
    }
    return "Family managed profile"
  }

  // Format education object to string
  const formatEducation = () => {
    if (!profile?.education) return "N/A"

    if (typeof profile.education === "string") {
      return profile.education
    }

    if (typeof profile.education === "object") {
      const { level, institution, fieldOfStudy } = profile.education
      const parts = []
      if (level) parts.push(level)
      if (fieldOfStudy) parts.push(fieldOfStudy)
      if (institution) parts.push(`at ${institution}`)
      return parts.length > 0 ? parts.join(" ") : "N/A"
    }

    return "N/A"
  }

  // Debug the profile picture URL with all possible sources
  const profilePicUrl = profile?.profilePicture || profile?.profile_pic_url || 
                       route?.params?.profilePicture || route?.params?.profile?.profilePicture || 
                       route?.params?.profile?.profile_pic_url || contextProfile?.profilePicture || 
                       route?.params?.image || // Check if image was passed directly
                       fallbackImageUrl;
                       
  // Log all possible sources of profile picture to help with debugging
  console.log('PROFILE PIC DEBUG (ALL SOURCES):', {
    'profile?.profilePicture': profile?.profilePicture,
    'profile?.profile_pic_url': profile?.profile_pic_url,
    'route?.params?.profilePicture': route?.params?.profilePicture,
    'route?.params?.profile?.profilePicture': route?.params?.profile?.profilePicture,
    'route?.params?.profile?.profile_pic_url': route?.params?.profile?.profile_pic_url,
    'route?.params?.image': route?.params?.image,
    'contextProfile?.profilePicture': contextProfile?.profilePicture,
    'Final URL used': profilePicUrl
  });
  
  // Check if the URL is valid
  if (profilePicUrl && profilePicUrl !== fallbackImageUrl) {
    console.log('Using custom profile picture:', profilePicUrl);
  } else {
    console.log('Using fallback profile picture:', fallbackImageUrl);
  }

  // Tab Bar Component
  const TabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "profile" && styles.activeTab]}
        onPress={() => setActiveTab("profile")}
      >
        <User size={20} color={activeTab === "profile" ? "#FF69B4" : "#666"} />
        <Text style={[styles.tabText, activeTab === "profile" && styles.activeTabText]}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "parents" && styles.activeTab]}
        onPress={() => setActiveTab("parents")}
      >
        <Heart size={20} color={activeTab === "parents" ? "#FF69B4" : "#666"} />
        <Text style={[styles.tabText, activeTab === "parents" && styles.activeTabText]}>Parents</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "siblings" && styles.activeTab]}
        onPress={() => setActiveTab("siblings")}
      >
        <Users size={20} color={activeTab === "siblings" ? "#FF69B4" : "#666"} />
        <Text style={[styles.tabText, activeTab === "siblings" && styles.activeTabText]}>Siblings</Text>
      </TouchableOpacity>
    </View>
  )

  // Profile Tab Content
  const ProfileTabContent = () => (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: profilePicUrl
          }}
          style={styles.profileImage}
          onError={(e) => {
            console.log("Image loading error:", e.nativeEvent.error)
            console.log("Attempted image URL:", profilePicUrl)
            // If there's an error, try to load the fallback image
            if (profilePicUrl !== fallbackImageUrl) {
              console.log("Falling back to default image")
            }
          }}
        />
        <View style={styles.nameAgeOverlay}>
          {/* Use the profile name from the context */}
          <Text style={styles.nameAgeText}>{`${profile?.name || "N/A"}${profile?.age ? `, ${profile.age}` : ''}`}</Text>
        </View>
        <View style={styles.managementTypeOverlay}>
          <Text style={styles.managementTypeText}>{getProfileManagementType()}</Text>
        </View>
      </View>

      <View style={styles.basicInfoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{formatLocation()}</Text>
          <Text style={styles.infoLabel}>Location</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{formatHeight(profile?.height)}</Text>
          <Text style={styles.infoLabel}>Height</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{profile?.ethnicity || "N/A"}</Text>
          <Text style={styles.infoLabel}>Ethnicity</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{formatReligion()}</Text>
          <Text style={styles.infoLabel}>Religion</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{profile?.maritalStatus || profile?.marital_status || "N/A"}</Text>
          <Text style={styles.infoLabel}>Marital Status</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{formatEducation()}</Text>
          <Text style={styles.infoLabel}>Education</Text>
        </View>
      </View>

      <TouchableOpacity onPress={toggleExpanded} style={styles.learnMoreButton}>
        <Text style={styles.learnMoreText}>{expanded ? "Show Less" : "Learn More"}</Text>
        {expanded ? <ChevronUp size={24} color="#FF69B4" /> : <ChevronDown size={24} color="#FF69B4" />}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ProfileCreation', { editMode: true, profile: profile })}
        style={styles.editProfileButton}
      >
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedInfo}>
          <Text style={styles.detailText}>Gender: {profile?.gender || "Not specified"}</Text>
          <Text style={styles.detailText}>Nationality: {profile?.nationality || "Not specified"}</Text>
          <Text style={styles.detailText}>
            Educational Institution: {profile?.educationalInstitution || "Not specified"}
          </Text>
          <Text style={styles.detailText}>Employer: {profile?.employer || "Not specified"}</Text>
          <Text style={styles.detailText}>Role: {profile?.role || "Not specified"}</Text>
          <Text style={styles.detailText}>Job title: {profile?.jobTitle || "Not specified"}</Text>
          <Text style={styles.detailText}>Income: {profile?.income || "Not specified"}</Text>
          <Text style={styles.detailText}>Language: {profile?.language || "Not specified"}</Text>
          <Text style={styles.detailText}>Occupation: {profile?.occupation || "Not specified"}</Text>
        </View>
      )}
    </>
  )

  // Parent Info Card Component
  const ParentInfoCard = ({ parentType }: { parentType: string }) => {
    console.log(`Rendering ParentInfoCard for ${parentType}`);
    console.log('Full profile data:', JSON.stringify(profile, null, 2));
    
    // Check for parent data in various formats
    if (profile?.parents) {
      console.log('Parents data from profile:', JSON.stringify(profile.parents, null, 2));
    }
    if (profile?.[`${parentType}Details`]) {
      console.log(`${parentType}Details from profile:`, JSON.stringify(profile[`${parentType}Details`], null, 2));
    }
    if (profile?.[parentType]) {
      console.log(`${parentType} from profile:`, JSON.stringify(profile[parentType], null, 2));
    }
    // Find the parent with the matching type from the parents array
    // Handle both array format and direct object format
    let parent = {};
    
    // Log parent data for debugging
    console.log(`Looking for ${parentType} in parents:`, JSON.stringify(profile?.parents, null, 2));
    
    if (profile?.parents && Array.isArray(profile.parents)) {
      parent = profile.parents.find((p: any) => p.type === parentType) || {};
      console.log(`Found ${parentType} in parents array:`, JSON.stringify(parent, null, 2));
    } else if (profile?.[`${parentType}Details`]) {
      // Handle older format where parent data might be stored directly
      parent = profile[`${parentType}Details`] || {};
      console.log(`Found ${parentType} in ${parentType}Details:`, JSON.stringify(parent, null, 2));
    } else if (profile?.[parentType]) {
      // Another possible format
      parent = profile[parentType] || {};
      console.log(`Found ${parentType} directly in profile:`, JSON.stringify(parent, null, 2));
    }
    
    // If parent is still empty, check for individual fields
    if (Object.keys(parent).length === 0) {
      if (parentType === 'mother') {
        parent = {
          type: 'mother',
          marital_status: profile?.motherMaritalStatus || 'Not specified',
          city_of_residence: profile?.motherCityOfResidence || 'Not specified',
          area_of_residence: profile?.motherAreaOfResidence || 'Not specified',
          profession: profile?.motherProfession || 'Not specified',
          education_level: profile?.motherEducation || 'Not specified',
          profile_pic_url: profile?.motherProfilePic || null
        };
      } else if (parentType === 'father') {
        parent = {
          type: 'father',
          marital_status: profile?.fatherMaritalStatus || 'Not specified',
          city_of_residence: profile?.fatherCityOfResidence || 'Not specified',
          area_of_residence: profile?.fatherAreaOfResidence || 'Not specified',
          profession: profile?.fatherProfession || 'Not specified',
          education_level: profile?.fatherEducation || 'Not specified',
          profile_pic_url: profile?.fatherProfilePic || null
        };
      }
      console.log(`Created ${parentType} from individual fields:`, JSON.stringify(parent, null, 2));
    }

    // Get the appropriate data from the parent object
    const maritalStatus = (parent as any).marital_status
    const city = (parent as any).city_of_residence
    const area = (parent as any).area_of_residence
    const profession = (parent as any).profession
    const education = (parent as any).education_level
    const profilePic = (parent as any).profile_pic_url

    // Format location
    const location = () => {
      if (city && area) return `${city}, ${area}`
      if (city) return city
      if (area) return area
      return "Not specified"
    }

    return (
      <View style={styles.parentCard}>
        <View style={styles.parentHeader}>
          <Text style={styles.parentTitle}>{parentType === "mother" ? "Mother" : "Father"}</Text>
        </View>

        <View style={styles.parentImageContainer}>
          <Image source={{ uri: profilePic || fallbackImageUrl }} style={styles.parentImage} />
        </View>

        <View style={styles.parentInfoContainer}>
          <View style={styles.parentInfoRow}>
            <Text style={styles.parentInfoLabel}>Marital Status:</Text>
            <Text style={styles.parentInfoValue}>{maritalStatus || "Not specified"}</Text>
          </View>
          <View style={styles.parentInfoRow}>
            <Text style={styles.parentInfoLabel}>Location:</Text>
            <Text style={styles.parentInfoValue}>{location()}</Text>
          </View>
          <View style={styles.parentInfoRow}>
            <Text style={styles.parentInfoLabel}>Education:</Text>
            <Text style={styles.parentInfoValue}>{education || "Not specified"}</Text>
          </View>
          <View style={styles.parentInfoRow}>
            <Text style={styles.parentInfoLabel}>Profession:</Text>
            <Text style={styles.parentInfoValue}>{profession || "Not specified"}</Text>
          </View>
        </View>
      </View>
    )
  }

  // Parents Tab Content
  const ParentsTabContent = () => {
    return (
      <View style={styles.parentsContainer}>
        <ParentInfoCard parentType="father" />
        <ParentInfoCard parentType="mother" />
      </View>
    )
  }

  // Generate sibling data from profile
  const generateSiblingData = () => {
    // Log siblings data for debugging
    console.log('Siblings data in profile:', JSON.stringify(profile?.siblings, null, 2));
    console.log('Total sisters:', profile?.sisters);
    console.log('Total brothers:', profile?.brothers);
    
    // Initialize siblings array
    const siblings: Record<string, any>[] = [];
    
    // Get siblings data from the profile object
    // This assumes siblings are stored in an array in the profile
    if (profile?.siblings && Array.isArray(profile.siblings) && profile.siblings.length > 0) {
      console.log('Found siblings array with length:', profile.siblings.length);
      return profile.siblings.map((sibling: Record<string, any>) => {
        console.log('Processing sibling:', JSON.stringify(sibling, null, 2));
        return {
          // Use only fields that are collected in SiblingDetails1 and SiblingDetails2
          gender: sibling.gender || 'Not specified',
          age: sibling.age || 'Not specified',
          marital_status: sibling.marital_status || 'Not specified',
          profession: sibling.profession || 'Not specified',
          education_level: sibling.education_level || 'Not specified',
          city_of_residence: sibling.city_of_residence || 'Not specified',
          area_of_residence: sibling.area_of_residence || 'Not specified',
          profile_pic_url: sibling.profile_pic_url || sibling.profilePicUrl || sibling.profilePic || 
                           sibling.profile_picture || sibling.profilePicture || sibling.image || null
        };
      });
    }
    
    // Fallback for older profile structure - check for sisters and brothers fields
    const totalSisters = Number.parseInt(profile?.sisters) || 0;
    const totalBrothers = Number.parseInt(profile?.brothers) || 0;
    
    console.log(`Constructing siblings from individual fields: ${totalSisters} sisters and ${totalBrothers} brothers`);
    
    // Add sisters
    for (let i = 1; i <= totalSisters; i++) {
      // Check for all possible field name variations for profile picture URL
      const profilePicUrl = 
        profile[`sibling${i}_profile_pic_url`] || 
        profile[`sibling${i}_profilePicUrl`] || 
        profile[`sibling${i}_profilePic`] || 
        profile[`sibling${i}_profile_picture`] || 
        profile[`sibling${i}_profilePicture`] || 
        profile[`sibling${i}_image`] || 
        null;
        
      console.log(`Sister ${i} profile pic URL candidates:`, {
        [`sibling${i}_profile_pic_url`]: profile[`sibling${i}_profile_pic_url`],
        [`sibling${i}_profilePicUrl`]: profile[`sibling${i}_profilePicUrl`],
        [`sibling${i}_profilePic`]: profile[`sibling${i}_profilePic`],
        [`sibling${i}_profile_picture`]: profile[`sibling${i}_profile_picture`],
        [`sibling${i}_profilePicture`]: profile[`sibling${i}_profilePicture`],
        [`sibling${i}_image`]: profile[`sibling${i}_image`],
        'selected': profilePicUrl
      });
      
      const siblingData = {
        gender: "Female",
        age: profile[`sibling${i}_age`] || "Not specified",
        marital_status: profile[`sibling${i}_marital_status`] || "Not specified",
        profession: profile[`sibling${i}_profession`] || "Not specified",
        education_level: profile[`sibling${i}_education_level`] || profile[`sibling${i}_education`] || "Not specified",
        city_of_residence: profile[`sibling${i}_city_of_residence`] || "Not specified",
        area_of_residence: profile[`sibling${i}_area_of_residence`] || "Not specified",
        profile_pic_url: profilePicUrl
      };
      siblings.push(siblingData);
      console.log(`Created sister ${i} from fields:`, JSON.stringify(siblingData, null, 2));
    }
    
    // Add brothers
    for (let i = 1; i <= totalBrothers; i++) {
      const siblingNumber = totalSisters + i;
      
      // Check for all possible field name variations for profile picture URL
      const profilePicUrl = 
        profile[`sibling${siblingNumber}_profile_pic_url`] || 
        profile[`sibling${siblingNumber}_profilePicUrl`] || 
        profile[`sibling${siblingNumber}_profilePic`] || 
        profile[`sibling${siblingNumber}_profile_picture`] || 
        profile[`sibling${siblingNumber}_profilePicture`] || 
        profile[`sibling${siblingNumber}_image`] || 
        null;
        
      console.log(`Brother ${i} profile pic URL candidates:`, {
        [`sibling${siblingNumber}_profile_pic_url`]: profile[`sibling${siblingNumber}_profile_pic_url`],
        [`sibling${siblingNumber}_profilePicUrl`]: profile[`sibling${siblingNumber}_profilePicUrl`],
        [`sibling${siblingNumber}_profilePic`]: profile[`sibling${siblingNumber}_profilePic`],
        [`sibling${siblingNumber}_profile_picture`]: profile[`sibling${siblingNumber}_profile_picture`],
        [`sibling${siblingNumber}_profilePicture`]: profile[`sibling${siblingNumber}_profilePicture`],
        [`sibling${siblingNumber}_image`]: profile[`sibling${siblingNumber}_image`],
        'selected': profilePicUrl
      });
      
      const siblingData = {
        gender: "Male",
        age: profile[`sibling${siblingNumber}_age`] || "Not specified",
        marital_status: profile[`sibling${siblingNumber}_marital_status`] || "Not specified",
        profession: profile[`sibling${siblingNumber}_profession`] || "Not specified",
        education_level: profile[`sibling${siblingNumber}_education_level`] || profile[`sibling${siblingNumber}_education`] || "Not specified",
        city_of_residence: profile[`sibling${siblingNumber}_city_of_residence`] || "Not specified",
        area_of_residence: profile[`sibling${siblingNumber}_area_of_residence`] || "Not specified",
        profile_pic_url: profilePicUrl
      };
      siblings.push(siblingData);
      console.log(`Created brother ${i} from fields:`, JSON.stringify(siblingData, null, 2));
    }

    return siblings;
  }

  // Sibling Card Component
  const SiblingCard = ({ sibling, index }: { sibling: Record<string, any>; index: number }) => {
    // Format location
    const location = () => {
      if (sibling.city_of_residence && sibling.area_of_residence) {
        return `${sibling.city_of_residence}, ${sibling.area_of_residence}`
      }
      if (sibling.city_of_residence) return sibling.city_of_residence
      if (sibling.area_of_residence) return sibling.area_of_residence
      return "Not specified"
    }
    
    // Enhanced debugging for sibling image URLs
    console.log(`Sibling ${index} details:`, {
      gender: sibling?.gender,
      profile_pic_url: sibling?.profile_pic_url || 'Not available',
      sibling_object: JSON.stringify(sibling, null, 2)
    });
    
    // Ensure we have a valid image URL
    const imageUrl = sibling?.profile_pic_url || fallbackImageUrl;
    console.log(`Sibling ${index} using image URL:`, imageUrl);

    return (
      <View style={styles.siblingCard}>
        <View style={styles.siblingImageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.siblingImage} 
            onError={(e) => {
              console.log(`Error loading sibling ${index} image:`, e.nativeEvent.error);
              console.log(`Attempted sibling ${index} image URL:`, imageUrl);
              // If there's an error, try to load the fallback image
              if (imageUrl !== fallbackImageUrl) {
                console.log(`Falling back to default image for sibling ${index}`);
              }
            }}
          />
        </View>

        <View style={styles.siblingInfoContainer}>
          <Text style={styles.siblingDetail}>Sibling {index + 1}</Text>
          <Text style={styles.siblingDetail}>Age: {sibling?.age || "Not specified"}</Text>
          <Text style={styles.siblingDetail}>Gender: {sibling?.gender || "Not specified"}</Text>
          <Text style={styles.siblingDetail}>Location: {location()}</Text>
          <Text style={styles.siblingDetail}>Marital Status: {sibling?.marital_status || "Not specified"}</Text>
          <Text style={styles.siblingDetail}>Education: {sibling?.education_level || "Not specified"}</Text>
          <Text style={styles.siblingDetail}>Profession: {sibling?.profession || "Not specified"}</Text>
        </View>
      </View>
    )
  }

  // Siblings Tab Content
  const SiblingsTabContent = () => {
    const siblings = generateSiblingData()

    if (siblings.length === 0) {
      return (
        <View style={styles.noSiblingsContainer}>
          <Text style={styles.noSiblingsText}>No siblings information available</Text>
        </View>
      )
    }

    return (
      <View style={styles.siblingsContainer}>
        {siblings.map((sibling: Record<string, any>, index: number) => (
          <SiblingCard key={index} sibling={sibling} index={index} />
        ))}
      </View>
    )
  }

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTabContent />
      case "parents":
        return <ParentsTabContent />
      case "siblings":
        return <SiblingsTabContent />
      default:
        return <ProfileTabContent />
    }
  }

  // Use useEffect to log when the component mounts and unmounts to help with debugging
  useEffect(() => {
    console.log('ProfileViewScreen mounted')
    return () => {
      console.log('ProfileViewScreen unmounted')
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={styles.container}>
        <TabBar />

        <ScrollView 
          ref={scrollViewRef} 
          style={styles.scrollView} 
          contentContainerStyle={{ paddingBottom: 250 }} // Extra padding for bottom tab bar
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          alwaysBounceVertical={true}
          bounces={true}
        >
          {renderTabContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    paddingBottom: 80, // Add extra padding for the tab bar
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    flexDirection: "row",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF69B4",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  activeTabText: {
    color: "#FF69B4",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    height: '100%',
  },
  scrollViewContent: {
    paddingBottom: 150, // Extra padding at the bottom to account for the tab bar
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  nameAgeOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  nameAgeText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  managementTypeOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  managementTypeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  basicInfoContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  infoLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginTop: 4,
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  learnMoreText: {
    fontSize: 18,
    color: "#FF69B4",
    marginRight: 8,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#FF69B4",
    borderRadius: 8,
  },
  editProfileText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  expandedInfo: {
    padding: 16,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 8,
  },

  // Parents Tab Styles
  parentsContainer: {
    padding: 16,
  },
  parentCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  parentHeader: {
    backgroundColor: "#FF69B4",
    padding: 12,
  },
  parentTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  parentImageContainer: {
    alignItems: "center",
    padding: 16,
  },
  parentImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
  },
  parentInfoContainer: {
    padding: 16,
  },
  parentInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  parentInfoLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  parentInfoValue: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },

  // Siblings Tab Styles
  siblingsContainer: {
    padding: 16,
  },
  siblingCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    overflow: "hidden",
  },
  siblingImageContainer: {
    padding: 12,
  },
  siblingImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  siblingInfoContainer: {
    flex: 1,
    padding: 12,
  },
  siblingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  siblingDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  noSiblingsContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  noSiblingsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})
