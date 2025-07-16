import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = 'favoriteRecipes';

const FavouriteScreen = () => {
    const router = useRouter();
    const [favorites, setFavorites] = React.useState<any[]>([]);
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

    // Load favorites from AsyncStorage
    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const json = await AsyncStorage.getItem(STORAGE_KEY);
                    if (json) setFavorites(JSON.parse(json));
                } catch (e) { }
            };
            loadFavorites();
        }, [])
    );

    // Save favorites to AsyncStorage
    const saveFavorites = async (newFavs: any[]) => {
        setFavorites(newFavs);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    };

    // Remove one favorite
    const removeFavorite = async (id: number) => {
        const newFavs = favorites.filter(f => f.id !== id);
        await saveFavorites(newFavs);
    };

    // Remove selected favorites
    const removeSelectedFavorites = async () => {
        const newFavs = favorites.filter(f => !selectedIds.includes(f.id));
        await saveFavorites(newFavs);
        setSelectedIds([]);
    };

    // Remove all favorites
    const clearFavorites = async () => {
        await saveFavorites([]);
        setSelectedIds([]);
    };

    // Toggle select for multi-delete
    const toggleSelect = (id: number) => {
        setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
    };

    return (
        <CombineLayout>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {favorites.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 32 }}>No favorite recipes.</Text>
                ) : (
                    favorites.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.card}
                            onPress={() => router.push({ pathname: '/RecipeDetail', params: { recipe: item } })}
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
                            {/* Favorite button to remove */}
                            <TouchableOpacity onPress={() => removeFavorite(item.id)} style={{ marginLeft: 8 }}>
                                <FontAwesome name="heart" size={22} color="#F55" />
                            </TouchableOpacity>
                            {/* Checkbox for multi-select */}
                            <TouchableOpacity onPress={() => toggleSelect(item.id)} style={{ marginLeft: 8 }}>
                                <FontAwesome name={selectedIds.includes(item.id) ? 'check-square' : 'square-o'} size={22} color="#888" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
                {/* Multi-delete and clear all buttons */}
                {favorites.length > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Button title="Delete Selected" onPress={() => {
                            if (selectedIds.length === 0) return Alert.alert('Select recipes to delete.');
                            removeSelectedFavorites();
                        }} color="#F55" />
                        <Button title="Clear All" onPress={() => {
                            Alert.alert('Clear all favorites?', '', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'OK', onPress: clearFavorites }
                            ]);
                        }} color="#888" />
                    </View>
                )}
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