import HomeMainScreen from '@/src/screens/home/HomeMainScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';



const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeMainScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
} 