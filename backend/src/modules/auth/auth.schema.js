/**
 * modules/auth/auth.schema.js
 */
"use strict";

const { z } = require("zod");
const { REGIONES_GUATEMALA } = require("../../config/constants");

const registroSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150),
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  telefono: z.string().max(20).optional(),
  region: z.enum(REGIONES_GUATEMALA).optional(),
  whatsapp: z.string().max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
  password: z.string().min(1, "La contraseña es requerida"),
});

module.exports = { registroSchema, loginSchema };
