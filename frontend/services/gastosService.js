// services/gastosService.js
import api from './api';

export const gastosService = {
  listar: (params = {}) => api.get('/gastos', { params }),
  obtener: (id) => api.get(`/gastos/${id}`),
  crear: (datos) => api.post('/gastos', datos),
  actualizar: (id, datos) => api.put(`/gastos/${id}`, datos),
  eliminar: (id) => api.delete(`/gastos/${id}`),
  resumenMensual: (anio) => api.get('/gastos/resumen/mensual', { params: { anio } }),
  resumenCategoria: (params = {}) => api.get('/gastos/resumen/categoria', { params }),
};
