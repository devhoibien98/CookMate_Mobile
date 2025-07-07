import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://cookmate-api.lighttail.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // console.log('Config:', config);
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('Lỗi axios:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
