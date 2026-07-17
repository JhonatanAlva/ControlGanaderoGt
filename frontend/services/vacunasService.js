// services/vacunasService.js
import api from './api';

export const vacunasService = {
  listar: (params = {}) => api.get('/vacunas', { params }),
  obtener: (id) => api.get(`/vacunas/${id}`),
  historialAnimal: (animalId) => api.get(`/vacunas/animal/${animalId}`),
  registrar: (datos) => api.post('/vacunas', datos),
  actualizar: (id, datos) => api.put(`/vacunas/${id}`, datos),
  eliminar: (id) => api.delete(`/vacunas/${id}`),
};
