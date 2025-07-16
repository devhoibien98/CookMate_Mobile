import CombineLayout from '@/components/Component';
import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/hooks/useFavorites';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FavouriteScreen = () => {
    const router = useRouter();
    const { favorites, isLoading, removeFromFavorites, clearAllFavorites, removeMultipleFavorites, refreshFavorites } = useFavorites();
    const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            // Reset selected items when screen is focused
            setSelectedIds([]);
            // Refresh favorites data
            refreshFavorites();
        }, [refreshFavorites])
    );

    // Toggle select for multi-delete
    const toggleSelect = (id: string | number) => {
        setSelectedIds(ids =>
            ids.includes(id)
                ? ids.filter(i => i !== id)
                : [...ids, id]
        );
    };

    // Remove selected favorites
    const handleRemoveSelected = async () => {
        if (selectedIds.length === 0) {
            Alert.alert('Thông báo', 'Hãy chọn món ăn cần xóa.');
            return;
        }

        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa ${selectedIds.length} món ăn đã chọn?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        await removeMultipleFavorites(selectedIds);
                        setSelectedIds([]);
                    }
                }
            ]
        );
    };

    // Clear all favorites
    const handleClearAll = () => {
        Alert.alert(
            'Xác nhận xóa tất cả',
            'Bạn có chắc chắn muốn xóa tất cả món ăn yêu thích?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa tất cả',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllFavorites();
                        setSelectedIds([]);
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <CombineLayout>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Đang tải...</Text>
                </View>
            </CombineLayout>
        );
    }

    return (
        <CombineLayout>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {favorites.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                        <FontAwesome name="heart-o" size={64} color="#ccc" />
                        <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 16, color: '#888' }}>
                            Chưa có món ăn yêu thích nào
                        </Text>
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 14, color: '#aaa' }}>
                            Nhấn vào biểu tượng trái tim để thêm món ăn vào danh sách yêu thích
                        </Text>
                    </View>
                ) : (
                    <>
                        {favorites.map((item) => {
                            // Handle data inconsistencies - some recipes have 'title' instead of 'name'
                            const recipeName = item.name || item.title || 'Tên món ăn không xác định';
                            const recipeIngredients = item.ingredients || [];
                            const recipeRating = item.rating || item.aiRating || 0;

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.card,
                                        selectedIds.includes(item.id) && styles.selectedCard
                                    ]}
                                    onPress={() => {
                                        const recipeString = JSON.stringify(item);
                                        router.push({
                                            pathname: '/RecipeDetail',
                                            params: { recipe: recipeString }
                                        });
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../../assets/images/recipe-suggestion.png')}
                                        style={styles.cardImage}
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.cardTitle}>{recipeName}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <FontAwesome
                                                    key={i}
                                                    name="star"
                                                    size={16}
                                                    color={i <= recipeRating ? '#FFD700' : '#eee'}
                                                />
                                            ))}
                                        </View>
                                        <Text style={styles.cardSubtitle}>
                                            {Array.isArray(recipeIngredients) && recipeIngredients.length > 0
                                                ? `${recipeIngredients.length} nguyên liệu`
                                                : 'Chưa có thông tin nguyên liệu'
                                            }
                                        </Text>
                                    </View>

                                    {/* Favorite button to remove */}
                                    <FavoriteButton
                                        isFavorite={true}
                                        onPress={() => {
                                            removeFromFavorites(item.id);
                                        }}
                                        style={{ marginLeft: 8 }}
                                    />

                                    {/* Checkbox for multi-select */}
                                    <TouchableOpacity
                                        onPress={() => toggleSelect(item.id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        <FontAwesome
                                            name={selectedIds.includes(item.id) ? 'check-square' : 'square-o'}
                                            size={22}
                                            color="#888"
                                        />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Action buttons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                            <Button
                                title={`Xóa đã chọn (${selectedIds.length})`}
                                onPress={handleRemoveSelected}
                                color="#F55"
                                disabled={selectedIds.length === 0}
                            />
                            <Button
                                title="Xóa tất cả"
                                onPress={handleClearAll}
                                color="#888"
                            />
                        </View>
                    </>
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
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#4CAF50',
        backgroundColor: '#f0f8ff',
    },
    cardImage: { width: 80, height: 80, borderRadius: 8 },
    cardTitle: { fontWeight: 'bold', fontSize: 16 },
    cardSubtitle: { color: '#888', fontSize: 13, marginTop: 4 },
});

export default FavouriteScreen; 