import CombineLayout from "@/components/Component";
import { AuthContext } from "@/src/contexts/AuthContext";
import { addToHistory } from "@/utils/asyncStorageUtils";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = { RecipeDetail: { recipe: any } };

const API_URL = "https://cookmate-api.lighttail.com/recipes?page=1&limit=10000";

const AllRecipes = () => {
  const [recipes, setRecipes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "RecipeDetail">
    >();
  const router = useRouter();
  const { token, user } = React.useContext(AuthContext);
  const isLoggedIn = !!token;

  const RECIPES_PER_PAGE = 10;
  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

  React.useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Tính toán recipes cho trang hiện tại
  const paginatedRecipes = recipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );

  // Khi chưa login, chỉ cho xem trang đầu tiên và không cho chuyển trang

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
                {paginatedRecipes
                  .reduce((rows: any[][], recipe: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([recipe]);
                    else rows[rows.length - 1].push(recipe);
                    return rows;
                  }, [])
                  .map((row: any[], rowIdx: number) => (
                    <View style={styles.recipeRow} key={rowIdx}>
                      {row.map((recipe: any) => (
                        <TouchableOpacity
                          key={recipe.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            if (user?.userId) {
                              addToHistory(user.userId, {
                                id: recipe.id,
                                title: recipe.name,
                                image: require("../assets/images/recipe-suggestion.png"),
                                rating: recipe.aiRating || 0,
                                ingredientsInfo: recipe.ingredients
                                  ? `You have all ${recipe.ingredients.length} ingredients`
                                  : "",
                              });
                            }
                            navigation.navigate("RecipeDetail", { recipe });
                          }}
                        >
                          <View style={styles.recipeCard}>
                            <Image
                              style={styles.recipeImage}
                              resizeMode="cover"
                              source={require("../assets/images/recipe-suggestion.png")}
                            />
                            <View style={styles.infoRow}>
                              <Text style={styles.minText}>
                                {recipe.cookingTime
                                  ? `${recipe.cookingTime} min`
                                  : ""}
                              </Text>
                              <View style={styles.starsContainer}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <FontAwesome
                                    key={i}
                                    name="star"
                                    size={15}
                                    color={
                                      i < Math.round(recipe.aiRating)
                                        ? "gold"
                                        : "gray"
                                    }
                                  />
                                ))}
                              </View>
                            </View>
                            <Text style={styles.recipeTitle}>
                              {recipe.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
              </View>
              {/* Pagination controls chỉ hiện khi đã login */}
              {isLoggedIn && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 16,
                  }}
                >
                  <TouchableOpacity
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                    disabled={currentPage === 1}
                    onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <EvilIcons name="arrow-left" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 16, fontWeight: "bold" }}>
                    {currentPage} / {totalPages || 1}
                  </Text>
                  <TouchableOpacity
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                    disabled={currentPage === totalPages}
                    onPress={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <EvilIcons name="arrow-right" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
              {/* Nếu chưa login, vẫn giữ nút More như cũ */}
              {!isLoggedIn && recipes.length > RECIPES_PER_PAGE && (
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setShowLoginPrompt(true)}
                >
                  <Text style={styles.moreButtonText}>More</Text>
                </TouchableOpacity>
              )}
              {showLoginPrompt && (
                <View style={styles.loginPromptContainer}>
                  <Text style={styles.loginPromptText}>
                    Please log in to see more recipes.
                  </Text>
                  <TouchableOpacity onPress={() => setShowLoginPrompt(false)}>
                    <Text style={{ color: "blue", marginTop: 8 }}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowLoginPrompt(false);
                      router.push("/profile");
                    }}
                  >
                    <Text
                      style={{
                        color: "#E44B15",
                        marginTop: 8,
                        fontWeight: "bold",
                      }}
                    >
                      Go to Login
                    </Text>
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
  mu: {
    height: 176,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  muChild: { ...StyleSheet.absoluteFillObject },
  cookmate: {
    fontSize: 48,
    fontFamily: "JosefinSans-Regular",
    color: "#fff",
    position: "absolute",
    top: 63,
    left: 97,
  },
  scrollViewContent: { flexGrow: 1, paddingBottom: 50 },
  contentArea: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 33,
    paddingHorizontal: 19,
  },
  heresWhatWe: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 26,
    alignSelf: "center",
    width: "100%",
  },
  recipeGrid: {},
  recipeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  recipeCard: { width: 180, alignItems: "flex-start" },
  recipeImage: { width: 180, height: 180, borderRadius: 5 },
  minText: { color: "#000", fontSize: 12, fontWeight: "bold" },
  starsContainer: { flexDirection: "row" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 6,
    marginBottom: 4,
  },
  recipeTitle: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },
  moreButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#f5a623",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  moreButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loginPromptContainer: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#fffbe6",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f5a623",
    alignItems: "center",
  },
  loginPromptText: { color: "#f5a623", fontWeight: "bold", fontSize: 16 },
});

export default AllRecipes;
