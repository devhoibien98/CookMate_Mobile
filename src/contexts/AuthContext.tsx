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

interface User {
    userId: string;
    username: string;
    email: string;
    role: string;
    isDeleted: boolean;
}

type AuthContextType = {
    token: string | null;
    signIn: (newToken: string, userObj: User) => Promise<void>;
    signOut: () => Promise<void>;
    user: User;
    setUser: (user: User) => void;
    mySelectIngredients: string[];
    setMySelectIngredients: (ingredients: string[]) => void;
    myRecipes: Recipe[];
    setMyRecipes: (recipes: Recipe[]) => void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    signIn: async () => { },
    signOut: async () => { },
    user: {
        userId: '',
        username: '',
        email: '',
        role: '',
        isDeleted: false,
    },
    setUser: () => { },
    mySelectIngredients: [],
    setMySelectIngredients: () => { },
    myRecipes: [],
    setMyRecipes: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [mySelectIngredients, setMySelectIngredients] = useState<string[]>([]);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [user, setUser] = useState<User>({
        userId: '',
        username: '',
        email: '',
        role: '',
        isDeleted: false,
    });
    useEffect(() => {
        const loadAuth = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            if (storedToken) setToken(storedToken);
            if (storedUser) setUser(JSON.parse(storedUser));
        };
        loadAuth();
    }, []);

    const signIn = async (newToken: string, userObj: User) => {
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(userObj));
        setToken(newToken);
        setUser(userObj);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser({
            userId: '',
            username: '',
            email: '',
            role: '',
            isDeleted: false,
        });
    };

    return (
        <AuthContext.Provider value={{ token, signIn, signOut, mySelectIngredients, setMySelectIngredients, myRecipes, setMyRecipes, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
