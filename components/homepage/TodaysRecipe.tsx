import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
// Nếu đã cài safe-area-context thì import, nếu chưa thì vẫn chạy bình thường
let SafeAreaView = View;
try {
  SafeAreaView = require('react-native-safe-area-context').SafeAreaView;
} catch {}

const SCREEN_WIDTH = Dimensions.get('window').width;

interface TodaysRecipeProps {
  title: string;
  author: string;
  likes: number;
  image: any;
}

const TodaysRecipe: React.FC<TodaysRecipeProps> = ({ title, author, likes, image }) => (
  <View style={styles.wrapper}>
    <Image source={image} style={styles.image} resizeMode="cover" />
    <View style={styles.card}>
      <Text style={styles.label} numberOfLines={1}>Today's Recipe</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.author} numberOfLines={1}>{author}</Text>
        <View style={styles.likesContainer}>
          <Text style={styles.heart}>❤️</Text>
          <Text style={styles.likes}>{(likes/1000).toFixed(1)}K</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 32,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 285,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  card: {
    width: SCREEN_WIDTH * 0.7,
    height: 140,
    alignSelf: 'center',
    backgroundColor: '#dedede',
    borderRadius: 24,
    marginTop: -64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
    fontWeight: '500',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#222',
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  author: {
    color: '#FF914D',
    fontWeight: '500',
    fontSize: 14,
    flexShrink: 1,
    marginRight: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  heart: {
    fontSize: 15,
    marginRight: 4,
  },
  likes: {
    fontWeight: '500',
    fontSize: 14,
    color: '#222',
  },
});

export default TodaysRecipe; 