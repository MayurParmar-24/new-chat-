import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const login = async (formData) => {
  try {
    const response = await api.post('/auth/login', formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('Server not responding. Please try again later.');
    }
    throw new Error('Failed to make login request');
  }
};

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('/auth/updateProfile', userData);
  return response.data;
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/check');
    return response.data;
  } catch (error) {
    return null;
  }
};

// Chat APIs
export const getChats = async () => {
  const response = await api.get('/message/user');
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/message/${chatId}`);
  return response.data;
};

export const sendMessage = async (chatId, content) => {
  const response = await api.post(`/message/send/${chatId}`, { content });
  return response.data;
};

// Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Something went wrong';
      
      if (status === 401 && !window.location.pathname.includes('/login')) {
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Connection error. Please check your internet connection.');
    } else {
      toast.error('Request failed. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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