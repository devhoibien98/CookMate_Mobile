import DietPreferencesScreen from "@/src/screens/profile/DietPreferencesScreen";
import EditProfileScreen from "@/src/screens/profile/EditProfileScreen";
import HistoryScreen from "@/src/screens/profile/HistoryScreen";
import UserProfile from "@/src/screens/profile/UserProfile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type ProfileStackParamList = {
  UserProfile: undefined;
  EditProfile: undefined;
  History: undefined;
  DietPreferences: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="DietPreferences" component={DietPreferencesScreen} />
    </Stack.Navigator>
  );
}
