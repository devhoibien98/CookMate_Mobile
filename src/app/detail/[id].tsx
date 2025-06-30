import {
  addFavoritePlayer,
  isPlayerFavorite,
  removeFavoritePlayer,
} from "@/utils/favoriteStorage";
// eslint-disable-next-line import/no-unresolved
import { API_URL } from "@env";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
  YoB: number;
  MinutesPlayed: number;
  PassingAccuracy: number;
  isCaptain: boolean;
  isFavorite: boolean;
  imageUrl?: string;
  feedbacks?: Feedback[];
  position: string;
  team: string;
}

// StarRating Component for Detail Screen
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starRatingContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={20} color="gold" />
      ))}
      {halfStar && (
        <Ionicons key="half" name="star-half" size={20} color="gold" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={20}
          color="gold"
        />
      ))}
    </View>
  );
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  const fetchPlayerDetails = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`${API_URL}/players/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Player = await response.json();
      setPlayer(data);
      const favoriteStatus = await isPlayerFavorite(data.id);
      setIsFavorite(favoriteStatus);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlayerDetails();
  }, [fetchPlayerDetails]);

  useEffect(() => {
    const loadAvatar = async () => {
      if (player) {
        const savedUri = await AsyncStorage.getItem(`avatar_${player.id}`);
        if (savedUri) setLocalAvatar(savedUri);
      }
    };
    loadAvatar();
  }, [player]);

  const handleFavoriteToggle = async () => {
    if (!player) return;
    if (isFavorite) {
      await removeFavoritePlayer(player.id);
    } else {
      await addFavoritePlayer({ ...player, isFavorite: true });
    }
    setIsFavorite(!isFavorite);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setLocalAvatar(result.assets[0].uri);
      if (player) {
        await AsyncStorage.setItem(`avatar_${player.id}`, result.assets[0].uri);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading player details...</Text>
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

  if (!player) {
    return (
      <View style={styles.centeredView}>
        <Text>No player found.</Text>
      </View>
    );
  }

  const averageRating =
    player.feedbacks && player.feedbacks.length > 0
      ? player.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        player.feedbacks.length
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.avatarContainer}>
          {(localAvatar || player.imageUrl) && (
            <Image
              source={{ uri: localAvatar || player.imageUrl }}
              style={styles.avatar}
            />
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={{
              marginTop: 8,
              marginBottom: 4,
              alignSelf: "center",
              backgroundColor: "#e0e7ff",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: "#4e54c8", fontWeight: "bold" }}>
              Chọn ảnh
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.playerName}>{player.playerName}</Text>
        <TouchableOpacity
          onPress={handleFavoriteToggle}
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={28}
            color={isFavorite ? "#FFD700" : "#bbb"}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Year of Birth</Text>
            <Text style={styles.infoValue}>{player.YoB}</Text>
            <Text style={styles.infoLabel}>Position</Text>
            <Text style={styles.infoValue}>{player.position}</Text>
            <Text style={styles.infoLabel}>Team</Text>
            <Text style={styles.infoValue}>{player.team}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Captain</Text>
            <Text style={styles.infoValue}>
              {player.isCaptain ? "Yes" : "No"}
            </Text>
            <Text style={styles.infoLabel}>Passing Accuracy</Text>
            <Text style={styles.infoValue}>
              {(player.PassingAccuracy * 100).toFixed(0)}%
            </Text>
            <Text style={styles.infoLabel}>Minutes Played</Text>
            <Text style={styles.infoValue}>{player.MinutesPlayed}</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ratings & Comments</Text>
          {player.feedbacks && player.feedbacks.length > 0 ? (
            <View>
              <Text style={styles.averageRatingText}>
                Average: {averageRating.toFixed(1)} / 5
              </Text>
              <StarRating rating={averageRating} />
              {player.feedbacks.map((feedback, index) => (
                <View key={index} style={styles.commentItem}>
                  <Text style={styles.commentText}>{feedback.comment}</Text>
                  <Text style={styles.commentAuthorDate}>
                    - {feedback.author},{" "}
                    {new Date(feedback.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No ratings yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #f6f8fc 60%, #e0e7ff 100%)",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#4e54c8",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  playerName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4e54c8",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: "#e0e7ff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4e54c8",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  favoriteButtonActive: {
    // Không đổi background, chỉ giữ border tím
  },
  favoriteButtonText: {
    color: "#4e54c8",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 18,
  },
  infoCol: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 2,
  },
  infoLabel: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    color: "#222",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#4e54c8",
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4e54c8",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  averageRatingText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  commentItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
    fontStyle: "italic",
  },
  commentAuthorDate: {
    fontSize: 13,
    color: "#777",
    textAlign: "right",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    color: "#777",
  },
  starRatingContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fc",
    padding: 20,
  },
});
