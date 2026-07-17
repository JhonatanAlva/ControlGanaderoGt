// services/animalesService.js
import api from './api';

const buildFormData = (datos, foto) => {
  const form = new FormData();
  Object.entries(datos).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });
  form.append('foto', {
    uri: foto.uri,
    name: foto.fileName || `foto_${Date.now()}.jpg`,
    type: foto.mimeType || 'image/jpeg',
  });
  return form;
};

export const animalesService = {
  listar: (params = {}) => api.get('/animales', { params }),
  obtener: (id) => api.get(`/animales/${id}`),

  crear: (datos, foto) => {
    if (!foto) return api.post('/animales', datos);
    return api.post('/animales', buildFormData(datos, foto), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  actualizar: (id, datos, foto) => {
    if (!foto) return api.put(`/animales/${id}`, datos);
    return api.put(`/animales/${id}`, buildFormData(datos, foto), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  cambiarEstado: (id, datos) => api.patch(`/animales/${id}/estado`, datos),
  eliminar: (id) => api.delete(`/animales/${id}`),
  registrarPeso: (id, datos) => api.post(`/animales/${id}/pesos`, datos),
  historialPesos: (id) => api.get(`/animales/${id}/pesos`),
};
