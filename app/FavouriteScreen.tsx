import CombineLayout from "@/components/Component";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const STORAGE_KEY = "favoriteRecipes";

const FavouriteScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false);

  // Load favorites from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        try {
          const json = await AsyncStorage.getItem(STORAGE_KEY);
          if (json) setFavorites(JSON.parse(json));
        } catch (e) {}
      };
      loadFavorites();
    }, [])
  );

  // Save favorites to AsyncStorage
  const saveFavorites = async (newFavs: any[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
  };

  // Remove one favorite
  const removeFavorite = async (id: number) => {
    const newFavs = favorites.filter((f) => f.id !== id);
    await saveFavorites(newFavs);
  };

  // Remove selected favorites
  const removeSelectedFavorites = async () => {
    const newFavs = favorites.filter((f) => !selectedIds.includes(f.id));
    await saveFavorites(newFavs);
    setSelectedIds([]);
  };

  // Remove all favorites
  const clearFavorites = async () => {
    await saveFavorites([]);
    setSelectedIds([]);
  };

  // Toggle select cho multi-delete
  const toggleSelect = (id: number) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  // Bắt đầu chế độ chọn khi nhấn giữ
  const handleLongPress = (id: number) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedIds([id]);
    }
  };

  // Khi selectedIds rỗng thì tắt chế độ chọn
  React.useEffect(() => {
    if (isSelecting && selectedIds.length === 0) setIsSelecting(false);
  }, [selectedIds, isSelecting]);

  return (
    <CombineLayout>
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (isSelecting) {
              setIsSelecting(false);
              setSelectedIds([]);
            }
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ padding: 16, minHeight: "100%" }}
              keyboardShouldPersistTaps="handled"
            >
              {favorites.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 32 }}>
                  No favorite recipes.
                </Text>
              ) : (
                favorites.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (isSelecting) {
                        toggleSelect(item.id);
                      } else {
                        router.push({
                          pathname: "/RecipeDetail",
                          params: { recipe: item },
                        });
                      }
                    }}
                    onLongPress={(e) => {
                      e.stopPropagation();
                      handleLongPress(item.id);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image source={item.image} style={styles.cardImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 4,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FontAwesome
                            key={i}
                            name="star"
                            size={16}
                            color={i <= item.rating ? "#FFD700" : "#eee"}
                          />
                        ))}
                      </View>
                      <Text style={styles.cardSubtitle}>
                        You have all {item.ingredients} ingredients
                      </Text>
                    </View>
                    {/* Favorite button chỉ hiện khi không ở chế độ chọn */}
                    {!isSelecting && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          removeFavorite(item.id);
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <FontAwesome name="heart" size={22} color="#F55" />
                      </TouchableOpacity>
                    )}
                    {/* Checkbox cho multi-select, chỉ hiện khi isSelecting */}
                    {isSelecting && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.id);
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <FontAwesome
                          name={
                            selectedIds.includes(item.id)
                              ? "check-square"
                              : "square-o"
                          }
                          size={22}
                          color="#888"
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))
              )}
              {/* Multi-delete và clear all chỉ hiện khi đang chọn */}
              {isSelecting && favorites.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <Button
                    title="Xóa đã chọn"
                    onPress={() => {
                      if (selectedIds.length === 0)
                        return Alert.alert("Chọn món để xóa.");
                      removeSelectedFavorites();
                    }}
                    color="#F55"
                  />
                  <Button
                    title="Xóa tất cả"
                    onPress={() => {
                      Alert.alert("Xóa tất cả món yêu thích?", "", [
                        { text: "Hủy", style: "cancel" },
                        { text: "OK", onPress: clearFavorites },
                      ]);
                    }}
                    color="#888"
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </CombineLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 18,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardSubtitle: { color: "#888", fontSize: 13, marginTop: 4 },
});

export default FavouriteScreen;
