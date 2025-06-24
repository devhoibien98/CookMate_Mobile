import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { ProfileStackParamList } from "@/app/(tabs)/profile";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const UserProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

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
                <Text style={styles.avatarText}>U</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>User Name</Text>
                <Text style={styles.userEmail}>Username@gmail.com</Text>
                <View style={styles.editButton}>
                  <Text style={styles.editText}>Edit profile</Text>
                </View>
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
        </View>
      </SafeAreaView>

      <TouchableOpacity style={styles.logoutRow}>
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
});

export default UserProfile;
