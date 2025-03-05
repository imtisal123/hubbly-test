"use client"

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { theme } from "../styles/theme";
import BackButton from "../components/BackButton";
import ProgressBar from "../components/ProgressBar";

const SiblingProfilePicUploadScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { name, currentSibling, totalSiblings, sisters, brothers } = route.params

  const [image, setImage] = useState(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleNext = () => {
    const updatedParams = {
      ...route.params,
      [`sibling${currentSibling}ProfilePic`]: image,
    }

    if (currentSibling < totalSiblings) {
      navigation.navigate("SiblingDetails1", {
        ...updatedParams,
        currentSibling: currentSibling + 1,
      })
    } else {
      navigation.navigate("Congrats3", updatedParams)
    }
  };

  return (
    <View style={styles.container}>
      <BackButton style={styles.backButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProgressBar currentStep={currentSibling * 3} totalSteps={totalSiblings * 3 + 1} />
        <Text style={styles.title}>{`${name}'s ${
          currentSibling <= sisters ? "Sister" : "Brother"
        } Photo (${currentSibling}/${totalSiblings})`}</Text>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          )}

          {image && (
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentSibling < totalSiblings ? "Next Sibling" : "Continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primaryDark,
    textAlign: "center",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    color: theme.text,
    marginBottom: 20,
  },
  uploadButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: theme.text,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  changePhotoButton: {
    marginTop: 15,
    padding: 10,
  },
  changePhotoText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SiblingProfilePicUploadScreen