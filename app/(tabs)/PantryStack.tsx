import AIGenerate from '@/src/pantry/AIGenerate';
import Pantry from '@/src/pantry/Pantry';
import StepScreen from '@/src/pantry/StepScreen';
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
            <Stack.Screen
                name="AIGenerate"
                component={AIGenerate}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="StepScreen"
                component={StepScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )

}