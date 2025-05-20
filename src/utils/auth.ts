
import axios from 'axios';

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
