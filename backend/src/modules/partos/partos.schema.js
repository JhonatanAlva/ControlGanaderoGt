/**
 * modules/partos/partos.schema.js
 */
'use strict';

const { z } = require('zod');
const {
    TIPOS_REPRODUCCION, TIPOS_PARTO, RESULTADOS_PARTO, SEXOS,
} = require('../../config/constants');

// ── Registrar servicio / inseminación ────────────────────────────────────────
const registrarServicioSchema = z.object({
    madre_id: z.string().uuid('madre_id debe ser UUID válido'),
    padre_id: z.string().uuid().optional(),
    padre_arete: z.string().max(50).optional(),
    finca_id: z.string().uuid().optional(),
    tipo_reproduccion: z.enum(TIPOS_REPRODUCCION),
    fecha_servicio: z.string().date('Formato inválido (YYYY-MM-DD)'),
    notas: z.string().optional(),
});

// ── Registrar resultado del parto ────────────────────────────────────────────
const registrarPartoSchema = z.object({
    fecha_parto: z.string().date('Formato inválido (YYYY-MM-DD)'),
    tipo_parto: z.enum(TIPOS_PARTO),
    resultado: z.enum(RESULTADOS_PARTO),
    cria_arete: z.string().max(50).optional(),
    cria_sexo: z.enum(SEXOS).optional(),
    peso_nacimiento: z.number().positive().optional(),
    asistencia_veterinaria: z.boolean().default(false),
    costo_veterinario: z.number().positive().optional(),
    notas: z.string().optional(),
}).refine(
    (d) => d.resultado === 'Aborto' || d.resultado === 'Muerto' || d.cria_arete,
    { message: 'Se requiere cria_arete cuando la cría nace viva.' }
);

const actualizarPartoSchema = z.object({
    padre_id: z.string().uuid().optional(),
    padre_arete: z.string().max(50).optional(),
    finca_id: z.string().uuid().optional(),
    tipo_reproduccion: z.enum(TIPOS_REPRODUCCION).optional(),
    fecha_servicio: z.string().date().optional(),
    fecha_parto: z.string().date().optional(),
    tipo_parto: z.enum(TIPOS_PARTO).optional(),
    resultado: z.enum(RESULTADOS_PARTO).optional(),
    cria_arete: z.string().max(50).optional(),
    cria_sexo: z.enum(SEXOS).optional(),
    peso_nacimiento: z.number().positive().optional(),
    asistencia_veterinaria: z.boolean().optional(),
    costo_veterinario: z.number().positive().optional(),
    notas: z.string().optional(),
});

const filtrosPartoSchema = z.object({
    madre_id: z.string().uuid().optional(),
    finca_id: z.string().uuid().optional(),
    resultado: z.enum(RESULTADOS_PARTO).optional(),
    proximos: z.enum(['true', 'false']).optional(), // partos esperados próximos 30 días
    page: z.string().optional(),
    limit: z.string().optional(),
}).optional();

module.exports = {
    registrarServicioSchema,
    registrarPartoSchema,
    actualizarPartoSchema,
    filtrosPartoSchema,
};