import Pantry from '@/src/pantry/Pantry';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();
export default function PantryStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Pantry"
                component={Pantry}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )

}