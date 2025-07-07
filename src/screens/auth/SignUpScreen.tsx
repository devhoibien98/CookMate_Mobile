import { ProfileStackParamList } from '@/app/(tabs)/profile';
import { MESSAGES } from '@/src/constants/messages';
import axiosInstance from '@/src/services/axiosInstance';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type SignUpScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'SignUp'>;

const SignUpScreen = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<SignUpScreenNavigationProp>();

    const handleSignUp = async () => {
        // Validation
        if (!username.trim()) {
            Alert.alert(MESSAGES.SIGNUP_ERROR, MESSAGES.SIGNUP_USERNAME_REQUIRED);
            return;
        }
        if (!email.trim()) {
            Alert.alert(MESSAGES.SIGNUP_ERROR, MESSAGES.SIGNUP_EMAIL_REQUIRED);
            return;
        }
        if (!password.trim()) {
            Alert.alert(MESSAGES.SIGNUP_ERROR, MESSAGES.SIGNUP_PASSWORD_REQUIRED);
            return;
        }
        if (!isBranchEmail(email)) {
            Alert.alert(MESSAGES.SIGNUP_ERROR, MESSAGES.SIGNUP_EMAIL_INVALID);
            return;
        }
        if (!isPasswordValid(password)) {
            Alert.alert(MESSAGES.SIGNUP_ERROR, MESSAGES.SIGNUP_PASSWORD_INVALID);
            return;
        }

        try {
            const response = await axiosInstance.post('/authorize/register', { username, email, password });
            Alert.alert(MESSAGES.SIGNUP_SUCCESS, response.data.message);
            navigation.navigate('Login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || MESSAGES.SIGNUP_ERROR;
            Alert.alert(MESSAGES.SIGNUP_ERROR, errorMessage);
        }
    }

    const isBranchEmail = (email: string) => {
        return email.trim().toLowerCase().endsWith('@branch');
    };

    const isPasswordValid = (password: string) => {
        return password.trim().length > 5 && password.trim().length < 20 && !password.trim().includes(' ');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#ED7D49', '#FF9B31']}
                start={{ x: 0.05, y: 0 }}
                end={{ x: 0.78, y: 0 }}
                style={{ flex: 1 }}
            >
                <ImageBackground
                    source={require('../../../assets/images/food-icon.png')}
                    style={styles.background}
                >
                    {/* Back & Sign up Row */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View>
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signupText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>CookMate</Text>

                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#aaa"
                            style={[styles.input, styles.inputTop, styles.inputBorder]}
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#aaa"
                            style={[styles.input, styles.inputBorder]}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            style={[styles.input, styles.inputBorder, styles.inputBottom]}
                            value={password}
                            onChangeText={setPassword}
                        />

                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton}
                        onPress={() => handleSignUp()}>
                        <Text style={styles.loginText}>Sign up</Text>
                    </TouchableOpacity>

                </ImageBackground>
            </LinearGradient>
        </SafeAreaView >
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signupText: {
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 36,
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        textAlign: 'center',
    },
    inputTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    inputBottom: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    loginButton: {
        backgroundColor: '#E44B15',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    forgotText: {
        textAlign: 'center',
        color: '#7a5c4d',
    },
    inputDivider: {
        height: 1,
        backgroundColor: '#000',
    },
    inputBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
    }
});
