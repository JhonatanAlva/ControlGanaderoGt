/**
 * modules/comunidad/comunidad.schema.js
 */
'use strict';

const { z } = require('zod');
const { TIPOS_POST, REGIONES_GUATEMALA } = require('../../config/constants');

const crearPostSchema = z.object({
    tipo: z.enum(TIPOS_POST),
    titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(255),
    contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
    region: z.enum(REGIONES_GUATEMALA),
    precio: z.number().positive().optional(),
    raza_animal: z.string().max(100).optional(),
    peso_animal: z.number().positive().optional(),
    contacto_whatsapp: z.string().max(20).optional(),
});

const actualizarPostSchema = crearPostSchema.partial();

const filtrosPostSchema = z.object({
    tipo: z.enum(TIPOS_POST).optional(),
    region: z.enum(REGIONES_GUATEMALA).optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
}).optional();

module.exports = { crearPostSchema, actualizarPostSchema, filtrosPostSchema };