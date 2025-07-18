import type { ProfileStackParamList } from "@/app/(tabs)/profile";
import CombineLayout from "@/components/Component";
import { useAvatar } from "@/hooks/useAvatar";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getUserById, updateUser } from "@/src/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const { user } = useContext(AuthContext);
  const { avatarUri, pickImage, removeAvatar } = useAvatar(user.userId);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(user.userId);
        setUsername(data.username);
        setEmail(data.email);
        setPassword(data.password);
      } catch (err) {
        console.log("Lỗi khi lấy thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.userId) {
      fetchUser();
    }
  }, [user.userId]);

  const handleAvatarPress = () => {
    Alert.alert("Thay đổi ảnh đại diện", "Chọn cách thay đổi ảnh đại diện", [
      { text: "Hủy", style: "cancel" },
      { text: "Chụp ảnh", onPress: () => pickImage("camera") },
      { text: "Chọn từ thư viện", onPress: () => pickImage("gallery") },
      ...(avatarUri
        ? [
            {
              text: "Xóa ảnh",
              onPress: removeAvatar,
              style: "destructive" as const,
            },
          ]
        : []),
    ]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userData = {
        username,
        email,
        password,
      };

      await updateUser(user.userId, userData);
      Alert.alert("Thông báo", "Cập nhật thành công!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu thông tin.");
      console.error("Lỗi updateUser:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CombineLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color="#fe8300" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <TouchableOpacity style={styles.avatar} onPress={handleAvatarPress}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {username?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                { flex: 1, marginBottom: 0, borderWidth: 0 },
              ]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </CombineLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fe8300",
  },
  saveText: {
    color: "#ffa03c",
    fontWeight: "500",
    fontSize: 16,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fecc8c",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 29,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fe8300",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  deleteText: {
    color: "#fc0004",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 30,
  },
});

export default EditProfileScreen;
