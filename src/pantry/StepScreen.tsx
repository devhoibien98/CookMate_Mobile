import CombineLayout from '@/components/Component';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import * as React from "react";
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axiosInstance from '../services/axiosInstance';


interface Step {
    step: number;
    description: string;
}

const StepScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id, name } = route.params as { id: string, name: string };
    const [steps, setSteps] = useState<Step[]>([]);
    useFocusEffect(
        useCallback(() => {
            const getSteps = async () => {
                try {
                    const getStepsDetails = await axiosInstance.get(`/ai/recipes/${id}/cooking-steps`);
                    setSteps(getStepsDetails.data);
                } catch (error) {
                    console.log('error', error);
                }
            };
            getSteps();
        }, [id])
    );
    console.log('steps', steps)

    return (

        <CombineLayout>
            <ScrollView>
                <TouchableOpacity
                    style={{ margin: 16, alignSelf: 'flex-start' }}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back-outline" size={28} color="black" />
                </TouchableOpacity>

                {/* Instruction */}
                <Text style={styles.sectionTitle}>Steps to make {name}</Text>
                {(steps && steps.length > 0 ? steps : [{ step: 1, description: 'No steps.' }]).map((step: Step, index) => (
                    <View key={index} style={styles.cardStep}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                        <Text style={styles.stepText}>{step.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </CombineLayout>
    );
};

const styles = StyleSheet.create({
    image: { width: "100%", height: 220 },
    cardIntro: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: -32,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 2
    },
    title: { fontWeight: "bold", fontSize: 18, marginBottom: 2 },
    subtitle: { color: "#888", fontSize: 14 },
    timeText: { color: "#888", fontSize: 14, marginLeft: 4 },
    sectionTitle: { fontWeight: "bold", fontSize: 17, marginTop: 15, marginBottom: 12, marginLeft: 16 },
    ingredientTable: { backgroundColor: "#fff", marginHorizontal: 0, borderRadius: 0, overflow: "hidden", marginBottom: 8, marginTop: 0 },
    ingredientRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
    ingredientRowBorder: { borderBottomWidth: 1, borderColor: "#eee" },
    ingredientName: { color: "#888", fontSize: 15 },
    ingredientValue: { color: "#888", fontSize: 15 },
    cardNutrition: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "center"
    },
    nutritionRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    nutritionCol: { flex: 1, alignItems: "center" },
    nutritionLabel: { color: "#888", fontWeight: "bold", fontSize: 15, marginBottom: 2 },
    nutritionValueBold: { fontWeight: "bold", fontSize: 16, color: "#222" },
    cardStep: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2
    },
    stepNumber: {
        fontWeight: "bold",
        fontSize: 18,
        width: 28,
        height: 28,
        textAlign: "center",
        textAlignVertical: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        marginRight: 12,
        marginTop: 2
    },
    stepText: { fontSize: 15, color: "#222", flex: 1 }
});

export default StepScreen;