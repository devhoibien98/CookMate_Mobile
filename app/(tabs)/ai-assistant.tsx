import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../src/contexts/AuthContext";
import AIToolsScreen from "../../src/screens/ai/AIToolsScreen";

export default function AIAssistantTab() {
  const { token, user } = useContext(AuthContext);

  // Kiểm tra nếu chưa đăng nhập
  if (!token || !user.userId) {
    return (
      <View style={styles.loginRequiredContainer}>
        <View style={styles.loginCard}>
          <Ionicons name="lock-closed" size={60} color="#FF6347" />
          <Text style={styles.loginTitle}>Login Required</Text>
          <Text style={styles.loginMessage}>
            You need to login to access AI Chef features
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              // Navigate to profile tab where login screen is
              router.push("/(tabs)/profile");
            }}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Nếu đã đăng nhập, hiển thị AI Tools
  return <AIToolsScreen />;
}

const styles = StyleSheet.create({
  loginRequiredContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    maxWidth: 300,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  loginMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  loginButton: {
    backgroundColor: "#FF6347",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
