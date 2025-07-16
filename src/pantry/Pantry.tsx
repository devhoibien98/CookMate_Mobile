import CombineLayout from '@/components/Component';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import React, { useContext, useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MESSAGES } from '../constants/messages';
import { CATEGORY_INFOS, PREDEFINED_INGREDIENTS } from '../constants/predefinedIngredients';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../services/axiosInstance';

type PantryStackParamList = {
    AIGenerate: undefined;
};

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const { setMySelectIngredients, setMyRecipes } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<PantryStackParamList>>();
    // Tìm kiếm tất cả thể loại trong PREDEFINED_INGREDIENTS
    const searchTerm = newIngredient.trim().toLowerCase();

    // Tạo object chứa các ingredient đã lọc theo searchTerm cho từng category
    const filteredPredefined = useMemo(() => {
        const result: Record<typeof CATEGORY_INFOS[number]['key'], string[]> = {
            animals: [],
            seafood: [],
            fruits_vegetables: [],
        };
        (Object.keys(PREDEFINED_INGREDIENTS) as typeof CATEGORY_INFOS[number]['key'][]).forEach((cat) => {
            if (!searchTerm) {
                result[cat] = PREDEFINED_INGREDIENTS[cat];
            } else {
                result[cat] = PREDEFINED_INGREDIENTS[cat].filter((ingredient) =>
                    ingredient.toLowerCase().includes(searchTerm)
                );
            }
        });
        return result;
    }, [searchTerm]);

    const addIngredient = () => {
        if (newIngredient.trim() !== '' && !ingredients.includes(newIngredient.trim())) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
        console.log('ingredients', ingredients);

    };

    // Toggle ingredient: add if not selected, remove if already selected
    const togglePredefinedIngredient = (ingredient: string) => {
        if (ingredients.includes(ingredient)) {
            setIngredients(ingredients.filter((i) => i !== ingredient));
        } else {
            setIngredients([...ingredients, ingredient]);
        }
    };

    const removeIngredient = (ingredientToRemove: string) => {
        setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove));
    }

    const generateRecipe = async () => {

        const cleanedIngredients = ingredients
            .map((i) => i.trim())
            .filter((i) => i !== '');

        if (cleanedIngredients.length === 0) {
            Alert.alert(MESSAGES.PANTRY_LABEL_ERROR, MESSAGES.PANTRY_LABEL_ERROR_DEFAULT);
            return;
        }

        if (cleanedIngredients.length > 10) {
            Alert.alert(MESSAGES.PANTRY_LABEL_ERROR_401, MESSAGES.PANTRY_LABEL_ERROR_DEFAULT_401);
            return;
        }

        const payload = { ingredients: cleanedIngredients };
        console.log('Payload gửi lên:', payload);
        try {
            const response = await axiosInstance.post('/ai/recipes/generate', payload);
            setMySelectIngredients(cleanedIngredients);
            setMyRecipes(response.data);
            navigation.navigate('AIGenerate');
            console.log('response', response.data);
        } catch (error) {
            console.log('error', error);
        }
    }


    return (
        <CombineLayout>
            <View style={styles.container}>
                {/* Ingredient Input Section */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={MESSAGES.PANTRY_LABEL_SEARCH}
                        placeholderTextColor="#888"
                        value={newIngredient}
                        onChangeText={setNewIngredient}
                        onSubmitEditing={addIngredient}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={generateRecipe}>
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Selected Ingredients Section */}
                <View style={styles.selectedIngredientsContainer}>
                    <View style={styles.selectedIngredientsHeader}>
                        <Text style={styles.selectedIngredientsTitle}>
                            Selected ingredients ({ingredients.length})
                        </Text>
                        {ingredients.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearAllButton}
                                onPress={() => setIngredients([])}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="red"
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
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
                    {CATEGORY_INFOS.map((cat) => (
                        <View style={styles.categoryCard} key={cat.key}>
                            <View style={styles.categoryHeader}>
                                <Text style={styles.categoryTitle}>{cat.label}</Text>
                            </View>
                            <View style={styles.ingredientTags}>
                                {filteredPredefined[cat.key].length === 0 ? (
                                    <Text style={styles.noIngredientsText}>No ingredients found</Text>
                                ) : (
                                    filteredPredefined[cat.key].map((ingredient, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.ingredientTag,
                                                ingredients.includes(ingredient) && styles.ingredientTagSelected,
                                            ]}
                                            onPress={() => togglePredefinedIngredient(ingredient)}
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
                                    ))
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </CombineLayout >
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
    selectedIngredientsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    selectedIngredientsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
    clearAllButton: {
        color: 'red',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    clearAllButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default App;
