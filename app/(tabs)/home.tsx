import LatestRecipes from '@/components/homepage/LatestRecipes';
import QuickLinks from '@/components/homepage/QuickLinks';
import TodaysRecipe from '@/components/homepage/TodaysRecipe';
import TonightRecipe from '@/components/homepage/TonightRecipe';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const todaysRecipe = {
  title: 'Hanna makes no-cook meal prep, 3 ways',
  author: 'Hanna Reader',
  likes: 1400,
  image: require('../../assets/images/banner-homepage.png'),
};

const latestRecipes = [
  {
    id: '1',
    title: 'Avocado salad',
    author: 'Van A',
    likes: 346,
    time: '10 min.',
    tag: 'Vegetarian',
    image: require('../../assets/images/food-img-homepage.png'),
  },
  {
    id: '2',
    title: 'Spaghetti with minced beef sauce',
    author: 'Simon',
    likes: 847,
    time: '25 min.',
    tag: '',
    image: require('../../assets/images/food-img-homepage.png'),
  },
  {
    id: '3',
    title: 'Spaghetti with minced beef sauce',
    author: 'Layla',
    likes: 847,
    time: '25 min.',
    tag: '',
    image: require('../../assets/images/food-img-homepage.png'),
  },
];

const tonightRecipes = [
  {
    title: 'Vietnamese Steamed Fermented Fish Cake',
    author: 'Meen',
    likes: 6400,
    time: '10 min.',
    image: require('../../assets/images/food-img-homepage.png'),
  },
  {
    title: 'Grilled Chicken with Broccoli',
    author: 'Anna',
    likes: 5200,
    time: '15 min.',
    image: require('../../assets/images/banner-homepage.png'),
  },
  {
    title: 'Spaghetti with minced beef sauce',
    author: 'Simon',
    likes: 847,
    time: '25 min.',
    image: require('../../assets/images/tonight-food.png'),
  },
];

const quickLinks = [
  { id: '1', title: 'Keto', image: require('../../assets/images/food-img-homepage.png') },
  { id: '2', title: 'Low carb', image: require('../../assets/images/food-img-homepage.png') },
  { id: '3', title: 'Low fat', image: require('../../assets/images/food-img-homepage.png') },
];

export default function HomeScreen() {
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
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <LatestRecipes recipes={latestRecipes} />
      </View>

      {/* What to Cook Tonight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Cook Tonight</Text>
        <TonightRecipe recipes={tonightRecipes} />
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