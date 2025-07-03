import CombineLayout from '@/components/Component';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const API_URL = 'https://cookmate-api.lighttail.com/recipes?page=1&limit=100';

const AllRecipes = () => {
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(10);
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const navigation = useNavigation();

  useLayoutEffect (() => {
      navigation.setOptions({ title: 'All Recipes'});
    }, [navigation]);

  // TODO: Thay thế bằng logic kiểm tra đăng nhập thực tế của app bạn
  const isLoggedIn = false; // Giả lập chưa đăng nhập

  React.useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <CombineLayout>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentArea}>
          <Text style={styles.heresWhatWe}>All Recipes</Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 32 }} />
          ) : (
            <>
            <View style={styles.recipeGrid}>
              {recipes.slice(0, visibleCount).reduce((rows: any[][], recipe: any, idx: number) => {
                if (idx % 2 === 0) rows.push([recipe]);
                else rows[rows.length - 1].push(recipe);
                return rows;
              }, []).map((row: any[], rowIdx: number) => (
                <View style={styles.recipeRow} key={rowIdx}>
                  {row.map((recipe: any) => (
                    <TouchableOpacity key={recipe.id} activeOpacity={0.7} onPress={() => navigation.navigate('RecipeDetail', { recipe })}>
                      <View style={styles.recipeCard}>
                        <Image style={styles.recipeImage} resizeMode="cover" source={require("../assets/images/recipe-suggestion.png")} />
                        <View style={styles.infoRow}>
                          <Text style={styles.minText}>{recipe.cookingTime ? `${recipe.cookingTime} min` : ''}</Text>
                          <View style={styles.starsContainer}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FontAwesome
                                key={i}
                                name="star"
                                size={15}
                                color={i < Math.round(recipe.aiRating) ? 'gold' : 'gray'}
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.recipeTitle}>{recipe.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
            {recipes.length > visibleCount && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  if (!isLoggedIn) {
                    setShowLoginPrompt(true);
                  } else {
                    setVisibleCount(visibleCount + 10);
                  }
                }}
              >
                <Text style={styles.moreButtonText}>More</Text>
              </TouchableOpacity>
            )}
            {showLoginPrompt && (
              <View style={styles.loginPromptContainer}>
                <Text style={styles.loginPromptText}>Please log in to see more recipes.</Text>
                {/* Có thể thêm nút chuyển hướng sang trang đăng nhập ở đây */}
                <TouchableOpacity onPress={() => setShowLoginPrompt(false)}>
                  <Text style={{ color: 'blue', marginTop: 8 }}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
            </>
          )}
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
  moreButton: { marginTop: 16, alignSelf: 'center', backgroundColor: '#f5a623', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  moreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginPromptContainer: { marginTop: 16, alignSelf: 'center', backgroundColor: '#fffbe6', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#f5a623', alignItems: 'center' },
  loginPromptText: { color: '#f5a623', fontWeight: 'bold', fontSize: 16 },
});

export default AllRecipes;

