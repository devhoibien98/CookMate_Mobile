import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RecipesResponse } from '../../../src/services/recipes';
import { fetchRecipes } from '../../../src/services/recipes';
import LatestRecipes from './LatestRecipes';
import QuickLinks from './QuickLinks';
import TodaysRecipe from './TodaysRecipe';
import TonightRecipe from './TonightRecipe';

// Nếu bạn có type RootStackParamList thì import hoặc định nghĩa lại ở đây
// type RootStackParamList = { RecipeDetail: { recipe: any } };

type RootStackParamList = { RecipeDetail: { recipe: any } };

interface RecipeCardData {
  id: string;
  title: string;
  author: string;
  rating?: number;
  time: string;
  image: any;
  avatar?: any;
}

export default function HomeMainScreen() {
  const [recipes, setRecipes] = useState<RecipeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>>();

  const loadRecipes = React.useCallback(() => {
    setLoading(true);
    fetchRecipes(1, 10)
      .then((data: any) => {
        const mapped = (data.data || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          name: item.name, // Add name for consistency
          author: item.author || 'Unknown',
          rating: item.rating || item.aiRating || 0,
          time: item.cookingTime ? `${item.cookingTime} phút` : '30 phút',
          tag: item.tag || 'Món chính',
          image: item.image || require('../../../assets/images/recipe-suggestion.png'),
          avatar: item.avatar || require('../../../assets/images/food-icon.png'),
          ingredients: item.ingredients || [], // Add ingredients
          description: item.description || '', // Add description
          cookingTime: item.cookingTime || 0, // Add cooking time
          aiRating: item.aiRating || item.rating || 0, // Add AI rating
        }));
        setRecipes(mapped);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to sample data if API fails
        const sampleRecipes = [
          {
            id: '1',
            title: 'The Fluffiest Vegan Pancakes',
            name: 'The Fluffiest Vegan Pancakes',
            author: 'Chef Sarah',
            rating: 4.5,
            time: '25 phút',
            tag: 'Bữa sáng',
            image: require('../../../assets/images/recipe-suggestion.png'),
            avatar: require('../../../assets/images/food-icon.png'),
            ingredients: ['Bột mì', 'Sữa hạnh nhân', 'Bột nở', 'Muối', 'Đường'],
            description: 'Những chiếc bánh kếp thuần chay mềm mịn nhất',
            cookingTime: 25,
            aiRating: 4.5,
          },
          {
            id: '2',
            title: 'Peanut Butter Cookies',
            name: 'Peanut Butter Cookies',
            author: 'Chef Mike',
            rating: 4.2,
            time: '20 phút',
            tag: 'Tráng miệng',
            image: require('../../../assets/images/recipe-suggestion.png'),
            avatar: require('../../../assets/images/food-icon.png'),
            ingredients: ['Bơ đậu phộng', 'Bột mì', 'Đường', 'Trứng', 'Bơ'],
            description: 'Bánh quy bơ đậu phộng ngọt và bùi',
            cookingTime: 20,
            aiRating: 4.2,
          },
          {
            id: '3',
            title: 'Chicken Noodle Soup',
            name: 'Chicken Noodle Soup',
            author: 'Chef Lisa',
            rating: 4.8,
            time: '45 phút',
            tag: 'Món chính',
            image: require('../../../assets/images/recipe-suggestion.png'),
            avatar: require('../../../assets/images/food-icon.png'),
            ingredients: ['Thịt gà', 'Mì', 'Rau củ', 'Nước dùng', 'Gia vị'],
            description: 'Súp gà mì ấm áp và bổ dưỡng',
            cookingTime: 45,
            aiRating: 4.8,
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
      // Refresh recipes when screen is focused
      loadRecipes();
    }, [loadRecipes])
  );

  const todaysRecipe = {
    title: 'Hanna makes no-cook meal prep, 3 ways',
    author: 'Hanna Reader',
    likes: 1400,
    image: require('../../../assets/images/banner-homepage.png'),
  };

  const quickLinks = [
    { id: '1', title: 'Keto', image: require('../../../assets/images/food-img-homepage.png') },
    { id: '2', title: 'Low carb', image: require('../../../assets/images/food-img-homepage.png') },
    { id: '3', title: 'Low fat', image: require('../../../assets/images/food-img-homepage.png') },
  ];

  const handleSeeAll = () => {
    router.push('/AllRecipes');
  };

  const handleRecipePress = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      const recipeString = JSON.stringify(recipe);
      router.push({
        pathname: '/RecipeDetail',
        params: { recipe: recipeString }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Today's Recipe */}
      <View style={styles.section}>
        <TodaysRecipe {...todaysRecipe} />
      </View>

      {/* Our Latest Recipes */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Our Latest Recipes</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {loading ? <ActivityIndicator /> : <LatestRecipes recipes={recipes.slice(0, 5)} onRecipePress={handleRecipePress} />}
      </View>

      {/* What to Cook Tonight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Cook Tonight</Text>
        {loading ? <ActivityIndicator /> : <TonightRecipe recipes={recipes.slice(0, 3)} onRecipePress={handleRecipePress} />}
      </View>

      {/* Quick link for you */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick link for you</Text>
        <QuickLinks links={quickLinks} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: { marginVertical: 0, marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8, marginTop: 20, paddingLeft: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  seeAll: { color: '#FF914D', fontWeight: 'bold', fontSize: 16, marginRight: 16, marginTop: 20 },
}); 