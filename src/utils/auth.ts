
import axios from '@/utils/axios';

// Token handling
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

// JWT token validation - checks if token is likely expired
export const isTokenExpired = (token: string) => {
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT token (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if the token is expired
    const expired = payload.exp * 1000 < Date.now();
    return expired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, assume the token is expired
  }
};

// Check if the current token is valid
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token && !isTokenExpired(token);
};
