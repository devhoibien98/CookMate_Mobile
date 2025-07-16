import type { ProfileStackParamList } from "@/app/(tabs)/profile";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getUserById } from "@/src/services/userService";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavorites } from "@/hooks/useFavorites";
import { clearAllAsyncStorage, debugAsyncStorage } from "@/utils/asyncStorageUtils";

const UserProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { signOut, user } = useContext(AuthContext);

  const [fullUser, setFullUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(user.userId);
        setFullUser(data);
      } catch (err) {
        console.log("Không thể lấy thông tin user:", err);
      }
    };

    if (user.userId) {
      fetchUser();
    }
  }, [user.userId]);

  const { signOut } = useContext(AuthContext);
  const { clearFavoritesStorage } = useFavorites();

  const handleClearFavorites = () => {
    Alert.alert(
      "Clear Favorites",
      "Are you sure you want to clear all favorite recipes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearFavoritesStorage();
            Alert.alert("Success", "Favorites cleared successfully!");
          },
        },
      ]
    );
  };

  const handleClearAllStorage = () => {
    Alert.alert(
      "Clear All Data",
      "⚠️ This will clear ALL app data including favorites, preferences, and cache. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllAsyncStorage();
            Alert.alert("Success", "All data cleared successfully!");
          },
        },
      ]
    );
  };

  const handleDebugStorage = async () => {
    await debugAsyncStorage();
    Alert.alert("Debug", "Check console for AsyncStorage contents");
  };


  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <LinearGradient
            colors={["#fe8300", "#ff9b31"]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {fullUser?.username?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{fullUser?.username || "User Name"}</Text>
                <Text style={styles.userEmail}>{fullUser?.email || "email@example.com"}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate("EditProfile")}
                >
                  <Text style={styles.editText}>Edit profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("History")}
          >
            <Ionicons name="time-outline" size={24} color="#000" />
            <Text style={styles.optionText}>History</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("DietPreferences")}
          >
            <FontAwesome5 name="stethoscope" size={20} color="#000" />
            <Text style={styles.optionText}>Diet Preferences</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          {/* Debug Section */}
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>🔧 Debug Tools</Text>

            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleDebugStorage}
            >
              <Ionicons name="bug-outline" size={20} color="#007AFF" />
              <Text style={styles.debugButtonText}>Debug AsyncStorage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleClearFavorites}
            >
              <Ionicons name="heart-outline" size={20} color="#FF9500" />
              <Text style={styles.debugButtonText}>Clear Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleClearAllStorage}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.debugButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.logoutRow} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={24} color="#ff080c" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#000",
    fontWeight: "600",
  },
  userInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },
  userEmail: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 2,
  },
  editButton: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#ffac33",
    borderRadius: 20,
    backgroundColor: "rgba(217, 217, 217, 0.23)",
    alignSelf: "flex-start",
  },
  editText: {
    fontSize: 9,
    color: "#fff",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 15,
    color: "#000",
    fontWeight: "500",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 14,
    color: "#ff080c",
    fontWeight: "500",
  },
  debugSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#f8f9fa",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  debugButtonText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default UserProfile;
