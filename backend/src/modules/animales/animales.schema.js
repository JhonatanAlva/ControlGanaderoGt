/**
 * modules/animales/animales.schema.js
 * Usa z.coerce para campos numéricos ya que form-data los envía como strings.
 */
'use strict';

const { z } = require('zod');
const {
  RAZAS, SEXOS, TIPOS_ANIMAL, ESTADOS_ANIMAL, PROPOSITOS,
} = require('../../config/constants');

const crearAnimalSchema = z.object({
  numero_arete: z.string().min(1).max(50),
  nombre: z.string().max(100).optional(),
  raza: z.enum(RAZAS),
  sexo: z.enum(SEXOS),
  tipo: z.enum(TIPOS_ANIMAL),
  proposito: z.enum(PROPOSITOS).optional(),
  estado: z.enum(ESTADOS_ANIMAL).default('Activo'),
  finca_id: z.string().uuid('finca_id debe ser un UUID válido').optional(),
  fecha_nacimiento: z.string().date('Formato de fecha inválido (YYYY-MM-DD)').optional(),
  // coerce convierte "480" → 480 automáticamente (necesario con form-data)
  peso_actual: z.coerce.number().positive().optional(),
  peso_compra: z.coerce.number().positive().optional(),
  precio_compra: z.coerce.number().positive().optional(),
  madre_id: z.string().uuid().optional(),
  padre_id: z.string().uuid().optional(),
  madre_arete: z.string().max(50).optional(),
  padre_arete: z.string().max(50).optional(),
  procedencia: z.string().max(255).optional(),
  notas: z.string().optional(),
});

const actualizarAnimalSchema = crearAnimalSchema.partial().omit({ numero_arete: true });

const cambiarEstadoSchema = z.object({
  estado: z.enum(ESTADOS_ANIMAL),
  fecha_venta: z.string().date().optional(),
  precio_venta: z.coerce.number().positive().optional(),
  notas: z.string().optional(),
}).refine(
  (data) => data.estado !== 'Vendido' || (data.fecha_venta && data.precio_venta),
  { message: 'Para marcar como Vendido se requiere fecha_venta y precio_venta.' }
);

const registrarPesoSchema = z.object({
  peso: z.coerce.number().positive('El peso debe ser mayor a 0'),
  fecha: z.string().date('Formato de fecha inválido (YYYY-MM-DD)'),
  notas: z.string().optional(),
});

const filtrosAnimalSchema = z.object({
  estado: z.enum(ESTADOS_ANIMAL).optional(),
  sexo: z.enum(SEXOS).optional(),
  tipo: z.enum(TIPOS_ANIMAL).optional(),
  raza: z.enum(RAZAS).optional(),
  finca_id: z.string().uuid().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
}).optional();

module.exports = {
  crearAnimalSchema,
  actualizarAnimalSchema,
  cambiarEstadoSchema,
  registrarPesoSchema,
  filtrosAnimalSchema,
};