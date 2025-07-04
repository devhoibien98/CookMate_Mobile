import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Recipe {
  id: string;
  title: string;
  author: string;
  rating?: number;
  time: string;
  tag?: string;
  image: any;
  avatar?: any;
}

interface LatestRecipesProps {
  recipes?: Recipe[];
  onRecipePress?: (id: string) => void;
}

const AVATAR_PLACEHOLDER = require('../../../assets/images/food-icon.png');

const LatestRecipes: React.FC<LatestRecipesProps> = ({ recipes, onRecipePress }) => (
  <FlatList
    data={recipes}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingRight: 16 }}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.card} onPress={() => onRecipePress && onRecipePress(item.id)}>
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.time}</Text>
            </View>
            {item.tag ? ( 
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.tag}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={16} color="#FFA726" style={styles.starIcon} />
            <Text style={styles.ratingText}>{typeof item.rating === 'number' ? item.rating.toFixed(1) : '0.0'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{item.title}</Text>
        <View style={styles.authorRow}>
          <Image source={item.avatar || AVATAR_PLACEHOLDER} style={styles.avatar} />
          <Text style={styles.author}>{item.author}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  card: { width: 160, marginRight: 12, borderRadius: 12, paddingLeft: 16 },
  imageWrapper: {
    width: 160,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  image: { width: 160, height: 200, borderRadius: 8 },
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
  name: { fontWeight: 'bold', fontSize: 14, marginTop: 4 },
  author: { fontSize: 12, color: '#888' },
});

export default LatestRecipes; 