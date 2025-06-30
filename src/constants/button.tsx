import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  color?: string;
  iconName?: string; // vẫn dùng được iconName nếu cần
  icons?: React.ReactNode; // truyền icon/image tuỳ ý
  iconPosition?: "left" | "right";
  iconSize?: number;
  borderRadius?: number;
  btnStyle?: ViewStyle; // ✅ Đổi tên để khớp prop truyền vào
  disabled?: boolean;
  uppercase?: boolean;
  textStyle?: TextStyle; // ✅ Thêm hỗ trợ textStyle
}

const CustomButton = (props: CustomButtonProps) => {
  const {
    title,
    onPress,
    backgroundColor = "#007bff",
    color = "#fff",
    iconName,
    icons,
    iconPosition = "left",
    iconSize = 20,
    borderRadius = 8,
    btnStyle,
    disabled = false,
    uppercase = false,
    textStyle,
  } = props;

  const defaultIcon = iconName ? (
    <Ionicons
      name={iconName}
      size={iconSize}
      color={color}
      style={styles.icon}
    />
  ) : null;

  const finalIcon = icons || defaultIcon;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? "#ccc" : backgroundColor,
          borderRadius,
        },
        btnStyle, // ✅ Sử dụng btnStyle ở đây
      ]}
    >
      <View style={styles.content}>
        {finalIcon && iconPosition === "left" && (
          <View style={styles.icon}>{finalIcon}</View>
        )}

        <Text style={[styles.title, { color }, textStyle]}>
          {uppercase ? title.toUpperCase() : title}
        </Text>

        {finalIcon && iconPosition === "right" && (
          <View style={styles.icon}>{finalIcon}</View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  } as TextStyle,
  icon: {
    marginHorizontal: 6,
  },
});

export default CustomButton;
