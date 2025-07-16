import FavoriteButton from '@/components/FavoriteButton';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as React from "react";
import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFavorites, Recipe } from '@/hooks/useFavorites';

const RecipeDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite, refreshFavorites } = useFavorites();

  // Get recipe from route params
  const recipeParam = (route.params as any)?.recipe;
  let recipe: Recipe | null = null;

  if (recipeParam) {
    try {
      if (typeof recipeParam === 'string') {
        // Check if it's already a JSON string
        if (recipeParam.startsWith('{') || recipeParam.startsWith('[')) {
          recipe = JSON.parse(recipeParam);
        } else {
          console.error('Invalid JSON string:', recipeParam);
          recipe = null;
        }
      } else if (typeof recipeParam === 'object' && recipeParam !== null) {
        // It's already an object, use it directly
        recipe = recipeParam;
      } else {
        console.error('Invalid recipe param type:', typeof recipeParam);
        recipe = null;
      }
    } catch (error) {
      console.error('Error parsing recipe:', error);
      recipe = null;
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Chi tiết món ăn' });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // Refresh favorites when screen is focused
      refreshFavorites();
    }, [refreshFavorites])
  );

  if (!recipe) {
    return (
      <ScrollView>
        <Text style={{ margin: 32, textAlign: 'center' }}>Không tìm thấy món ăn.</Text>
      </ScrollView>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(recipe!);
  };

  // Handle data inconsistencies - some screens pass 'title' instead of 'name'
  const recipeName = recipe.name || recipe.title || 'Tên món ăn không xác định';
  const recipeDescription = recipe.description || '';
  const recipeRating = recipe.aiRating || recipe.rating || 0;
  const recipeCookingTime = recipe.cookingTime || 0;
  const recipeIngredients = recipe.ingredients || [];
  const recipeImage = recipe.image || require("../assets/images/recipedetail.png");

  return (
    <ScrollView>
      <Image style={styles.image} resizeMode="cover" source={recipeImage} />

      {/* Card Intro */}
      <View style={styles.cardIntro}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{recipeName}</Text>
            <Text style={styles.subtitle}>{recipeDescription}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <FontAwesome key={i} name="star" size={18} color={i <= Math.round(recipeRating) ? "#FFD700" : "#eee"} />
              ))}
              <Feather name="clock" size={16} color="#888" style={{ marginLeft: 16 }} />
              <Text style={styles.timeText}>{recipeCookingTime ? `${recipeCookingTime} phút` : 'Chưa rõ'}</Text>
            </View>
          </View>
          <FavoriteButton
            isFavorite={isFavorite(recipe.id)}
            onPress={handleToggleFavorite}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Nguyên liệu</Text>
      <View style={styles.ingredientTable}>
        {Array.isArray(recipeIngredients) && recipeIngredients.length > 0 ? (
          recipeIngredients.map((name: string, idx: number, arr: string[]) => (
            <View key={`${name}-${idx}`} style={[styles.ingredientRow, idx < arr.length - 1 && styles.ingredientRowBorder]}>
              <Text style={styles.ingredientName}>{name}</Text>
              <Text style={styles.ingredientValue}></Text>
            </View>
          ))
        ) : (
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>Chưa có thông tin nguyên liệu</Text>
            <Text style={styles.ingredientValue}></Text>
          </View>
        )}
      </View>

      {/* Nutrition */}
      <Text style={styles.sectionTitle}>Dinh dưỡng</Text>
      <View style={styles.cardNutrition}>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Calo</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.calories ?? '--'}</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Protein</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.protein ?? '--'}g</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Chất béo</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.fat ?? '--'}g</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Carb</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.carbs ?? '--'}g</Text></View>
        </View>
      </View>

      {/* Instruction */}
      <Text style={styles.sectionTitle}>Hướng dẫn</Text>
      {(recipe.cookingSteps && recipe.cookingSteps.length > 0 ? recipe.cookingSteps : [{ stepNumber: 1, description: 'Chưa có hướng dẫn.' }]).map((step: any) => (
        <View key={step.stepNumber} style={styles.cardStep}>
          <Text style={styles.stepNumber}>{step.stepNumber}</Text>
          <Text style={styles.stepText}>{step.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: { width: "100%", height: 220 },
  cardIntro: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: -32,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2
  },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 2 },
  subtitle: { color: "#888", fontSize: 14 },
  timeText: { color: "#888", fontSize: 14, marginLeft: 4 },
  sectionTitle: { fontWeight: "bold", fontSize: 17, marginTop: 32, marginBottom: 12, marginLeft: 16 },
  ingredientTable: { backgroundColor: "#fff", marginHorizontal: 0, borderRadius: 0, overflow: "hidden", marginBottom: 8, marginTop: 0 },
  ingredientRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  ingredientRowBorder: { borderBottomWidth: 1, borderColor: "#eee" },
  ingredientName: { color: "#888", fontSize: 15 },
  ingredientValue: { color: "#888", fontSize: 15 },
  cardNutrition: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center"
  },
  nutritionRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  nutritionCol: { flex: 1, alignItems: "center" },
  nutritionLabel: { color: "#888", fontWeight: "bold", fontSize: 15, marginBottom: 2 },
  nutritionValueBold: { fontWeight: "bold", fontSize: 16, color: "#222" },
  cardStep: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  stepNumber: {
    fontWeight: "bold",
    fontSize: 18,
    width: 28,
    height: 28,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    marginRight: 12,
    color: "#333"
  },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#333" }
});

export default RecipeDetail;