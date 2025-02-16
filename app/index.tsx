import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginSignupScreen from "../screens/LoginSignupScreen";
import ProfileCreationScreen from "../screens/ProfileCreationScreen";
import NameScreen from "../screens/NameScreen";
import ProfileDetailsScreen1 from "../screens/ProfileDetailsScreen1";
import ProfileDetailsScreen2 from "../screens/ProfileDetailsScreen2";
import ProfileEthnicityScreen from "../screens/ProfileEthnicityScreen"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="LoginSignup" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
        <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="ProfileDetails1" component={ProfileDetailsScreen1} />
        <Stack.Screen name="ProfileDetails2" component={ProfileDetailsScreen2} />
        <Stack.Screen name="ProfileEthnicity" component={ProfileEthnicityScreen} />
      </Stack.Navigator>
  );
}