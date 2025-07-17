import FloatingAIButton from "@/src/components/ai/FloatingAIButton";
import HomeMainScreen from "@/src/screens/home/HomeMainScreen";
import React from "react";
import { View } from "react-native";

export default function RootScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HomeMainScreen />
      <FloatingAIButton />
    </View>
  );
}
