import { TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ArrowLeft } from "lucide-react-native"
import { theme } from "../styles/theme"

const BackButton = () => {
  const navigation = useNavigation()
  const route = useRoute()

  // Don't show back button on initial screens (except Placeholder)
  if (route.name === "LoginSignup" || route.name === "Home") {
    return null
  }

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      // If can't go back, navigate to a default screen
      navigation.navigate("Placeholder")
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
      <ArrowLeft color={theme.primary} size={30} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
})

export default BackButton
