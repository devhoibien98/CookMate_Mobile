import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import * as React from "react";
import { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from '../contexts/AuthContext';

const AIGenerate = () => {
    const navigation = useNavigation();
    const { mySelectIngredients, myRecipes } = useContext(AuthContext);

    // Group recipes into rows of 2 for grid display
    const chunkArray = (arr: any[], size: number) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const recipeRows = chunkArray(myRecipes, 2);

    const convertString = mySelectIngredients.join(', ');

    return (
        <CombineLayout>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.contentArea}>
                    <Text style={styles.heresWhatWe}>
                        These are dishes from {convertString}
                    </Text>
                    <View style={styles.recipeGrid}>
                        {recipeRows.length === 0 ? (
                            <Text style={styles.noRecipeText}>No recipes found for your selected ingredients.</Text>
                        ) : (
                            recipeRows.map((row, rowIndex) => (
                                <View style={styles.recipeRow} key={rowIndex}>
                                    {row.map((recipe, colIndex) => (
                                        <TouchableOpacity
                                            key={recipe.id || colIndex}
                                            style={styles.recipeCard}
                                            activeOpacity={0.7}
                                        // onPress={() => navigation.navigate('', { recipeId: recipe.id })}
                                        >
                                            <Image
                                                style={styles.recipeImage}
                                                resizeMode="cover"
                                                source={require("../../assets/images/recipe-suggestion.png")}
                                            />
                                            <View style={styles.infoRow}>
                                                <Text style={styles.minText}>
                                                    {recipe.cookingTime ? `${recipe.cookingTime} min` : 'N/A'}
                                                </Text>
                                                <View style={styles.starsContainer}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FontAwesome
                                                            key={star}
                                                            name="star"
                                                            size={15}
                                                            color={
                                                                recipe.aiRating && recipe.aiRating >= star
                                                                    ? "gold"
                                                                    : "gray"
                                                            }
                                                        />
                                                    ))}
                                                </View>
                                            </View>
                                            <Text style={styles.recipeTitle} numberOfLines={2}>
                                                {recipe.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    {/* If row has only 1 recipe, add an empty View for alignment */}
                                    {row.length === 1 && <View style={[styles.recipeCard, { opacity: 0 }]} />}
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </CombineLayout>
    );
};

const styles = StyleSheet.create({
    userMenu: { flex: 1, backgroundColor: "#fff" },
    mu: { height: 176, width: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    muChild: { ...StyleSheet.absoluteFillObject },
    cookmate: { fontSize: 48, fontFamily: "JosefinSans-Regular", color: "#fff", position: 'absolute', top: 63, left: 97 },
    scrollViewContent: { flexGrow: 1, paddingBottom: 50 },
    contentArea: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 33, paddingHorizontal: 19 },
    heresWhatWe: { color: "#000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 26, alignSelf: 'center', width: '100%' },
    recipeGrid: {},
    recipeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    recipeCard: { width: 180, alignItems: 'flex-start' },
    recipeImage: { width: 180, height: 180, borderRadius: 5 },
    minText: { color: "#000", fontSize: 12, fontWeight: "bold" },
    starsContainer: { flexDirection: 'row' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 6, marginBottom: 4 },
    recipeTitle: { color: "#000", fontSize: 15, fontWeight: "bold", marginTop: 4 },
    noRecipeText: { color: "#888", fontSize: 16, textAlign: "center", marginTop: 40 },
});

export default AIGenerate;