import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from "@/src/screens/profile/UserProfile";
import HistoryScreen from "@/src/screens/profile/HistoryScreen";
import DietPreferencesScreen from "@/src/screens/profile/DietPreferencesScreen";

export type ProfileStackParamList = {
  UserProfile: undefined;
  History: undefined;
  DietPreferences: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="DietPreferences" component={DietPreferencesScreen} />
    </Stack.Navigator>
  );
}
