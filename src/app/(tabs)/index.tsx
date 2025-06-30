/* eslint-disable import/no-unresolved */
import {
  addFavoritePlayer,
  getFavoritePlayers,
  removeFavoritePlayer,
} from "@/utils/favoriteStorage";
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Feedback {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface Player {
  id: string;
  playerName: string;
  MinutesPlayed: number;
  YoB: number;
  position: string;
  isCaptain: boolean;
  isFavorite: boolean;
  imageUrl?: string;
  team: string;
  PassingAccuracy: number;
  feedbacks?: Feedback[];
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starRating}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={16} color="gold" />
      ))}
      {halfStar && (
        <Ionicons key="half" name="star-half" size={16} color="gold" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="gold"
        />
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [teams, setTeams] = useState<string[]>(["All"]);
  const router = useRouter();
  console.log("API_URL", API_URL);
  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/players`);
      if (!response.ok) throw new Error("Failed to fetch players");
      const data: Player[] = await response.json();

      // Lấy avatar local cho từng player
      const playersWithLocalAvatar = await Promise.all(
        data.map(async (player) => {
          const localAvatar = await AsyncStorage.getItem(`avatar_${player.id}`);
          return {
            ...player,
            imageUrl: localAvatar || player.imageUrl, // Ưu tiên local
          };
        })
      );

      const favoriteIds = new Set(
        (await getFavoritePlayers()).map((p) => p.id)
      );
      const updatedPlayers = playersWithLocalAvatar.map((player) => ({
        ...player,
        isFavorite: favoriteIds.has(player.id),
        position: player.position ?? "",
      }));
      setPlayers(updatedPlayers);

      const uniqueTeamsSet = new Set(data.map((player) => player.team));
      const uniqueTeamsArray = Array.from(uniqueTeamsSet).sort();
      setTeams(["All", ...uniqueTeamsArray]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Cập nhật trạng thái favorite khi HomeScreen được focus
  useFocusEffect(
    useCallback(() => {
      const updateFavorites = async () => {
        const favoriteIds = new Set(
          (await getFavoritePlayers()).map((p) => p.id)
        );
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            isFavorite: favoriteIds.has(player.id),
          }))
        );
      };
      updateFavorites();
    }, [])
  );

  const handleFavoriteToggle = async (player: Player) => {
    const updatedIsFavorite = !player.isFavorite;
    if (updatedIsFavorite) {
      await addFavoritePlayer(player);
    } else {
      await removeFavoritePlayer(player.id);
    }

    // Cập nhật state players mà không gọi lại fetchPlayers
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === player.id ? { ...p, isFavorite: updatedIsFavorite } : p
      )
    );
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.playerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTeam === "All" || player.team === selectedTeam)
  );

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚽ Player Hub</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
        <ScrollView
          horizontal
          style={styles.teamFilter}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.teamTab,
              selectedTeam === "All" && styles.teamTabSelected,
            ]}
            onPress={() => setSelectedTeam("All")}
          >
            <Text
              style={[
                styles.teamTabText,
                selectedTeam === "All" && styles.teamTabTextSelected,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              All
            </Text>
          </TouchableOpacity>
          {teams
            .filter((t) => t !== "All")
            .map((team) => (
              <TouchableOpacity
                key={team}
                style={[
                  styles.teamTab,
                  selectedTeam === team && styles.teamTabSelected,
                ]}
                onPress={() => setSelectedTeam(team)}
              >
                <Text
                  style={[
                    styles.teamTabText,
                    selectedTeam === team && styles.teamTabTextSelected,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {team}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <FlatList
          data={filteredPlayers}
          renderItem={({ item }) => {
            const averageRating = item.feedbacks?.length
              ? item.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
                item.feedbacks.length
              : 0;
            return (
              <TouchableOpacity
                style={[
                  styles.playerCard,
                  item.isCaptain && styles.captainCard,
                  item.isFavorite && styles.favoriteCard,
                ]}
                onPress={() => router.push(`/detail/${item.id}`)}
              >
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.playerImage}
                  />
                )}
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{item.playerName}</Text>
                  <Text>YoB: {item.YoB}</Text>
                  <Text>Position: {item.position}</Text>
                  <Text>Pass Acc: {item.PassingAccuracy}%</Text>
                  {item.isCaptain && (
                    <Text style={styles.captain}>Captain</Text>
                  )}
                  {averageRating > 0 ? (
                    <StarRating rating={averageRating} />
                  ) : (
                    <Text style={styles.noRating}>No ratings</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleFavoriteToggle(item)}
                  style={styles.favoriteButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.isFavorite ? "star" : "star-outline"}
                    size={28}
                    color={item.isFavorite ? "#FFD700" : "#bbb"}
                    style={
                      item.isFavorite
                        ? { transform: [{ scale: 1.2 }] }
                        : undefined
                    }
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.playerList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No players found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fc",
  },
  header: {
    padding: 20,
    backgroundColor: "#4e54c8",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  searchInput: {
    height: 44,
    borderWidth: 0,
    borderRadius: 22,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 17,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  teamFilter: {
    marginBottom: 10,
    flexGrow: 0,
    maxHeight: undefined,
  },
  teamTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  teamTabSelected: {
    backgroundColor: "#4e54c8",
    borderWidth: 1,
    borderColor: "#4e54c8",
    color: "#fff",
  },
  teamTabText: {
    color: "#4e54c8",
    fontWeight: "700",
    fontSize: 15,
  },
  teamTabTextSelected: {
    color: "#fff",
  },
  playerList: {
    marginTop: 10,
    paddingBottom: 20,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 14,
    borderRadius: 16,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e3e6f3",
  },
  captainCard: {
    borderColor: "#28a745",
    borderWidth: 2,
  },
  favoriteCard: {
    borderColor: "#FFD700",
    borderWidth: 2,
  },
  playerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#8f94fb",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#4e54c8",
    marginBottom: 4,
  },
  captain: {
    color: "#28a745",
    fontWeight: "700",
    marginTop: 3,
  },
  noRating: {
    color: "#bbb",
    fontStyle: "italic",
    marginTop: 5,
  },
  starRating: {
    flexDirection: "row",
    marginTop: 5,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#bbb",
    marginTop: 24,
    fontSize: 16,
  },
  loading: {
    textAlign: "center",
    color: "#666",
    marginTop: 24,
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: 24,
    fontSize: 16,
  },
});
