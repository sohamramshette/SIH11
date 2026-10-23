import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for attaching auth tokens in future phases
api.interceptors.request.use(
  (config) => {
    // Token attachment will be implemented during authentication phase
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling centralized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
