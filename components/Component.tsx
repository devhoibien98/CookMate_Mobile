import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.body}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userMenu: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    width: "100%",
    height: HEADER_HEIGHT,
    overflow: "hidden",
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderBottomLeftRadius: 24,
    // borderBottomRightRadius: 24,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  iconOverlay: {
    position: "absolute",
    width: "100%",
    // height: "100%",
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
    marginTop: 0, 
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    position: "relative",
  },
  body: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
});

export default CombineLayout; 