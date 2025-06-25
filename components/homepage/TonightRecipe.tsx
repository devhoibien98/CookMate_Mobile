import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Recipe {
  title: string;
  author: string;
  likes: number;
  time: string;
  image: any;
}

interface TonightRecipeProps {
  recipes: Recipe[];
}

const TonightRecipe: React.FC<TonightRecipeProps> = ({ recipes }) => {
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
      <TouchableOpacity>
        <Image source={recipe.image} style={styles.image} />
        <Text style={styles.time}>{recipe.time}</Text>
        <Text style={styles.name}>{recipe.title}</Text>
        <Text style={styles.author}>{recipe.author}</Text>
        <Text style={styles.likes}>❤️ {recipe.likes}</Text>
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
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8 },
  time: { fontSize: 12, color: '#888' },
  name: { fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  author: { fontSize: 12, color: '#888' },
  likes: { color: '#444', marginTop: 4 },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFA726',
  },
});

export default TonightRecipe; 