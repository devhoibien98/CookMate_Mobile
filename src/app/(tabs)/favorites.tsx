import {
  clearAllFavorites,
  getFavoritePlayers,
  removeFavoritePlayer,
} from "@/utils/favoriteStorage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface Player {
  id: string;
  playerName: string;
  YoB: number;
  MinutesPlayed: number;
  PassingAccuracy: number;
  isCaptain: boolean;
  isFavorite: boolean;
  imageUrl?: string;
}

export default function FavoritesScreen() {
  const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFavoritePlayers = useCallback(async () => {
    try {
      setLoading(true);
      const players = await getFavoritePlayers();
      setFavoritePlayers(players);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavoritePlayers();
    }, [fetchFavoritePlayers])
  );

  const handleRemoveFavorite = async (playerId: string) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this player from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            await removeFavoritePlayer(playerId);
            fetchFavoritePlayers(); // Refresh the list
          },
        },
      ]
    );
  };

  const handleClearAllFavorites = async () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to clear all favorite players? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          onPress: async () => {
            await clearAllFavorites();
            fetchFavoritePlayers(); // Refresh the list
          },
        },
      ]
    );
  };

  const handleLongPress = (id: string) => {
    setIsSelectionMode(true);
    setSelectedIds([id]);
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    Alert.alert(
      "Delete Selected",
      `Are you sure you want to delete ${selectedIds.length} selected players?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            for (const id of selectedIds) {
              await removeFavoritePlayer(id);
            }
            setSelectedIds([]);
            setIsSelectionMode(false);
            fetchFavoritePlayers();
          },
        },
      ]
    );
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (favoritePlayers.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>⚽ Player Hub</Text>
        </View>
        <View style={styles.centeredView}>
          <Ionicons name="star-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            No favorite players yet. Start adding your favorites!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderFavoritePlayerItem = ({ item }: { item: Player }) => (
    <Swipeable
      renderRightActions={() =>
        !isSelectionMode && (
          <TouchableOpacity
            style={styles.swipeDeleteButton}
            onPress={() => handleRemoveFavorite(item.id)}
          >
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.swipeDeleteText}>Remove</Text>
          </TouchableOpacity>
        )
      }
    >
      <View style={styles.playerItem}>
        {isSelectionMode && (
          <TouchableOpacity
            style={{ marginRight: 10, alignSelf: "center" }}
            onPress={() => handleSelect(item.id)}
          >
            <Ionicons
              name={
                selectedIds.includes(item.id) ? "checkbox" : "square-outline"
              }
              size={24}
              color={selectedIds.includes(item.id) ? "#4e54c8" : "#bbb"}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.playerInfo}
          onPress={() => !isSelectionMode && router.push(`/detail/${item.id}`)}
          onLongPress={() => handleLongPress(item.id)}
          activeOpacity={0.8}
        >
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
          )}
          <Text style={styles.playerName}>{item.playerName}</Text>
          <Text style={styles.detailText}>Age: {item.YoB}</Text>
          <Text style={styles.detailText}>
            Minutes Played: {item.MinutesPlayed}
          </Text>
          <Text style={styles.detailText}>
            Passing Accuracy: {item.PassingAccuracy}%
          </Text>
        </TouchableOpacity>
        {!isSelectionMode && (
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash" size={24} color="#dc3545" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>⚽ Player Hub</Text>
      </View>
      <FlatList
        data={favoritePlayers}
        renderItem={renderFavoritePlayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      {isSelectionMode && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={[
              styles.clearAllButton,
              { backgroundColor: "#dc3545", flex: 1, marginHorizontal: 10 },
            ]}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.clearAllButtonText}>
              Delete Selected ({selectedIds.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelSelection}
            style={[
              styles.clearAllButton,
              { backgroundColor: "#aaa", flex: 1, marginHorizontal: 10 },
            ]}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.clearAllButtonText}>Cancel Selection</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isSelectionMode && (
        <TouchableOpacity
          onPress={handleClearAllFavorites}
          style={styles.clearAllButton}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.clearAllButtonText}>Clear All Favorites</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#4e54c8",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#fff",
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  playerItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerInfo: {
    flex: 1,
    marginRight: 15,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  playerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe0e6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  removeButtonText: {
    color: "#dc3545",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  clearAllButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  swipeDeleteButton: {
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: "90%",
    borderRadius: 12,
    flexDirection: "row",
    marginVertical: 6,
  },
  swipeDeleteText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
});
