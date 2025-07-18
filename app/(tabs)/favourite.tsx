import CombineLayout from "@/components/Component";
import FavoriteButton from "@/components/FavoriteButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useFilterState } from "@/hooks/useFilterState";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const FavouriteScreen = () => {
  const router = useRouter();
  const {
    favorites,
    isLoading,
    removeFromFavorites,
    clearAllFavorites,
    removeMultipleFavorites,
    refreshFavorites,
  } = useFavorites();

  // Use the new filter state hook
  const {
    searchText,
    setSearchText,
    filterRating,
    setFilterRating,
    filterIngredients,
    setFilterIngredients,
    filterTime,
    setFilterTime,
    resetFilters,
  } = useFilterState();

  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedIds([]);
      setIsSelecting(false);
      refreshFavorites();
      // Reset filters when returning to this tab
      resetFilters();
    }, [refreshFavorites, resetFilters])
  );

  // Toggle select for multi-delete
  const toggleSelect = (id: string | number) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  // Bắt đầu chế độ chọn khi nhấn giữ
  const handleLongPress = (id: string | number) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedIds([id]);
    }
  };

  // Khi selectedIds rỗng thì tắt chế độ chọn
  React.useEffect(() => {
    if (isSelecting && selectedIds.length === 0) setIsSelecting(false);
  }, [selectedIds, isSelecting]);

  // Remove selected favorites
  const handleRemoveSelected = async () => {
    if (selectedIds.length === 0) {
      Alert.alert("Thông báo", "Hãy chọn món ăn cần xóa.");
      return;
    }

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} món ăn đã chọn?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await removeMultipleFavorites(selectedIds);
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  // Clear all favorites
  const handleClearAll = () => {
    Alert.alert(
      "Xác nhận xóa tất cả",
      "Bạn có chắc chắn muốn xóa tất cả món ăn yêu thích?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tất cả",
          style: "destructive",
          onPress: async () => {
            await clearAllFavorites();
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  // Lọc danh sách theo searchText (không phân biệt dấu) và các bộ lọc
  const filteredFavorites = React.useMemo(() => {
    let result = favorites;
    if (showSearch || searchText.trim()) {
      const keyword = removeVietnameseTones(searchText.trim().toLowerCase());
      result = result.filter((item) => {
        const name = removeVietnameseTones(
          (item.name || item.title || "").toLowerCase()
        );
        return name.includes(keyword);
      });
    }
    // Lọc theo số sao
    if (filterRating > 0) {
      result = result.filter(
        (item) => (item.rating || item.aiRating || 0) >= filterRating
      );
    }
    // Lọc theo số nguyên liệu
    if (filterIngredients !== "all") {
      if (filterIngredients === "<=5")
        result = result.filter((item) =>
          Array.isArray(item.ingredients) ? item.ingredients.length <= 5 : false
        );
      else if (filterIngredients === "6-10")
        result = result.filter((item) =>
          Array.isArray(item.ingredients)
            ? item.ingredients.length >= 6 && item.ingredients.length <= 10
            : false
        );
      else if (filterIngredients === ">10")
        result = result.filter((item) =>
          Array.isArray(item.ingredients) ? item.ingredients.length > 10 : false
        );
    }
    // Lọc theo thời gian
    if (filterTime !== "all") {
      if (filterTime === "0-30")
        result = result.filter(
          (item) =>
            (item.cookingTime || 0) >= 0 && (item.cookingTime || 0) <= 30
        );
      else if (filterTime === "30-60")
        result = result.filter(
          (item) =>
            (item.cookingTime || 0) > 30 && (item.cookingTime || 0) <= 60
        );
      else if (filterTime === ">60")
        result = result.filter((item) => (item.cookingTime || 0) > 60);
    }
    return result;
  }, [
    favorites,
    showSearch,
    searchText,
    filterRating,
    filterIngredients,
    filterTime,
  ]);

  // Hàm reset filter
  const resetFilter = () => {
    resetFilters();
  };

  if (isLoading) {
    return (
      <CombineLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Đang tải...</Text>
        </View>
      </CombineLayout>
    );
  }

  return (
    <CombineLayout>
      {/* Luôn hiện thanh tìm kiếm phía trên danh sách */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f2f2f2",
            borderRadius: 8,
            paddingHorizontal: 8,
          }}
        >
          <FontAwesome
            name="search"
            size={18}
            color="#888"
            style={{ marginRight: 6 }}
          />
          <TextInput
            style={{ flex: 1, height: 36 }}
            placeholder="Tìm món yêu thích..."
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {!!searchText && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <FontAwesome
                name="times-circle"
                size={18}
                color="#888"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Thanh lọc bằng dropdown */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 8,
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        {/* Dropdown số sao */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#888",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Sao
          </Text>
          <Picker
            selectedValue={filterRating}
            onValueChange={setFilterRating}
            style={{ height: 56 }}
            mode="dialog"
          >
            <Picker.Item label="All" value={0} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
          </Picker>
        </View>
        {/* Dropdown số nguyên liệu */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#888",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Ng.liệu
          </Text>
          <Picker
            selectedValue={filterIngredients}
            onValueChange={setFilterIngredients}
            style={{ height: 56 }}
            mode="dialog"
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="≤5" value="<=5" />
            <Picker.Item label="6-10" value="6-10" />
            <Picker.Item label=">10" value=">10" />
          </Picker>
        </View>
        {/* Dropdown thời gian */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#888",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Th.gian
          </Text>
          <Picker
            selectedValue={filterTime}
            onValueChange={setFilterTime}
            style={{ height: 56 }}
            mode="dialog"
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="0-30 phút" value="0-30" />
            <Picker.Item label="30-60 phút" value="30-60" />
            <Picker.Item label="Hơn 60 phút" value=">60" />
          </Picker>
        </View>
      </View>
      {/* Hiển thị tổng số món đang lọc */}
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <Text style={{ color: "#888", fontSize: 13 }}>
          Đang hiển thị {filteredFavorites.length}/{favorites.length} món ăn yêu
          thích
        </Text>
      </View>
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
            contentContainerStyle={{ padding: 16, flexGrow: 0 }}
            keyboardShouldPersistTaps="handled"
          >
            {filteredFavorites.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 50,
                }}
              >
                <FontAwesome name="heart-o" size={64} color="#ccc" />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 16,
                    fontSize: 16,
                    color: "#888",
                  }}
                >
                  Chưa có món ăn yêu thích nào
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 14,
                    color: "#aaa",
                  }}
                >
                  Nhấn vào biểu tượng trái tim để thêm món ăn vào danh sách yêu
                  thích
                </Text>
              </View>
            ) : (
              <>
                {filteredFavorites.map((item) => {
                  // Handle data inconsistencies - some recipes have 'title' instead of 'name'
                  const recipeName =
                    item.name || item.title || "Tên món ăn không xác định";
                  const recipeIngredients = item.ingredients || [];
                  const recipeRating = item.rating || item.aiRating || 0;

                  // Render nút xóa khi swipe
                  const renderRightActions = () => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F55",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 80,
                        height: "100%",
                      }}
                      onPress={() => removeFromFavorites(item.id)}
                    >
                      <FontAwesome name="trash" size={24} color="#fff" />
                      <Text style={{ color: "#fff", marginTop: 4 }}>Xóa</Text>
                    </TouchableOpacity>
                  );

                  return (
                    <Swipeable
                      renderRightActions={renderRightActions}
                      key={item.id}
                    >
                      <TouchableOpacity
                        style={[
                          styles.card,
                          isSelecting &&
                            selectedIds.includes(item.id) &&
                            styles.selectedCard,
                        ]}
                        onPress={(e) => {
                          e.stopPropagation && e.stopPropagation();
                          if (isSelecting) {
                            toggleSelect(item.id);
                          } else {
                            const recipeString = JSON.stringify(item);
                            router.push({
                              pathname: "/RecipeDetail",
                              params: { recipe: recipeString },
                            });
                          }
                        }}
                        onLongPress={(e) => {
                          e.stopPropagation && e.stopPropagation();
                          handleLongPress(item.id);
                        }}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={require("../../assets/images/recipe-suggestion.png")}
                          style={styles.cardImage}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.cardTitle}>{recipeName}</Text>
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
                                color={i <= recipeRating ? "#FFD700" : "#eee"}
                              />
                            ))}
                          </View>
                          <Text style={styles.cardSubtitle}>
                            {Array.isArray(recipeIngredients) &&
                            recipeIngredients.length > 0
                              ? `${recipeIngredients.length} nguyên liệu`
                              : "Chưa có thông tin nguyên liệu"}
                          </Text>
                        </View>
                        {/* Favorite button to remove */}
                        <FavoriteButton
                          isFavorite={true}
                          onPress={() => {
                            removeFromFavorites(item.id);
                          }}
                          style={{ marginLeft: 8 }}
                        />
                        {/* Checkbox cho multi-select, chỉ hiện khi isSelecting */}
                        {isSelecting && (
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation && e.stopPropagation();
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
                    </Swipeable>
                  );
                })}
                {isSelecting && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 16,
                    }}
                  >
                    <Button
                      title={`Xóa đã chọn (${selectedIds.length})`}
                      onPress={handleRemoveSelected}
                      color="#F55"
                      disabled={selectedIds.length === 0}
                    />
                    <Button
                      title="Xóa tất cả"
                      onPress={handleClearAll}
                      color="#888"
                    />
                  </View>
                )}
                <View style={{ height: 200 }} />
              </>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8ff",
  },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  cardSubtitle: { color: "#888", fontSize: 13, marginTop: 4 },
});

export default FavouriteScreen;
