import FavoriteButton from '@/components/FavoriteButton';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from "react";
import { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";



const RecipeDetail = () => {
  const route = useRoute();
  const { recipe } = route.params as { recipe: any };
  const [isFavorite, setIsFavorite] = React.useState(false);
  const navigation = useNavigation();

  useLayoutEffect (() => {
    navigation.setOptions({ title: 'Recipe Detail'});
  }, [navigation]);

  if (!recipe) {
    return <ScrollView><Text style={{margin: 32, textAlign: 'center'}}>Recipe not found.</Text></ScrollView>;
  }

  return (
    <ScrollView>
      <Image style={styles.image} resizeMode="cover" source={require("../assets/images/recipedetail.png")} />

      {/* Card Intro */}
      <View style={styles.cardIntro}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{recipe.name}</Text>
            <Text style={styles.subtitle}>{recipe.description || ''}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              {[1,2,3,4,5].map(i => (
                <FontAwesome key={i} name="star" size={18} color={i <= Math.round(recipe.aiRating) ? "#FFD700" : "#eee"} />
              ))}
              <Feather name="clock" size={16} color="#888" style={{ marginLeft: 16 }} />
              <Text style={styles.timeText}>{recipe.cookingTime ? `${recipe.cookingTime} mins` : ''}</Text>
            </View>
          </View>
          <FavoriteButton
            isFavorite={isFavorite}
            onPress={() => setIsFavorite(fav => !fav)}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientTable}>
        {(recipe.ingredients || []).map((name: string, idx: number, arr: string[]) => (
          <View key={name} style={[styles.ingredientRow, idx < arr.length - 1 && styles.ingredientRowBorder]}>
            <Text style={styles.ingredientName}>{name}</Text>
            <Text style={styles.ingredientValue}></Text>
          </View>
        ))}
      </View>

      {/* Nutrition */}
      <Text style={styles.sectionTitle}>Nutrition</Text>
      <View style={styles.cardNutrition}>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Cal</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.calories ?? '--'}</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Protein</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.protein ?? '--'}g</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Fat</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.fat ?? '--'}g</Text></View>
          <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Carb</Text><Text style={styles.nutritionValueBold}>{recipe.nutritionInfo?.carbs ?? '--'}g</Text></View>

        </View>
      </View>

      {/* Instruction */}
      <Text style={styles.sectionTitle}>Instruction</Text>
      {(recipe.cookingSteps && recipe.cookingSteps.length > 0 ? recipe.cookingSteps : [{stepNumber: 1, description: 'No steps.'}]).map((step: any) => (
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
    borderRadius: 8,
    marginRight: 12,
    marginTop: 2
  },
  stepText: { fontSize: 15, color: "#222", flex: 1 }
});

export default RecipeDetail;