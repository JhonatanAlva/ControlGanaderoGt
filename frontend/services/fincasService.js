// services/fincasService.js
import api from './api';

export const fincasService = {
  listar: () => api.get('/fincas'),
  obtener: (id) => api.get(`/fincas/${id}`),
  crear: (datos) => api.post('/fincas', datos),
  actualizar: (id, datos) => api.put(`/fincas/${id}`, datos),
  eliminar: (id) => api.delete(`/fincas/${id}`),
};
