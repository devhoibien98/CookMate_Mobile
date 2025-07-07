import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickLink {
  id: string;
  title: string;
  image: any;
}

interface QuickLinksProps {
  links: QuickLink[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ links }) => (
  <FlatList
    data={links}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingRight: 16 }}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.overlay} />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

const styles = StyleSheet.create({
  card: { width: 160, marginRight: 16, paddingLeft: 16 },
  imageWrapper: {
    width: 160,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: { width: '100%', height: '100%', borderRadius: 16, position: 'absolute', top: 0, left: 0 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  title: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    zIndex: 2,
  },
});

export default QuickLinks; 