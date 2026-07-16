// services/animalesService.js
import api from './api';

export const animalesService = {
  listar: (params = {}) => api.get('/animales', { params }),
};
