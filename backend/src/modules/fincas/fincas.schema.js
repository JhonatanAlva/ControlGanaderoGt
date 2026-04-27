/**
 * modules/fincas/fincas.schema.js
 */
"use strict";

const { z } = require("zod");
const { REGIONES_GUATEMALA } = require("../../config/constants");

const crearFincaSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(200),
  ubicacion: z.string().max(255).optional(),
  region: z.enum(REGIONES_GUATEMALA).optional(),
  hectareas: z.number().positive().optional(),
  notas: z.string().optional(),
});

const actualizarFincaSchema = crearFincaSchema.partial();

module.exports = { crearFincaSchema, actualizarFincaSchema };
