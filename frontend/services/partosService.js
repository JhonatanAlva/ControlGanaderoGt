// services/partosService.js
import api from './api';

export const partosService = {
  listar: (params = {}) => api.get('/partos', { params }),
};
