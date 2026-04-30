'use strict';

const { z } = require('zod');
const { TIPOS_VACUNA, VIAS_APLICACION } = require('../../config/constants');

const registrarVacunaSchema = z.object({
    animal_id: z.string().uuid('animal_id debe ser un UUID válido'),
    finca_id: z.string().uuid().optional(),
    tipo_vacuna: z.enum(TIPOS_VACUNA),
    nombre_producto: z.string().max(200).optional(),
    lote: z.string().max(100).optional(),
    fecha_aplicacion: z.string().date('Formato inválido (YYYY-MM-DD)'),
    proxima_dosis: z.string().date('Formato inválido (YYYY-MM-DD)').optional(),
    dosis: z.string().max(50).optional(),
    via_aplicacion: z.enum(VIAS_APLICACION).optional(),
    veterinario: z.string().max(150).optional(),
    costo: z.coerce.number().positive().optional(),
    notas: z.string().optional(),
});

const actualizarVacunaSchema = registrarVacunaSchema.partial().omit({ animal_id: true });

const filtrosVacunaSchema = z.object({
    animal_id: z.string().uuid().optional(),
    finca_id: z.string().uuid().optional(),
    tipo_vacuna: z.enum(TIPOS_VACUNA).optional(),
    pendientes: z.enum(['true', 'false']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
}).optional();

module.exports = { registrarVacunaSchema, actualizarVacunaSchema, filtrosVacunaSchema };