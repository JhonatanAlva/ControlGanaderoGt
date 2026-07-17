// constants/enums.js
// Debe coincidir con backend/src/config/constants.js y los ENUM de Postgres.

export const RAZAS = [
  'Brahman', 'Holstein', 'Simmental', 'Charolais', 'Angus',
  'Cebu', 'Criollo', 'Brown Swiss', 'Gyr', 'Nelore', 'Otra',
];

export const SEXOS = ['Macho', 'Hembra'];

export const TIPOS_ANIMAL = ['Vaca', 'Toro', 'Novillo', 'Novilla', 'Ternero', 'Ternera', 'Buey'];

export const ESTADOS_ANIMAL = ['Activo', 'Vendido', 'Muerto', 'Robado'];

export const PROPOSITOS = ['Carne', 'Leche', 'Doble propósito', 'Reproducción'];

export const TIPOS_VACUNA = [
  'Aftosa', 'Brucelosis', 'Carbunco', 'Rabia', 'IBR', 'DVB',
  'Leptospirosis', 'Clostridiosis', 'Desparasitante', 'Vitaminas', 'Otra',
];

export const VIAS_APLICACION = ['Subcutánea', 'Intramuscular', 'Oral', 'Intranasal'];

export const TIPOS_REPRODUCCION = [
  'Monta natural', 'Inseminación artificial', 'Transferencia de embriones',
];

export const TIPOS_PARTO = ['Normal', 'Distócico', 'Cesárea', 'Aborto'];
export const RESULTADOS_PARTO = ['Vivo', 'Muerto', 'Gemelar', 'Aborto'];

export const CATEGORIAS_GASTO = [
  'Alimentación', 'Veterinario', 'Vacunas', 'Medicamentos',
  'Mano de obra', 'Infraestructura', 'Transporte',
  'Compra de animales', 'Venta de animales', 'Otros',
];

export const TIPOS_MOVIMIENTO = ['Gasto', 'Ingreso'];

export const TIPOS_POST = [
  'Precio de mercado', 'Alerta sanitaria', 'Venta de animal',
  'Compra de animal', 'Consejo', 'Pregunta',
];

export const REGIONES_GUATEMALA = [
  'Alta Verapaz', 'Baja Verapaz', 'Chiquimula', 'El Progreso',
  'Escuintla', 'Guatemala', 'Huehuetenango', 'Izabal', 'Jalapa',
  'Jutiapa', 'Petén', 'Quetzaltenango', 'Quiché', 'Retalhuleu',
  'Sacatepéquez', 'San Marcos', 'Santa Rosa', 'Sololá',
  'Suchitepéquez', 'Totonicapán', 'Zacapa',
];

export const LIMITES_FREE = { animales: 10, fincas: 1 };
