import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginSignupScreen from "../screens/LoginSignupScreen"
import PlaceholderScreen from "../screens/PlaceholderScreen"
import ProfileCreationScreen from "../screens/ProfileCreationScreen"
import NameScreen from "../screens/NameScreen"
import ProfileDetailsScreen1 from "../screens/ProfileDetailsScreen1"
import ProfileDetailsScreen2 from "../screens/ProfileDetailsScreen2"
import ProfileEthnicityScreen from "../screens/ProfileEthnicityScreen"
import EducationScreen from "../screens/EducationScreen"
import LocationScreen from "../screens/LocationScreen"
import CareerScreen from "../screens/CareerScreen"
import HomeScreen from "../screens/HomeScreen"
import OtherScreen from "../screens/OtherScreen"
import ProfilePicScreen from "../screens/ProfilePicScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Stack.Navigator initialRouteName="LoginSignup" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
      <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="ProfileDetails1" component={ProfileDetailsScreen1} />
      <Stack.Screen name="ProfileDetails2" component={ProfileDetailsScreen2} />
      <Stack.Screen name="ProfileEthnicity" component={ProfileEthnicityScreen} />
      <Stack.Screen name="Education" component={EducationScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Career" component={CareerScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Other" component={OtherScreen} />
      <Stack.Screen name="ProfilePic" component={ProfilePicScreen} />
    </Stack.Navigator>
  )
}

