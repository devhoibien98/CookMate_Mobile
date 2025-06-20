import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 200;

interface CombineLayoutProps {
  children?: React.ReactNode;
}

const CombineLayout: React.FC<CombineLayoutProps> = ({ children }) => {
  return (
    <SafeAreaView style={styles.userMenu}>
      <View style={styles.headerContainer}>
        <LinearGradient
          style={styles.gradient}
          colors={["#fe8300", "#ff9b31"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Image
            source={require("../assets/images/FoodMenu-icon.png")}
            style={styles.iconOverlay}
            resizeMode="contain"
          />
          <Text style={styles.cookmate}>CookMate</Text>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userMenu: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  iconOverlay: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  cookmate: {
    color: "#fff",
    fontSize: 48,
    fontFamily: "JosefinSans-Regular",
    textAlign: "center",
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    position: "relative",
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT - 40, 
    paddingBottom: 100,
  },
  body: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 1,
  },
});

export default CombineLayout;
