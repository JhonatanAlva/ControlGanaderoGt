// services/partosService.js
import api from './api';

export const partosService = {
  listar: (params = {}) => api.get('/partos', { params }),
  obtener: (id) => api.get(`/partos/${id}`),
  historialMadre: (madreId) => api.get(`/partos/madre/${madreId}`),
  registrarServicio: (datos) => api.post('/partos/servicio', datos),
  registrarResultado: (id, datos) => api.post(`/partos/${id}/resultado`, datos),
  actualizar: (id, datos) => api.put(`/partos/${id}`, datos),
  eliminar: (id) => api.delete(`/partos/${id}`),
};
