import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import AIChatScreen from "../../screens/ai/AIChatScreen";

const { width, height } = Dimensions.get("window");

export default function FloatingAIButton() {
  const [showModal, setShowModal] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const { token, user } = useContext(AuthContext);

  const handlePress = () => {
    // Kiểm tra nếu chưa đăng nhập
    if (!token || !user.userId) {
      Alert.alert(
        "Login Required",
        "You need to login to access AI Assistant features",
        [{ text: "OK" }]
      );
      return;
    }

    // Animation khi nhấn
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Ẩn button nếu chưa đăng nhập
  if (!token || !user.userId) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[styles.floatingButton, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity
          style={styles.buttonTouchable}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <AIChatScreen />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  buttonTouchable: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6347",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 5,
  },
});
