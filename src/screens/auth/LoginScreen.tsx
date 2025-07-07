import { ProfileStackParamList } from '@/app/(tabs)/profile';
import { MESSAGES } from '@/src/constants/messages';
import axiosInstance from '@/src/services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';





const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
    const handleLogin = async () => {
        try {
            const response = await axiosInstance.post('/authorize/login', { usernameOrEmail: email, password });
            await AsyncStorage.setItem('token', response.data.access_token);
            navigation.navigate('UserProfile');
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                const message = error.response.data?.message || MESSAGES.LOGIN_ERROR_401;
                Alert.alert(MESSAGES.LOGIN_ERROR, message);
            } else {
                Alert.alert(MESSAGES.LOGIN_ERROR, MESSAGES.LOGIN_ERROR_DEFAULT);
            }
        }
    }
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
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>CookMate</Text>

                    {/* Input Fields */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#aaa"
                            style={[styles.input, styles.inputTop]}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <View style={styles.inputDivider} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#aaa"
                            secureTextEntry
                            style={[styles.input, styles.inputBottom]}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton}
                        onPress={() => handleLogin()}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>


                </ImageBackground>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LoginScreen;


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
        justifyContent: 'flex-end',
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
        textAlign: 'center'
    },
    inputTop: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomColor: '#674C4C',
        borderBottomWidth: 1,
    },
    inputBottom: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: -1,
    },
    loginButton: {
        backgroundColor: '#E44B15', // đỏ cam
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
        backgroundColor: '#674C4C',
        marginHorizontal: 0,
    },
});

