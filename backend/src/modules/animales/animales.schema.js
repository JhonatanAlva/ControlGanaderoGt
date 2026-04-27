/**
 * modules/animales/animales.schema.js
 */
"use strict";

const { z } = require("zod");
const {
  RAZAS,
  SEXOS,
  TIPOS_ANIMAL,
  ESTADOS_ANIMAL,
  PROPOSITOS,
} = require("../../config/constants");

// ── Crear animal ─────────────────────────────────────────────────────────────
const crearAnimalSchema = z.object({
  numero_arete: z.string().min(1).max(50),
  nombre: z.string().max(100).optional(),
  raza: z.enum(RAZAS),
  sexo: z.enum(SEXOS),
  tipo: z.enum(TIPOS_ANIMAL),
  proposito: z.enum(PROPOSITOS).optional(),
  estado: z.enum(ESTADOS_ANIMAL).default("Activo"),
  finca_id: z.string().uuid("finca_id debe ser un UUID válido").optional(),
  fecha_nacimiento: z
    .string()
    .date("Formato de fecha inválido (YYYY-MM-DD)")
    .optional(),
  peso_actual: z.number().positive().optional(),
  peso_compra: z.number().positive().optional(),
  precio_compra: z.number().positive().optional(),
  madre_id: z.string().uuid().optional(),
  padre_id: z.string().uuid().optional(),
  madre_arete: z.string().max(50).optional(),
  padre_arete: z.string().max(50).optional(),
  procedencia: z.string().max(255).optional(),
  notas: z.string().optional(),
});

// ── Actualizar animal (todos los campos opcionales) ──────────────────────────
const actualizarAnimalSchema = crearAnimalSchema
  .partial()
  .omit({ numero_arete: true });

// ── Cambiar estado (venta, muerte, robo) ─────────────────────────────────────
const cambiarEstadoSchema = z
  .object({
    estado: z.enum(ESTADOS_ANIMAL),
    fecha_venta: z.string().date().optional(),
    precio_venta: z.number().positive().optional(),
    notas: z.string().optional(),
  })
  .refine(
    (data) =>
      data.estado !== "Vendido" || (data.fecha_venta && data.precio_venta),
    {
      message:
        "Para marcar como Vendido se requiere fecha_venta y precio_venta.",
    },
  );

// ── Registrar peso ────────────────────────────────────────────────────────────
const registrarPesoSchema = z.object({
  peso: z.number().positive("El peso debe ser mayor a 0"),
  fecha: z.string().date("Formato de fecha inválido (YYYY-MM-DD)"),
  notas: z.string().optional(),
});

// ── Filtros de listado ────────────────────────────────────────────────────────
const filtrosAnimalSchema = z
  .object({
    estado: z.enum(ESTADOS_ANIMAL).optional(),
    sexo: z.enum(SEXOS).optional(),
    tipo: z.enum(TIPOS_ANIMAL).optional(),
    raza: z.enum(RAZAS).optional(),
    finca_id: z.string().uuid().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  })
  .optional();

module.exports = {
  crearAnimalSchema,
  actualizarAnimalSchema,
  cambiarEstadoSchema,
  registrarPesoSchema,
  filtrosAnimalSchema,
};
