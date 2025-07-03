import QuickLinks from '@/components/homepage/QuickLinks';
import TodaysRecipe from '@/components/homepage/TodaysRecipe';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LatestRecipes from '../../components/homepage/LatestRecipes';
import TonightRecipe from '../../components/homepage/TonightRecipe';

type RootStackParamList = { RecipeDetail: { recipe: any } };

const API_URL = 'https://cookmate-api.lighttail.com/recipes?page=1&limit=10';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'RecipeDetail'>>();
  

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        // Map API data về đúng format cho các component
        const mapped = (data.data || []).map((item: any, idx: number) => ({
          id: item.id,
          title: item.name,
          rating: item.aiRating,
          time: item.cookingTime ? `${item.cookingTime} min.` : '',
          image: require('../../assets/images/food-img-homepage.png'), // demo ảnh, bạn có thể sửa lại nếu API có ảnh
          avatar: require('../../assets/images/food-icon.png'), // demo avatar
        }));
        setRecipes(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Dữ liệu mẫu cho Today's Recipe và QuickLinks giữ nguyên
  const todaysRecipe = {
    title: 'Hanna makes no-cook meal prep, 3 ways',
    author: 'Hanna Reader',
    likes: 1400,
    image: require('../../assets/images/banner-homepage.png'),
  };

  const quickLinks = [
    { id: '1', title: 'Keto', image: require('../../assets/images/food-img-homepage.png') },
    { id: '2', title: 'Low carb', image: require('../../assets/images/food-img-homepage.png') },
    { id: '3', title: 'Low fat', image: require('../../assets/images/food-img-homepage.png') },
  ];

  

  // Hàm xử lý khi nhấn See All
  const handleSeeAll = () => {
    router.push('/AllRecipes');
  };

  // Hàm xử lý khi click vào 1 recipe
  const handleRecipePress = async (id: string) => {
    try {
      const res = await fetch('https://cookmate-api.lighttail.com/recipes?page=1&limit=10');
      const data = await res.json();
      const recipe = (data.data || []).find((item: any) => item.id === id);
      if (recipe) {
        navigation.navigate('RecipeDetail', { recipe });
      }
    } catch (e) {
      // Có thể show alert nếu muốn
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