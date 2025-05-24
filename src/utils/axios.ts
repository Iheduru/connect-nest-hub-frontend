
import axios from 'axios';
import { toast } from 'sonner';
import { getAuthToken, removeAuthToken } from './auth';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { API_CONFIG } from '@/config/api';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is unauthorized and not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axiosInstance.post('/refresh/token');
        const { token } = refreshResponse.data.data;
        
        // Update the token
        localStorage.setItem('authToken', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        removeAuthToken();
        store.dispatch(logout());
        toast.error('Your session has expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data.retry_after || 60;
      toast.error(`Too many requests. Please try again in ${retryAfter} seconds.`);
    }
    
    // Handle validation errors
    if (error.response && error.response.status === 422) {
      if (error.response.data.errors) {
        // Format validation errors
        Object.values(error.response.data.errors).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            messages.forEach(message => toast.error(message));
          }
        });
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Also export as default for backward compatibility
export default axiosInstance;
