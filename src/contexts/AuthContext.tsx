import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    origin: string;
    cookingTime: number;
    complexity: string;
    aiRating: number;
    totalCalories: number | null;
    createdAt: string;
    updatedAt: string;
    warnings: string[];
}


type AuthContextType = {
    token: string | null;
    signIn: (newToken: string) => Promise<void>;
    signOut: () => Promise<void>;
    mySelectIngredients: string[];
    setMySelectIngredients: (ingredients: string[]) => void;
    myRecipes: Recipe[];
    setMyRecipes: (recipes: Recipe[]) => void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    signIn: async () => { },
    signOut: async () => { },
    mySelectIngredients: [],
    setMySelectIngredients: () => { },
    myRecipes: [],
    setMyRecipes: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [mySelectIngredients, setMySelectIngredients] = useState<string[]>([]);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        };
        loadToken();
    }, []);

    const signIn = async (newToken: string) => {
        await AsyncStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, signIn, signOut, mySelectIngredients, setMySelectIngredients, myRecipes, setMyRecipes }}>
            {children}
        </AuthContext.Provider>
    );
};
