// services/authService.js
import api from './api';

export const authService = {
  registro: (datos) => api.post('/auth/registro', datos),
  login:    (datos) => api.post('/auth/login', datos),
  me:       ()      => api.get('/auth/me'),
  logout:   ()      => api.post('/auth/logout'),
};