// services/animalesService.js
import api from './api';

export const animalesService = {
  listar: (params = {}) => api.get('/animales', { params }),
  obtener: (id) => api.get(`/animales/${id}`),
  crear: (datos) => api.post('/animales', datos),
  actualizar: (id, datos) => api.put(`/animales/${id}`, datos),
  cambiarEstado: (id, datos) => api.patch(`/animales/${id}/estado`, datos),
  eliminar: (id) => api.delete(`/animales/${id}`),
  registrarPeso: (id, datos) => api.post(`/animales/${id}/pesos`, datos),
  historialPesos: (id) => api.get(`/animales/${id}/pesos`),
};
