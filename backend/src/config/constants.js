/**
 * config/constants.js
 * Constantes y enums del dominio ganadero.
 * Deben coincidir con los ENUM types definidos en PostgreSQL.
 */

'use strict';

const RAZAS = [
  'Brahman', 'Holstein', 'Simmental', 'Charolais', 'Angus',
  'Cebu', 'Criollo', 'Brown Swiss', 'Gyr', 'Nelore', 'Otra',
];

const SEXOS = ['Macho', 'Hembra'];

const TIPOS_ANIMAL = ['Vaca', 'Toro', 'Novillo', 'Novilla', 'Ternero', 'Ternera', 'Buey'];

const ESTADOS_ANIMAL = ['Activo', 'Vendido', 'Muerto', 'Robado'];

const PROPOSITOS = ['Carne', 'Leche', 'Doble propósito', 'Reproducción'];

const TIPOS_VACUNA = [
  'Aftosa', 'Brucelosis', 'Carbunco', 'Rabia', 'IBR', 'DVB',
  'Leptospirosis', 'Clostridiosis', 'Desparasitante', 'Vitaminas', 'Otra',
];

const VIAS_APLICACION = ['Subcutánea', 'Intramuscular', 'Oral', 'Intranasal'];

const TIPOS_REPRODUCCION = [
  'Monta natural', 'Inseminación artificial', 'Transferencia de embriones',
];

const TIPOS_PARTO    = ['Normal', 'Distócico', 'Cesárea', 'Aborto'];
const RESULTADOS_PARTO = ['Vivo', 'Muerto', 'Gemelar', 'Aborto'];

const CATEGORIAS_GASTO = [
  'Alimentación', 'Veterinario', 'Vacunas', 'Medicamentos',
  'Mano de obra', 'Infraestructura', 'Transporte',
  'Compra de animales', 'Venta de animales', 'Otros',
];

const TIPOS_MOVIMIENTO = ['Gasto', 'Ingreso'];

const TIPOS_POST = [
  'Precio de mercado', 'Alerta sanitaria', 'Venta de animal',
  'Compra de animal', 'Consejo', 'Pregunta',
];

const REGIONES_GUATEMALA = [
  'Alta Verapaz', 'Baja Verapaz', 'Chiquimula', 'El Progreso',
  'Escuintla', 'Guatemala', 'Huehuetenango', 'Izabal', 'Jalapa',
  'Jutiapa', 'Petén', 'Quetzaltenango', 'Quiché', 'Retalhuleu',
  'Sacatepéquez', 'San Marcos', 'Santa Rosa', 'Sololá',
  'Suchitepéquez', 'Totonicapán', 'Zacapa',
];

const PLANES = ['free', 'pro'];

// Días de gestación estándar para bovinos
const DIAS_GESTACION = 280;

// Límites del plan free
const LIMITES_FREE = {
  animales: 10,
  fincas:   1,
};

module.exports = {
  RAZAS,
  SEXOS,
  TIPOS_ANIMAL,
  ESTADOS_ANIMAL,
  PROPOSITOS,
  TIPOS_VACUNA,
  VIAS_APLICACION,
  TIPOS_REPRODUCCION,
  TIPOS_PARTO,
  RESULTADOS_PARTO,
  CATEGORIAS_GASTO,
  TIPOS_MOVIMIENTO,
  TIPOS_POST,
  REGIONES_GUATEMALA,
  PLANES,
  DIAS_GESTACION,
  LIMITES_FREE,
};