import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MenuScreen = () => {
  const router = useRouter();

  return (
    <CombineLayout>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentArea}>
          <Text style={styles.heresWhatWe}>Here's what we recommend for you!</Text>
          <View style={styles.recipeGrid}>
            {/* Row 1 */}
            <View style={styles.recipeRow}>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>The Fluffiest Vegan Pancakes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>Peanut Butter</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Row 2 */}
            <View style={styles.recipeRow}>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>Chicken Noodle Soup</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>Easy Glazed Pork Chops</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Row 3 */}
            <View style={styles.recipeRow}>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>The Fluffiest Vegan Pancakes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/RecipeDetail')} activeOpacity={0.7}>
                <View style={styles.recipeCard}>
                  <Image style={styles.recipeImage} resizeMode="cover" source={require("../../assets/images/recipe-suggestion.png")} />
                  <View style={styles.infoRow}>
                    <Text style={styles.minText}>35 min</Text>
                    <View style={styles.starsContainer}>
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gold" />
                      <FontAwesome name="star" size={15} color="gray" />
                      <FontAwesome name="star" size={15} color="gray" />
                    </View>
                  </View>
                  <Text style={styles.recipeTitle}>Peanut Butter</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </CombineLayout>
  );
};

const styles = StyleSheet.create({
  userMenu: { flex: 1, backgroundColor: "#fff" },
  mu: { height: 176, width: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  muChild: { ...StyleSheet.absoluteFillObject },
  cookmate: { fontSize: 48, fontFamily: "JosefinSans-Regular", color: "#fff", position: 'absolute', top: 63, left: 97 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 50 },
  contentArea: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 33, paddingHorizontal: 19 },
  heresWhatWe: { color: "#000", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 26, alignSelf: 'center', width: '100%' },
  recipeGrid: {},
  recipeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  recipeCard: { width: 180, alignItems: 'flex-start' },
  recipeImage: { width: 180, height: 180, borderRadius: 5 },
  minText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  starsContainer: { flexDirection: 'row' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 6, marginBottom: 4 },
  recipeTitle: { color: "#000", fontSize: 15, fontWeight: "bold", marginTop: 4 },
});

export default MenuScreen;