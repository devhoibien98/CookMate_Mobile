import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AIService from "../../services/aiService";

export default function AIToolsScreen() {
  const [activeTab, setActiveTab] = useState("chat");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNutritionAnalysis = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter dish name and ingredients");
      return;
    }

    setIsLoading(true);
    try {
      const parts = inputText.split(":");
      const recipeName = parts[0]?.trim() || "Dish";
      const ingredients = parts[1]?.split(",").map((i) => i.trim()) || [
        inputText,
      ];

      const analysis = await AIService.analyzeNutrition(
        recipeName,
        ingredients
      );
      setResult(analysis);
    } catch (error) {
      Alert.alert("Error", "Cannot analyze nutrition");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientSubstitution = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter ingredient name to substitute");
      return;
    }

    setIsLoading(true);
    try {
      const substitutes = await AIService.suggestIngredientSubstitutes(
        inputText
      );
      setResult(
        `You can substitute "${inputText}" with:\n\n${substitutes.join("\n")}`
      );
    } catch (error) {
      Alert.alert("Error", "Cannot find ingredient substitutes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookingTips = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter cooking technique to learn about");
      return;
    }

    setIsLoading(true);
    try {
      const tips = await AIService.getCookingTips(inputText);
      setResult(tips);
    } catch (error) {
      Alert.alert("Error", "Cannot get cooking tips");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "nutrition":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Nutrition Analysis</Text>
            <Text style={styles.description}>
              Enter dish name and ingredients (separated by :)
            </Text>
            <Text style={styles.example}>
              Example: Beef Pho: Beef, pho noodles, onion, cilantro
            </Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Dish name: ingredient 1, ingredient 2..."
              multiline
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNutritionAnalysis}
              disabled={isLoading}
            >
              <Ionicons name="analytics" size={20} color="white" />
              <Text style={styles.buttonText}>Analyze Nutrition</Text>
            </TouchableOpacity>
          </View>
        );

      case "substitute":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Ingredient Substitute</Text>
            <Text style={styles.description}>
              Enter ingredient name you want to find substitutes for
            </Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Example: butter, sugar, eggs..."
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleIngredientSubstitution}
              disabled={isLoading}
            >
              <Ionicons name="swap-horizontal" size={20} color="white" />
              <Text style={styles.buttonText}>Find Substitutes</Text>
            </TouchableOpacity>
          </View>
        );

      case "tips":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Cooking Tips</Text>
            <Text style={styles.description}>
              Enter cooking technique or problem you want to learn about
            </Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Example: baking tips, marinating meat, frying..."
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCookingTips}
              disabled={isLoading}
            >
              <Ionicons name="bulb" size={20} color="white" />
              <Text style={styles.buttonText}>Get Tips</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="construct" size={24} color="#FF6347" />
        <Text style={styles.headerTitle}>AI Cooking Tools</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "nutrition" && styles.activeTab]}
          onPress={() => {
            setActiveTab("nutrition");
            setInputText("");
            setResult("");
          }}
        >
          <Ionicons
            name="analytics"
            size={20}
            color={activeTab === "nutrition" ? "#FF6347" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "nutrition" && styles.activeTabText,
            ]}
          >
            Nutrition
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "substitute" && styles.activeTab]}
          onPress={() => {
            setActiveTab("substitute");
            setInputText("");
            setResult("");
          }}
        >
          <Ionicons
            name="swap-horizontal"
            size={20}
            color={activeTab === "substitute" ? "#FF6347" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "substitute" && styles.activeTabText,
            ]}
          >
            Substitute
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "tips" && styles.activeTab]}
          onPress={() => {
            setActiveTab("tips");
            setInputText("");
            setResult("");
          }}
        >
          <Ionicons
            name="bulb"
            size={20}
            color={activeTab === "tips" ? "#FF6347" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "tips" && styles.activeTabText,
            ]}
          >
            Tips
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.loadingText}>AI is processing...</Text>
          </View>
        )}

        {result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Result:</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6347",
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#FF6347",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  example: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "white",
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: "top",
  },
  actionButton: {
    backgroundColor: "#FF6347",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  resultContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});
