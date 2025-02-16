import { TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft } from "lucide-react-native"
import { theme } from "../styles/theme"

const BackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
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

