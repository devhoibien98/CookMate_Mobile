import { AuthStackParamList } from '@/src/navigation/AuthNavigator';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<LoginScreenNavigationProp>()
    const handleLogin = () => {
        Alert.alert('Login', 'Login successful');
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
                        <TouchableOpacity>
                            <View>
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
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

                    {/* Forgot password */}
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Forgot password</Text>
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

