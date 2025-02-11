import { View, StyleSheet } from "react-native"
import { theme } from "../styles/theme"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bar: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
  },
  progress: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
})

