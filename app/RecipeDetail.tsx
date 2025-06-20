import { Feather, FontAwesome } from '@expo/vector-icons';
import * as React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const RecipeDetail = () => {
  return (
      <ScrollView>
        <Image style={styles.image} resizeMode="cover" source={require("../assets/images/recipedetail.png")} />

        {/* Card Intro */}
        <View style={styles.cardIntro}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View style={{flex: 1}}>
              <Text style={styles.title}>The Fluffiest Vegan Pancakes</Text>
              <Text style={styles.subtitle}>You have all the ingredients</Text>
              <View style={{flexDirection: "row", alignItems: "center", marginTop: 8}}>
                <FontAwesome name="star" size={18} color="#FFD700" />
                <FontAwesome name="star" size={18} color="#FFD700" />
                <FontAwesome name="star" size={18} color="#FFD700" />
                <FontAwesome name="star" size={18} color="#FFD700" />
                <FontAwesome name="star" size={18} color="#eee" />
                <Feather name="clock" size={16} color="#888" style={{marginLeft: 16}} />
                <Text style={styles.timeText}>8 mins</Text>
              </View>
            </View>
            <FontAwesome name="heart-o" size={22} color="#888" />
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientTable}>
          {[
            ["flour", "125g"],
            ["organic sugar", "2 tablespoons"],
            ["baking powder", "1 tablespoon"],
            ["salt", "1/2 teaspoon"],
            ["non-diary milk", "240ml  mL"]
          ].map(([name, value], idx, arr) => (
            <View key={name} style={[styles.ingredientRow, idx < arr.length-1 && styles.ingredientRowBorder]}>
              <Text style={styles.ingredientName}>{name}</Text>
              <Text style={styles.ingredientValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Nutrition */}
        <Text style={styles.sectionTitle}>Nutrition</Text>
        <View style={styles.cardNutrition}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Cal</Text><Text style={styles.nutritionValueBold}>299</Text></View>
            <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Protein</Text><Text style={styles.nutritionValueBold}>12g</Text></View>
            <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Fat</Text><Text style={styles.nutritionValueBold}>15g</Text></View>
            <View style={styles.nutritionCol}><Text style={styles.nutritionLabel}>Carb</Text><Text style={styles.nutritionValueBold}>34g</Text></View>
          </View>
        </View>

        {/* Instruction */}
        <Text style={styles.sectionTitle}>Instruction</Text>
        {[1,2,3].map((step) => (
          <View key={step} style={styles.cardStep}>
            <Text style={styles.stepNumber}>{step}</Text>
            <Text style={styles.stepText}>In a medium bowl, add the flour, sugar, baking powder, and salt, and stir to combine.</Text>
          </View>
        ))}
      </ScrollView>
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
  sectionTitle: { fontWeight: "bold", fontSize: 17, marginTop: 32, marginBottom: 12, marginLeft: 16 },
  ingredientTable: { backgroundColor: "#fff", marginHorizontal: 0, borderRadius: 8, overflow: "hidden", marginBottom: 8, marginTop: 0 },
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

export default RecipeDetail;