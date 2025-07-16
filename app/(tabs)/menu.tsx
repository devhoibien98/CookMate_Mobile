import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchRecipes } from '@/src/services/recipes';
import { useFocusEffect } from '@react-navigation/native';

const MenuScreen = () => {
  const router = useRouter();
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadRecipes = React.useCallback(() => {
    setLoading(true);
    fetchRecipes(1, 10)
      .then((data: any) => {
        setRecipes(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to sample data if API fails
        const sampleRecipes = [
          {
            id: 1,
            name: 'The Fluffiest Vegan Pancakes',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 3,
            cookingTime: 35,
            ingredients: ['flour', 'milk', 'eggs'],
            description: 'Delicious vegan pancakes',
            aiRating: 3,
          },
          {
            id: 2,
            name: 'Peanut Butter Cookies',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 4,
            cookingTime: 25,
            ingredients: ['peanut butter', 'flour', 'sugar'],
            description: 'Sweet and nutty cookies',
            aiRating: 4,
          },
          {
            id: 3,
            name: 'Chicken Noodle Soup',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 4,
            cookingTime: 45,
            ingredients: ['chicken', 'noodles', 'vegetables'],
            description: 'Comforting chicken soup',
            aiRating: 4,
          },
          {
            id: 4,
            name: 'Easy Glazed Pork Chops',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 4,
            cookingTime: 30,
            ingredients: ['pork chops', 'glaze', 'seasonings'],
            description: 'Juicy glazed pork chops',
            aiRating: 4,
          },
          {
            id: 5,
            name: 'Chocolate Chip Muffins',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 3,
            cookingTime: 20,
            ingredients: ['flour', 'chocolate chips', 'butter'],
            description: 'Soft and sweet muffins',
            aiRating: 3,
          },
          {
            id: 6,
            name: 'Fresh Garden Salad',
            image: require("../../assets/images/recipe-suggestion.png"),
            rating: 3,
            cookingTime: 10,
            ingredients: ['lettuce', 'tomatoes', 'dressing'],
            description: 'Healthy and fresh salad',
            aiRating: 3,
          },
        ];
        setRecipes(sampleRecipes);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  useFocusEffect(
    React.useCallback(() => {
      // Refresh favorites state when screen is focused
      loadRecipes();
    }, [loadRecipes])
  );

  const handleRecipePress = (recipe: any) => {
    const recipeString = JSON.stringify(recipe);

    router.push({
      pathname: '/RecipeDetail',
      params: { recipe: recipeString }
    });
  };

  if (loading) {
    return (
      <CombineLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Đang tải...</Text>
        </View>
      </CombineLayout>
    );
  }

  return (
    <CombineLayout>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentArea}>
          <Text style={styles.heresWhatWe}>Đây là những gì chúng tôi đề xuất cho bạn!</Text>
          <View style={styles.recipeGrid}>
            {recipes.map((recipe, index) => (
              <View key={recipe.id} style={styles.recipeRow}>
                <TouchableOpacity
                  onPress={() => handleRecipePress(recipe)}
                  activeOpacity={0.7}
                  style={styles.recipeCard}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.recipeImage}
                      resizeMode="cover"
                      source={recipe.image || require("../../assets/images/recipe-suggestion.png")}
                    />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>{recipe.cookingTime || 35} phút</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesome
                          key={star}
                          name="star"
                          size={15}
                          color={star <= (recipe.aiRating || recipe.rating) ? "gold" : "gray"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>{recipe.name}</Text>
                </TouchableOpacity>
                {index + 1 < recipes.length && (
                  <TouchableOpacity
                    onPress={() => handleRecipePress(recipes[index + 1])}
                    activeOpacity={0.7}
                    style={styles.recipeCard}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.recipeImage}
                        resizeMode="cover"
                        source={recipes[index + 1].image || require("../../assets/images/recipe-suggestion.png")}
                      />
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.minText}>{recipes[index + 1].cookingTime || 35} phút</Text>
                      <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FontAwesome
                            key={star}
                            name="star"
                            size={15}
                            color={star <= (recipes[index + 1].aiRating || recipes[index + 1].rating) ? "gold" : "gray"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.recipeTitle}>{recipes[index + 1].name}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </CombineLayout>
  );
};

const styles = StyleSheet.create({
  userMenu: { flex: 1, backgroundColor: "#fff" },
  mu: { height: 176, width: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  muChild: { ...StyleSheet.absoluteFillObject },
  cookmate: { fontSize: 48, fontFamily: "JosefinSans-Regular", color: "#fff", position: 'absolute', top: 63, left: 97 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 50 },
  contentArea: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 33, paddingHorizontal: 19 },
  heresWhatWe: { color: "#000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 26, alignSelf: 'center', width: '100%' },
  recipeGrid: {},
  recipeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  recipeCard: { width: 180, alignItems: 'flex-start' },
  imageContainer: {
    position: 'relative',
    width: 180,
    height: 180,
    borderRadius: 5,
    overflow: 'hidden'
  },
  recipeImage: { width: 180, height: 180, borderRadius: 5 },
  minText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  starsContainer: { flexDirection: 'row' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 6, marginBottom: 4 },
  recipeTitle: { color: "#000", fontSize: 15, fontWeight: "bold", marginTop: 4 },
});

export default MenuScreen;