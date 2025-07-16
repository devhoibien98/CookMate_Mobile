import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/hooks/useFavorites';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import * as React from "react";
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axiosInstance from '../services/axiosInstance';

interface Step {
    step: number;
    description: string;
    recipeId: string
}

interface Recipe {
    id: string;
    name: string;
    cookingTime: number;
    aiRating: number;
    description: string;
}

const StepScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id, recipe } = route.params as { id: string, recipe: Recipe };
    const [steps, setSteps] = useState<Step[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toggleFavorite, isFavorite } = useFavorites();

    useFocusEffect(
        useCallback(() => {
            const getSteps = async () => {
                setLoading(true);
                try {
                    const getStepsDetails = await axiosInstance.get(`/ai/recipes/${id}/cooking-steps`);
                    setSteps(getStepsDetails.data);
                } catch (error) {
                    console.log('error', error);
                } finally {
                    setLoading(false);
                }
            };
            getSteps();
        }, [id])
    );

    return (
        <ScrollView>
            <View style={styles.imageContainer}>
                <Image style={styles.image} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                <TouchableOpacity
                    style={styles.nutsButton}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 20, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back-outline" size={23} color="white" />
                </TouchableOpacity>
            </View>
            {/* Card Intro */}
            <View style={styles.cardIntro}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{recipe?.name}</Text>
                        <Text style={styles.subtitle}>{recipe?.description || ''}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <FontAwesome key={i} name="star" size={18} color={i <= Math.round(recipe?.aiRating) ? "#FFD700" : "#eee"} />
                            ))}
                            <Feather name="clock" size={16} color="#888" style={{ marginLeft: 16 }} />
                            <Text style={styles.timeText}>{recipe?.cookingTime ? `${recipe?.cookingTime} mins` : ''}</Text>
                        </View>
                    </View>
                    <FavoriteButton
                        isFavorite={isFavorite(recipe.id)}
                        onPress={() => toggleFavorite(recipe)}
                        style={{ marginLeft: 8 }}
                    />
                </View>
            </View>
            {/* Instruction */}
            <Text style={styles.sectionTitle}>Steps to make {recipe?.name}</Text>
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                    <ActivityIndicator size="large" color="#888" />
                </View>
            ) : (
                (steps && steps.length > 0 ? steps : [{ step: 1, description: 'No steps.', recipeId: '' }]).map((step: Step, index) => (
                    <View key={index} style={styles.cardStep}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        <Text style={styles.stepText}>{step.description}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
        marginBottom: 0,
    },
    image: { width: "100%", height: 220 },
    nutsButton: {
        position: 'absolute',
        top: 35,
        left: 20,
        zIndex: 10,
        borderRadius: 20,
        padding: 4,
    },
    cardIntro: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: -32,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 2
    },
    title: { fontWeight: "bold", fontSize: 18, marginBottom: 2 },
    subtitle: { color: "#888", fontSize: 14 },
    timeText: { color: "#888", fontSize: 14, marginLeft: 4 },
    sectionTitle: { fontWeight: "bold", fontSize: 17, marginTop: 15, marginBottom: 12, marginLeft: 16 },
    ingredientTable: { backgroundColor: "#fff", marginHorizontal: 0, borderRadius: 0, overflow: "hidden", marginBottom: 8, marginTop: 0 },
    ingredientRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
    ingredientRowBorder: { borderBottomWidth: 1, borderColor: "#eee" },
    ingredientName: { color: "#888", fontSize: 15 },
    ingredientValue: { color: "#888", fontSize: 15 },
    cardNutrition: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "center"
    },
    nutritionRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    nutritionCol: { flex: 1, alignItems: "center" },
    nutritionLabel: { color: "#888", fontWeight: "bold", fontSize: 15, marginBottom: 2 },
    nutritionValueBold: { fontWeight: "bold", fontSize: 16, color: "#222" },
    cardStep: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2
    },
    stepNumber: {
        fontWeight: "bold",
        fontSize: 18,
        width: 28,
        height: 28,
        textAlign: "center",
        textAlignVertical: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        marginRight: 12,
        marginTop: 2
    },
    stepText: { fontSize: 15, color: "#222", flex: 1 }
});

export default StepScreen;