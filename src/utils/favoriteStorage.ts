import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_PLAYERS_KEY = '@favorite_players';

interface Player {
  id: string;
  playerName: string;
  YoB: number;
  MinutesPlayed: number;
  PassingAccuracy: number;
  isCaptain: boolean;
  isFavorite: boolean;
}

export const getFavoritePlayers = async (): Promise<Player[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITE_PLAYERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load favorite players.", e);
    return [];
  }
};

export const addFavoritePlayer = async (player: Player): Promise<void> => {
  try {
    const currentFavorites = await getFavoritePlayers();
    const updatedFavorites = [...currentFavorites, { ...player, isFavorite: true }];
    await AsyncStorage.setItem(FAVORITE_PLAYERS_KEY, JSON.stringify(updatedFavorites));
  } catch (e) {
    console.error("Failed to add player to favorites.", e);
  }
};

export const removeFavoritePlayer = async (playerId: string): Promise<void> => {
  try {
    const currentFavorites = await getFavoritePlayers();
    const updatedFavorites = currentFavorites.filter(player => player.id !== playerId);
    await AsyncStorage.setItem(FAVORITE_PLAYERS_KEY, JSON.stringify(updatedFavorites));
  } catch (e) {
    console.error("Failed to remove player from favorites.", e);
  }
};

export const clearAllFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("All favorites cleared.");
  } catch (e) {
    console.error("Failed to clear all favorites.", e);
  }
};

export const isPlayerFavorite = async (playerId: string): Promise<boolean> => {
  try {
    const currentFavorites = await getFavoritePlayers();
    return currentFavorites.some(player => player.id === playerId);
  } catch (e) {
    console.error("Failed to check if player is favorite.", e);
    return false;
  }
}; 