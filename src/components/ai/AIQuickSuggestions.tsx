import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AIService from "../../services/aiService";

interface QuickAction {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "1",
    title: "Món hôm nay",
    prompt: "Đề xuất 3 món ăn ngon và dễ làm cho bữa tối hôm nay",
    icon: "restaurant",
    color: "#FF6B6B",
  },
  {
    id: "2",
    title: "Healthy",
    prompt: "Đề xuất món ăn healthy, ít calories cho người muốn giảm cân",
    icon: "leaf",
    color: "#4ECDC4",
  },
  {
    id: "3",
    title: "Nhanh gọn",
    prompt: "Món ăn làm trong 15 phút, đơn giản cho người bận rộn",
    icon: "flash",
    color: "#45B7D1",
  },
  {
    id: "4",
    title: "Mẹo hay",
    prompt: "Chia sẻ 5 mẹo nấu ăn hữu ích nhất cho người mới bắt đầu",
    icon: "bulb",
    color: "#FFA726",
  },
];

export default function AIQuickSuggestions() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleQuickAction = async (action: QuickAction) => {
    setLoadingId(action.id);
    try {
      const response = await AIService.chatWithAI(action.prompt);

      Alert.alert(action.title, response, [{ text: "OK" }], {
        cancelable: true,
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lấy đề xuất từ AI. Vui lòng thử lại.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color="#FF6347" />
        <Text style={styles.headerTitle}>AI Suggestions</Text>
      </View>

      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={() => handleQuickAction(action)}
            disabled={loadingId === action.id}
          >
            <View style={styles.actionContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: action.color },
                ]}
              >
                {loadingId === action.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name={action.icon as any} size={18} color="white" />
                )}
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
});
