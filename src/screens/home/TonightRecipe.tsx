import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Recipe {
  id: string;
  title: string;
  author: string;
  rating?: number;
  time: string;
  image: any;
  avatar?: any;
}

interface TonightRecipeProps {
  recipes: Recipe[];
  onRecipePress?: (id: string) => void;
}

const AVATAR_PLACEHOLDER = require('../../../assets/images/food-icon.png');

const TonightRecipe: React.FC<TonightRecipeProps> = ({ recipes, onRecipePress }) => {
  const [current, setCurrent] = useState(0);
  const timer = useRef<any>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % recipes.length);
    }, 2000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [recipes.length]);

  const recipe = recipes[current];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onRecipePress && onRecipePress(recipe.id)}>
        <View style={styles.imageWrapper}>
          <Image source={recipe.image} style={styles.image} />
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{recipe.time}</Text>
            </View>
          </View>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={16} color="#FFA726" style={styles.starIcon} />
            <Text style={styles.ratingText}>{typeof recipe.rating === 'number' ? recipe.rating.toFixed(1) : '0.0'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{recipe.title}</Text>
        <View style={styles.authorRow}>
          <Image source={recipe.avatar || AVATAR_PLACEHOLDER} style={styles.avatar} />
          <Text style={styles.author}>{recipe.author}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.indicatorContainer}>
        {recipes.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, current === idx && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, padding: 16 },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  image: { width: '100%', height: 200, borderRadius: 12 },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#F7F7A6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  starIcon: {
    marginRight: 3,
  },
  ratingText: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  name: { fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    backgroundColor: '#eee',
  },
  author: { fontSize: 12, color: '#888' },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFA726',
  },
});

export default TonightRecipe; 