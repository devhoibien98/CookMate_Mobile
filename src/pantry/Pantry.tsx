import CombineLayout from '@/components/Component';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Define the type for an ingredient
interface Ingredient {
    id: string;
    name: string;
    category: 'animals' | 'seafood' | 'fruits_vegetables';
}

// Define the type for a navigation tab
interface Tab {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>('');

    // Sample data for predefined ingredients
    const predefinedIngredients = {
        animals: [
            'Chicken',
            'Duck',
            'Goose',
            'Turkey',
            'Pork',
            'Pork belly',
            'Pork shoulder',
            'Beef',
            'Veal (young beef)',
            'Lamb',
            'Goat meat',
            'Rabbit meat',
            'Chicken eggs',
            'Duck eggs',
            'Quail eggs',
        ],
        seafood: [
            'Shrimp',
            'Prawn',
            'Crab',
            'Lobster',
            'Crawfish',
            'Squid',
            'Cuttlefish',
            'Octopus',
            'Tuna',
            'Clam',
            'Scallop',
            'Mussel',
            'Oyster',
            'Snail',
            'Salmon',
            'Mackerel',
            'Anchovy',
            'Catfish',
        ],
        fruits_vegetables: [],
    };

    const addIngredient = () => {
        if (newIngredient.trim() !== '' && !ingredients.includes(newIngredient.trim())) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const selectPredefinedIngredient = (ingredient: string) => {
        if (!ingredients.includes(ingredient)) {
            setIngredients([...ingredients, ingredient]);
        }
    };

    const removeIngredient = (ingredientToRemove: string) => {
        setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove));
    };

    const navigationTabs: Tab[] = [
        { name: 'Pantry', icon: 'cube-outline' },
    ];

    return (
        <CombineLayout>
            <View style={styles.container}>
                {/* Ingredient Input Section */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add ingredients..."
                        placeholderTextColor="#888"
                        value={newIngredient}
                        onChangeText={setNewIngredient}
                        onSubmitEditing={addIngredient}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Selected Ingredients Section */}
                <View style={styles.selectedIngredientsContainer}>
                    <Text style={styles.selectedIngredientsTitle}>
                        Selected ingredients ({ingredients.length})
                    </Text>
                    <View style={styles.selectedIngredientsTags}>
                        {ingredients.map((ingredient, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.selectedIngredientTag}
                                onPress={() => removeIngredient(ingredient)}
                            >
                                <Text style={styles.selectedIngredientText}>{ingredient}</Text>
                                <Ionicons
                                    name="close-circle"
                                    size={16}
                                    color="#fff"
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Ingredient Categories Section */}
                <ScrollView style={styles.categoriesScroll}>
                    {/* Main ingredients from animals */}
                    <View style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <Image
                                source={{ uri: 'https://placehold.co/24x24/000000/FFFFFF?text=🍖' }}
                                style={styles.categoryIcon}
                            />
                            <Text style={styles.categoryTitle}>Main ingredients from animals</Text>
                        </View>
                        <View style={styles.ingredientTags}>
                            {predefinedIngredients.animals.map((ingredient, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.ingredientTag,
                                        ingredients.includes(ingredient) && styles.ingredientTagSelected,
                                    ]}
                                    onPress={() => selectPredefinedIngredient(ingredient)}
                                >
                                    <Text
                                        style={[
                                            styles.ingredientTagText,
                                            ingredients.includes(ingredient) && styles.ingredientTagTextSelected,
                                        ]}
                                    >
                                        {ingredient}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Seafood */}
                    <View style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <Image
                                source={{ uri: 'https://placehold.co/24x24/000000/FFFFFF?text=🦐' }}
                                style={styles.categoryIcon}
                            />
                            <Text style={styles.categoryTitle}>Seafood</Text>
                        </View>
                        <View style={styles.ingredientTags}>
                            {predefinedIngredients.seafood.map((ingredient, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.ingredientTag,
                                        ingredients.includes(ingredient) && styles.ingredientTagSelected,
                                    ]}
                                    onPress={() => selectPredefinedIngredient(ingredient)}
                                >
                                    <Text
                                        style={[
                                            styles.ingredientTagText,
                                            ingredients.includes(ingredient) && styles.ingredientTagTextSelected,
                                        ]}
                                    >
                                        {ingredient}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Fruits and Vegetables */}
                    <View style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <Image
                                source={{ uri: 'https://placehold.co/24x24/000000/FFFFFF?text=🍎' }}
                                style={styles.categoryIcon}
                            />
                            <Text style={styles.categoryTitle}>Fruits and Vegetables</Text>
                        </View>
                        <View style={styles.ingredientTags}>
                            <Text style={styles.noIngredientsText}>No ingredients listed.</Text>
                        </View>
                    </View>
                </ScrollView>


            </View>
        </CombineLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Inter_900Black',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -25,
        zIndex: 1,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButton: {
        backgroundColor: '#FF6347',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedIngredientsContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    selectedIngredientsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    selectedIngredientsTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    selectedIngredientTag: {
        flexDirection: 'row',
        backgroundColor: '#FF6347',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    selectedIngredientText: {
        color: '#fff',
        fontSize: 14,
        marginRight: 5,
    },
    closeIcon: {
        marginLeft: 5,
    },
    categoriesScroll: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    ingredientTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ingredientTag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    ingredientTagSelected: {
        backgroundColor: '#FF6347',
        borderColor: '#FF6347',
    },
    ingredientTagText: {
        color: '#555',
        fontSize: 14,
    },
    ingredientTagTextSelected: {
        color: '#fff',
    },
    noIngredientsText: {
        color: '#888',
        fontSize: 14,
        fontStyle: 'italic',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    navTab: {
        alignItems: 'center',
        padding: 5,
    },
    navTabText: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    navTabTextActive: {
        color: '#FF6347',
        fontWeight: 'bold',
    },
});

export default App;
