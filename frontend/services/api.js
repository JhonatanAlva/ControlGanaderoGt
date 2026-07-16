// services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/colors';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Agrega el token JWT a cada request automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Maneja errores globales
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
    }
    const mensaje = error.response?.data?.message || 'Error de conexión';
    return Promise.reject({ ...error, mensaje });
  }
);

export default api;