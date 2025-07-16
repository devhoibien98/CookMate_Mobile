import CombineLayout from "@/components/Component";
import { AuthContext } from "@/src/contexts/AuthContext";
import { getHistory } from "@/utils/asyncStorageUtils";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HistoryScreen = () => {
  const router = useRouter();
  const [historyData, setHistoryData] = useState([]);
  const isFocused = useIsFocused();
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (isFocused && user?.id) {
      getHistory(user.id).then(setHistoryData);
    }
  }, [isFocused, user]);

  return (
    <CombineLayout>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.titleBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>History</Text>
        </View>

        <ScrollView style={styles.list}>
          {historyData.map(
            (item: any) => (
              console.log(item),
              (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: "/RecipeDetail",
                      params: { id: item.id },
                    })
                  }
                  activeOpacity={0.7}
                  style={styles.card}
                >
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.title}</Text>
                    <View style={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < item.rating ? "star" : "star-outline"}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                    <Text style={styles.ingredients}>
                      {item.ingredientsInfo}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )
          )}
        </ScrollView>
      </SafeAreaView>
    </CombineLayout>
  );
};

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#fe8300",
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  rating: {
    flexDirection: "row",
    marginTop: 4,
  },
  ingredients: {
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
    marginTop: 6,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default HistoryScreen;
