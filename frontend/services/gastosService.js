// services/gastosService.js
import api from './api';

export const gastosService = {
  resumenMensual: (anio) => api.get('/gastos/resumen/mensual', { params: { anio } }),
};
