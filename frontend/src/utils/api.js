import axios from 'axios';

// Use VITE_API_URL in production (set in .env.production), fallback for local dev
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

// Create an Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
