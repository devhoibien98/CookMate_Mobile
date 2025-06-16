import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/src/screens/auth/LoginScreen';
import SignUpScreen from '@/src/screens/auth/SignUpScreen';

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
);

export default AuthNavigator;
