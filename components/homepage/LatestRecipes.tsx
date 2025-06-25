    import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Recipe {
  id: string;
  title: string;
  author: string;
  likes: number;
  time: string;
  tag?: string;
  image: any;
}

interface LatestRecipesProps {
  recipes?: Recipe[];
}

const LatestRecipes: React.FC<LatestRecipesProps> = ({ recipes }) => (
  <FlatList
    data={recipes}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingRight: 16 }}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.time}>{item.time} {item.tag ? '· ' + item.tag : ''}</Text>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.likes}>❤️ {item.likes}</Text>
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  card: { width: 160, marginRight: 12, borderRadius: 12, paddingLeft: 16 },
  image: { width: 160, height: 200, borderRadius: 8 },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
  name: { fontWeight: 'bold', fontSize: 14, marginTop: 4 },
  author: { fontSize: 12, color: '#888' },
  likes: { color: '#444', marginTop: 4 },
});

export default LatestRecipes; 