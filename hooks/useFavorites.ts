import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'favoriteRecipes';

export interface Recipe {
    id: string | number;
    name?: string;
    title?: string;
    rating?: number;
    aiRating?: number;
    ingredients?: string[] | number;
    description?: string;
    cookingTime?: number;
    nutritionInfo?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    };
    cookingSteps?: {
        stepNumber: number;
        description: string;
    }[];
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Utility function to remove duplicates from favorites array
    const removeDuplicates = React.useCallback((recipes: Recipe[]): Recipe[] => {
        return recipes.filter((recipe, index, self) =>
            index === self.findIndex((r) => r.id === recipe.id)
        );
    }, []);

    // Validate recipe data before adding
    const validateRecipe = React.useCallback((recipe: Recipe): boolean => {
        if (!recipe || !recipe.id) {
            console.error('Invalid recipe: missing id');
            return false;
        }

        if (!recipe.name && !recipe.title) {
            console.error('Invalid recipe: missing name and title');
            return false;
        }

        return true;
    }, []);

    // Normalize recipe data to ensure consistency
    const normalizeRecipe = React.useCallback((recipe: Recipe): Recipe => {
        return {
            id: recipe.id,
            name: recipe.name || recipe.title || 'Tên món ăn không xác định',
            title: recipe.title || recipe.name || 'Tên món ăn không xác định',
            rating: recipe.rating || recipe.aiRating || 0,
            aiRating: recipe.aiRating || recipe.rating || 0,
            ingredients: recipe.ingredients || [],
            description: recipe.description || '',
            cookingTime: recipe.cookingTime || 0,
            nutritionInfo: recipe.nutritionInfo || {},
            cookingSteps: recipe.cookingSteps || [],
        };
    }, []);

    // Load favorites from AsyncStorage
    const loadFavorites = React.useCallback(async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                const parsedFavorites = JSON.parse(json);

                // Remove duplicates based on ID
                const uniqueFavorites = removeDuplicates(parsedFavorites);

                // If duplicates were found and removed, save the cleaned data
                if (uniqueFavorites.length !== parsedFavorites.length) {
                    console.error('Found and removed duplicate favorites');
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueFavorites));
                }

                setFavorites(uniqueFavorites);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    }, [removeDuplicates]);

    // Initial load and refresh when trigger changes
    useEffect(() => {
        loadFavorites();
    }, [loadFavorites, refreshTrigger]);

    // Save favorites to AsyncStorage
    const saveFavorites = React.useCallback(async (newFavorites: Recipe[]) => {
        try {
            // Ensure no duplicates before saving
            const uniqueFavorites = removeDuplicates(newFavorites);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueFavorites));
            setFavorites(uniqueFavorites);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }, [removeDuplicates]);

    // Add recipe to favorites
    const addToFavorites = React.useCallback(async (recipe: Recipe) => {
        // Validate recipe data
        if (!validateRecipe(recipe)) {
            return;
        }

        // Check if recipe already exists to prevent duplicates
        const existingRecipe = favorites.find(fav => fav.id === recipe.id);
        if (existingRecipe) {
            console.error('Recipe already exists in favorites:', recipe.id);
            return;
        }

        // Normalize recipe data for consistency
        const normalizedRecipe = normalizeRecipe(recipe);
        const updatedFavorites = [...favorites, normalizedRecipe];
        await saveFavorites(updatedFavorites);
    }, [favorites, saveFavorites, validateRecipe, normalizeRecipe]);

    // Remove recipe from favorites
    const removeFromFavorites = React.useCallback(async (recipeId: string | number) => {
        const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
        await saveFavorites(updatedFavorites);
    }, [favorites, saveFavorites]);

    // Toggle favorite status
    const toggleFavorite = React.useCallback(async (recipe: Recipe) => {
        const isFavorite = favorites.some(fav => fav.id === recipe.id);

        if (isFavorite) {
            await removeFromFavorites(recipe.id);
        } else {
            await addToFavorites(recipe);
        }
    }, [favorites, addToFavorites, removeFromFavorites]);

    // Check if recipe is favorite
    const isFavorite = React.useCallback((recipeId: string | number) => {
        return favorites.some(recipe => recipe.id === recipeId);
    }, [favorites]);

    // Remove multiple favorites
    const removeMultipleFavorites = React.useCallback(async (recipeIds: (string | number)[]) => {
        const updatedFavorites = favorites.filter(recipe => !recipeIds.includes(recipe.id));
        await saveFavorites(updatedFavorites);
    }, [favorites, saveFavorites]);

    // Clear all favorites
    const clearAllFavorites = React.useCallback(async () => {
        await saveFavorites([]);
    }, [saveFavorites]);

    // Refresh favorites - this is the key function for useFocusEffect
    const refreshFavorites = React.useCallback(async () => {
        setIsLoading(true);
        await loadFavorites();
    }, [loadFavorites]);

    // Force refresh by incrementing trigger
    const forceRefresh = React.useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // Clear favorites from AsyncStorage completely
    const clearFavoritesStorage = React.useCallback(async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setFavorites([]);
        } catch (error) {
            console.error('Error clearing favorites storage:', error);
        }
    }, []);

    // Clean up duplicates manually
    const cleanupDuplicates = React.useCallback(async () => {
        try {
            const uniqueFavorites = removeDuplicates(favorites);
            if (uniqueFavorites.length !== favorites.length) {
                await saveFavorites(uniqueFavorites);
                console.error('Cleaned up duplicate favorites');
            }
        } catch (error) {
            console.error('Error cleaning up duplicates:', error);
        }
    }, [favorites, removeDuplicates, saveFavorites]);

    return {
        favorites,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        removeMultipleFavorites,
        clearAllFavorites,
        refreshFavorites,
        forceRefresh,
        clearFavoritesStorage,
        cleanupDuplicates,
    };
}; 