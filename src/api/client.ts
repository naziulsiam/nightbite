import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('nb_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors & token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('nb_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('nb_token', token);
          localStorage.setItem('nb_refresh_token', newRefreshToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error
      const errorData = error.response.data as { message?: string; error?: string };
      console.error('API Error:', errorData);
      return Promise.reject({
        status: error.response.status,
        message: errorData.message || errorData.error || 'An error occurred',
        data: errorData,
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        data: null,
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
