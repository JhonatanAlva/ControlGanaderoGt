// services/vacunasService.js
import api from './api';

export const vacunasService = {
  listar: (params = {}) => api.get('/vacunas', { params }),
};
