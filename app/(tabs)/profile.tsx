import { AuthContext } from "@/src/contexts/AuthContext";
import LoginScreen from "@/src/screens/auth/LoginScreen";
import SignUpScreen from "@/src/screens/auth/SignUpScreen";
import EditProfileScreen from "@/src/screens/profile/EditProfileScreen";
import HistoryScreen from "@/src/screens/profile/HistoryScreen";
import UserProfile from "@/src/screens/profile/UserProfile";
import { useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useContext, useState } from "react";

export type ProfileStackParamList = {
  UserProfile: undefined;
  EditProfile: undefined;
  History: undefined;
  DietPreferences: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {

  const { token } = useContext(AuthContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setIsLoggedIn(token !== null);
    }, [token]));
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
