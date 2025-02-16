import { View, StyleSheet } from "react-native"
import { theme } from "../styles/theme"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: theme.border,
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.primary,
  },
})

