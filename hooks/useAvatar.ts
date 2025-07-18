import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

// Get storage key for user avatar
const getAvatarKey = (userId: string) => `user_avatar_${userId}`;

export const useAvatar = (userId: string) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load avatar from AsyncStorage
  const loadAvatar = React.useCallback(async () => {
    try {
      const key = getAvatarKey(userId);
      const savedAvatar = await AsyncStorage.getItem(key);
      if (savedAvatar) {
        setAvatarUri(savedAvatar);
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  }, [userId]);

  // Save avatar to AsyncStorage
  const saveAvatar = React.useCallback(
    async (uri: string) => {
      try {
        const key = getAvatarKey(userId);
        await AsyncStorage.setItem(key, uri);
        setAvatarUri(uri);
      } catch (error) {
        console.error("Error saving avatar:", error);
      }
    },
    [userId]
  );

  // Pick image from camera or gallery
  const pickImage = React.useCallback(
    async (source: "camera" | "gallery") => {
      try {
        setIsLoading(true);

        // Request permissions
        if (source === "camera") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Cần quyền truy cập camera để chụp ảnh!");
            return;
          }
        } else {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Cần quyền truy cập thư viện ảnh!");
            return;
          }
        }

        // Pick image
        const options = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1] as [number, number], // Square aspect ratio
          quality: 0.8, // Compress image
        };

        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled && result.assets[0]) {
          const uri = result.assets[0].uri;
          await saveAvatar(uri);
        }
      } catch (error) {
        console.error("Error picking image:", error);
        alert("Có lỗi khi chọn ảnh!");
      } finally {
        setIsLoading(false);
      }
    },
    [saveAvatar]
  );

  // Remove avatar
  const removeAvatar = React.useCallback(async () => {
    try {
      const key = getAvatarKey(userId);
      await AsyncStorage.removeItem(key);
      setAvatarUri(null);
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  }, [userId]);

  // Load avatar on mount
  useEffect(() => {
    if (userId) {
      loadAvatar();
    }
  }, [userId, loadAvatar]);

  return {
    avatarUri,
    isLoading,
    pickImage,
    removeAvatar,
    loadAvatar,
  };
};
