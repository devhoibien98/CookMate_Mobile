import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AIService, { RecipeSuggestion } from "../../services/aiService";

interface AIRecipeSuggestionProps {
  ingredients?: string[];
  onRecipeGenerated?: (recipe: RecipeSuggestion) => void;
}

export default function AIRecipeSuggestion({
  ingredients = [],
  onRecipeGenerated,
}: AIRecipeSuggestionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<RecipeSuggestion | null>(
    null
  );

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      Alert.alert(
        "Thiếu nguyên liệu",
        "Vui lòng thêm ít nhất một nguyên liệu để AI có thể đề xuất công thức."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const recipe = await AIService.suggestRecipeFromIngredients(ingredients);
      setCurrentRecipe(recipe);
      onRecipeGenerated?.(recipe);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo đề xuất công thức. Vui lòng thử lại.");
      console.error("Recipe generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderRecipe = () => {
    if (!currentRecipe) return null;

    return (
      <View style={styles.recipeContainer}>
        <Text style={styles.recipeTitle}>{currentRecipe.name}</Text>

        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{currentRecipe.cookingTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="bar-chart-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{currentRecipe.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nguyên liệu:</Text>
        {currentRecipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>
            • {ingredient}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Cách làm:</Text>
        {currentRecipe.instructions.map((step, index) => (
          <Text key={index} style={styles.instructionItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={24} color="#FF6347" />
        <Text style={styles.headerTitle}>AI Đề xuất công thức</Text>
      </View>

      {ingredients.length > 0 && (
        <View style={styles.ingredientsPreview}>
          <Text style={styles.ingredientsTitle}>Từ nguyên liệu có sẵn:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.ingredientsList}>
              {ingredients.slice(0, 5).map((ingredient, index) => (
                <View key={index} style={styles.ingredientTag}>
                  <Text style={styles.ingredientTagText}>{ingredient}</Text>
                </View>
              ))}
              {ingredients.length > 5 && (
                <View style={styles.ingredientTag}>
                  <Text style={styles.ingredientTagText}>
                    +{ingredients.length - 5} khác
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.generateButton,
          isGenerating && styles.generateButtonDisabled,
        ]}
        onPress={generateRecipe}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.generateButtonText}>Đang tạo công thức...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="sparkles" size={20} color="white" />
            <Text style={styles.generateButtonText}>Tạo công thức với AI</Text>
          </View>
        )}
      </TouchableOpacity>

      {renderRecipe()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  ingredientsPreview: {
    marginBottom: 15,
  },
  ingredientsTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ingredientsList: {
    flexDirection: "row",
  },
  ingredientTag: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FF6347",
  },
  ingredientTagText: {
    fontSize: 12,
    color: "#FF6347",
    fontWeight: "500",
  },
  generateButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recipeContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  recipeInfo: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  infoText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    lineHeight: 20,
  },
  instructionItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
});
