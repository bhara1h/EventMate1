import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.187.184.20:5000/api'; // Changed to your actual Wi-Fi IP address for phone testing

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
