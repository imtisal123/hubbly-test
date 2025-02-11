"use client"

import { useState } from "react"
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

const onboardingSteps = [
  {
    title: "Welcome to Hubbly",
    description: "Find your perfect match with our intelligent matchmaking algorithm.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Create Your Profile",
    description: "Tell us about yourself and what you're looking for in a partner.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Discover Matches",
    description: "Browse through potential matches and connect with people who share your interests.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Start Conversations",
    description: "Break the ice with our conversation starters and get to know your matches.",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const translateX = useSharedValue(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      translateX.value = withTiming(-width * (currentStep + 1))
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.carousel, animatedStyle]}>
        {onboardingSteps.map((step, index) => (
          <View key={index} style={styles.step}>
            <Image source={{ uri: step.image }} style={styles.image} />
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        ))}
      </Animated.View>
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View key={index} style={[styles.paginationDot, index === currentStep && styles.paginationDotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  carousel: {
    flex: 1,
    flexDirection: "row",
  },
  step: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

