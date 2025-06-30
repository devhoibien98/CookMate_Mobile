import bg from "@/assets/images/bg-stadium.jpg";
import CustomButton from "@/constants/button";
import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    paddingLeft: 20,
  },
  textWelcome: {
    fontSize: 45,
    fontWeight: "bold",
    color: "black",
  },
  text_logo: {
    fontWeight: "bold",
    fontSize: 40,
    color: "orange",
  },
  welcomeText: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "65%",
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
  },
  welcomeButton: {
    flex: 0.4,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
const WelcomePage = () => {
  return (
    <ImageBackground style={styles.backgroundImage} source={bg}>
      <View style={styles.container}>
        <View style={styles.welcomeText}>
          <Text>
            <Text style={styles.textWelcome}>Welcome to</Text>
          </Text>
          <Text style={styles.text_logo}>List Player</Text>
          <Text>Your Player is your Dream.</Text>
        </View>
        <View style={styles.welcomeButton}>
          <CustomButton
            title="List cầu thủ"
            onPress={() => router.push("/player")}
            backgroundColor="orange"
          />
        </View>
      </View>
    </ImageBackground>
  );
};
export default WelcomePage;
