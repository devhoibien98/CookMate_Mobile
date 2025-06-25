import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FavoriteButton from '@/components/FavoriteButton';

const favoriteRecipes = [
    {
        id: 1,
        name: 'Microwave Scramble Eggs',
        image: require('../../assets/images/recipedetail.png'),
        rating: 4,
        ingredients: 2,
    },
    {
        id: 2,
        name: 'Microwave Scramble Eggs',
        image: require('../../assets/images/recipedetail.png'),
        rating: 4,
        ingredients: 2,
    },
    {
        id: 3,
        name: 'Microwave Scramble Eggs',
        image: require('../../assets/images/recipedetail.png'),
        rating: 4,
        ingredients: 2,
    },
    {
        id: 4,
        name: 'Microwave Scramble Eggs',
        image: require('../../assets/images/recipedetail.png'),
        rating: 4,
        ingredients: 2,
    },
];

const FavouriteScreen = () => {
    const router = useRouter();
    const [favorites, setFavorites] = React.useState<{ [key: number]: boolean }>({ 1: true, 2: true, 3: true, 4: true });

    return (
        <CombineLayout>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {favoriteRecipes.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => router.push('/RecipeDetail')}
                        activeOpacity={0.8}
                    >
                        <Image source={item.image} style={styles.cardImage} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FontAwesome
                                        key={i}
                                        name="star"
                                        size={16}
                                        color={i <= item.rating ? '#FFD700' : '#eee'}
                                    />
                                ))}
                            </View>
                            <Text style={styles.cardSubtitle}>You have all {item.ingredients} ingredients</Text>
                        </View>
                        <FavoriteButton
                            isFavorite={!!favorites[item.id]}
                            onPress={() => setFavorites(fav => ({ ...fav, [item.id]: !fav[item.id] }))}
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </CombineLayout>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 18,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    cardImage: { width: 80, height: 80, borderRadius: 8 },
    cardTitle: { fontWeight: 'bold', fontSize: 16 },
    cardSubtitle: { color: '#888', fontSize: 13, marginTop: 4 },
});

export default FavouriteScreen; 