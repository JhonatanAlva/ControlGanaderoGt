// services/comunidadService.js
import api from './api';

export const comunidadService = {
  listar: (params = {}) => api.get('/comunidad', { params }),
  obtener: (id) => api.get(`/comunidad/${id}`),
  misPosts: () => api.get('/comunidad/mis-posts'),
  crear: (datos) => api.post('/comunidad', datos),
  actualizar: (id, datos) => api.put(`/comunidad/${id}`, datos),
  eliminar: (id) => api.delete(`/comunidad/${id}`),
  toggleLike: (id) => api.post(`/comunidad/${id}/like`),
};
