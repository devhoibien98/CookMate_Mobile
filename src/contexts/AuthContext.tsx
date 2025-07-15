import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

type AuthContextType = {
    token: string | null;
    signIn: (newToken: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    signIn: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

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
        <AuthContext.Provider value={{ token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
