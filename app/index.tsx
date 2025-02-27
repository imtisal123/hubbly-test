import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginSignupScreen from "../screens/LoginSignupScreen"
import PlaceholderScreen from "../screens/PlaceholderScreen"
import ProfileCreationScreen from "../screens/ProfileCreationScreen"
import NameScreen from "../screens/NameScreen"
import ProfileDetailsScreen1 from "../screens/ProfileDetailsScreen1"
import ProfileDetailsScreen2 from "../screens/ProfileDetailsScreen2"
import ProfileEthnicityScreen from "../screens/ProfileEthnicityScreen"
import LocationScreen from "../screens/LocationScreen"
import NationalityScreen from "../screens/NationalityScreen"
import EducationScreen from "../screens/EducationScreen"
import CareerScreen from "../screens/CareerScreen"
import HomeScreen from "../screens/HomeScreen"
import OtherScreen from "../screens/OtherScreen"
import ProfilePicScreen from "../screens/ProfilePicScreen"
import Congrats1Screen from "../screens/Congrats1Screen"
import ParentStatusCheckScreen from "../screens/ParentStatusCheckScreen"
import MotherDetailsScreen from "../screens/MotherDetailsScreen"
import MotherAdditionalInfoScreen from "../screens/MotherAdditionalInfoScreen"
import MotherProfilePicUploadScreen from "../screens/MotherProfilePicUploadScreen"
import FatherDetailsScreen from "../screens/FatherDetailsScreen"
import FatherAdditionalInfoScreen from "../screens/FatherAdditionalInfoScreen"
import FatherProfilePicUploadScreen from "../screens/FatherProfilePicUploadScreen"
import Congrats2Screen from "../screens/Congrats2Screen"
import SiblingCountScreen from "../screens/SiblingCountScreen"
import SiblingDetails1Screen from "../screens/SiblingDetails1Screen"
import SiblingDetails2Screen from "../screens/SiblingDetails2Screen"
import SiblingProfilePicUploadScreen from "../screens/SiblingProfilePicUploadScreen"
import Congrats3Screen from "../screens/Congrats3Screen"
import FamilyDetailsScreen from "../screens/FamilyDetailsScreen"
import MatchPreferencesScreen from "../screens/MatchPreferencesScreen"
import FinalCongratsScreen from "../screens/FinalCongratsScreen"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="LoginSignup" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
        <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
        <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="ProfileDetails1" component={ProfileDetailsScreen1} />
        <Stack.Screen name="ProfileDetails2" component={ProfileDetailsScreen2} />
        <Stack.Screen name="ProfileEthnicity" component={ProfileEthnicityScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Nationality" component={NationalityScreen} />
        <Stack.Screen name="Education" component={EducationScreen} />
        <Stack.Screen name="Career" component={CareerScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Other" component={OtherScreen} />
        <Stack.Screen name="ProfilePic" component={ProfilePicScreen} />
        <Stack.Screen name="Congrats1" component={Congrats1Screen} />
        <Stack.Screen name="ParentStatusCheck" component={ParentStatusCheckScreen} />
        <Stack.Screen name="MotherDetails" component={MotherDetailsScreen} />
        <Stack.Screen name="MotherAdditionalInfo" component={MotherAdditionalInfoScreen} />
        <Stack.Screen name="MotherProfilePicUpload" component={MotherProfilePicUploadScreen} />
        <Stack.Screen name="FatherDetails" component={FatherDetailsScreen} />
        <Stack.Screen name="FatherAdditionalInfo" component={FatherAdditionalInfoScreen} />
        <Stack.Screen name="FatherProfilePicUpload" component={FatherProfilePicUploadScreen} />
        <Stack.Screen name="Congrats2" component={Congrats2Screen} />
        <Stack.Screen name="SiblingCount" component={SiblingCountScreen} />
        <Stack.Screen name="SiblingDetails1" component={SiblingDetails1Screen} />
        <Stack.Screen name="SiblingDetails2" component={SiblingDetails2Screen} />
        <Stack.Screen name="SiblingProfilePicUpload" component={SiblingProfilePicUploadScreen} />
        <Stack.Screen name="Congrats3" component={Congrats3Screen} />
        <Stack.Screen name="FamilyDetails" component={FamilyDetailsScreen} />
        <Stack.Screen name="MatchPreferences" component={MatchPreferencesScreen} />
        <Stack.Screen name="FinalCongrats" component={FinalCongratsScreen} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  )
}

