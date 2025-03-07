import type React from "react"
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from "react-native"
import { theme } from "../styles/theme"

interface PickerModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (value: string) => void
  options: { label: string; value: string }[]
  selectedValue: string
}

const PickerModal: React.FC<PickerModalProps> = ({ visible, onClose, onSelect, options, selectedValue }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item.value === selectedValue && styles.selectedOption]}
                onPress={() => {
                  onSelect(item.value)
                  onClose()
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
  },
  option: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#e6e6e6",
  },
  optionText: {
    fontSize: 18,
  },
  closeButton: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
})

export default PickerModal

