import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { User, Search, List } from "lucide-react-native"
import ProfileViewScreen from "../screens/ProfileViewScreen"
import CriteriaScreen from "../screens/criteriascreen"
import { View, Text } from "react-native"
import { useAuth } from "../contexts/AuthContext"

// Placeholder screen for Find tab


const FindProfilesScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Find Profiles Screen</Text>
    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function BottomTabNavigator({ route }: any) {
  const { profile: authProfile } = useAuth()

  // Get profile from navigation params or auth context with enhanced logging
  const routeProfile = route?.params?.profile
  
  // Get the original profile data from earlier in the flow
  const originalProfileData = route?.params?.originalProfile
  
  // Combine data sources with priority: originalProfile > routeProfile > authProfile
  // This ensures that the original data (like the name "Bhaloo") takes precedence
  const profile = {
    ...(authProfile || {}),
    ...(routeProfile || {}),
    ...(originalProfileData || {})
  }
  
  // Log the profile data to help with debugging
  console.log('Route params in BottomTabNavigator:', JSON.stringify(route?.params, null, 2))
  console.log('Profile data from route:', JSON.stringify(routeProfile, null, 2))
  console.log('Original profile data:', JSON.stringify(originalProfileData, null, 2))
  console.log('Profile data from auth context:', JSON.stringify(authProfile, null, 2))
  console.log('Final profile data in BottomTabNavigator:', JSON.stringify(profile, null, 2))
  console.log('Profile picture URL:', profile?.profile_pic_url || profile?.profilePicture || 'No profile picture URL found')
  console.log('Profile name:', profile?.name || 'No name found')

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF69B4",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#EEE",
          backgroundColor: "#FFF",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute',
          zIndex: 999,
        },
      }}
    >
      <Tab.Screen
        name="MyProfile"
        component={ProfileViewScreen}
        options={{
          tabBarLabel: "My Profile",
          tabBarIcon: ({ color, size }: {color: string, size: number}) => <User size={size} color={color} />,
        }}
        initialParams={{ 
          profile, 
          originalProfile: originalProfileData // Pass both profile and originalProfile data to ProfileViewScreen
        }}
      />
      <Tab.Screen
        name="Criteria"
        component={CriteriaScreen}
        options={{
          tabBarLabel: "Criteria",
          tabBarIcon: ({ color, size }: {color: string, size: number}) => <List size={size} color={color} />,
        }}
        initialParams={{ 
          profile, 
          originalProfile: originalProfileData // Pass both profile and originalProfile data to CriteriaScreen
        }}
      />
      <Tab.Screen
        name="Find"
        component={FindProfilesScreen}
        options={{
          tabBarLabel: "Find",
          tabBarIcon: ({ color, size }: {color: string, size: number}) => <Search size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

