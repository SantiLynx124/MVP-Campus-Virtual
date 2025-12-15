/**
 * Configuración de Axios para las peticiones al backend
 */

import axios from 'axios';

// Normaliza la base URL para evitar dobles slash y soportar VITE_API_URL
const apiBase = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
  return envUrl ? `${envUrl}/api` : '/api';
})();

const api = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s de espera para prevenir cuelgues
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      // Evitar loop si ya estamos en login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;


