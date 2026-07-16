/**
 * modules/vacunas/vacunas.model.js
 *
 * @typedef {object} Vacuna
 * @property {string}  id
 * @property {string}  animal_id
 * @property {string}  [finca_id]
 * @property {string}  tipo_vacuna       - Ver TIPOS_VACUNA en constants.js
 * @property {string}  [nombre_producto]
 * @property {string}  [lote]
 * @property {string}  fecha_aplicacion
 * @property {string}  [proxima_dosis]
 * @property {boolean} alerta_enviada
 * @property {string}  [dosis]           - ej: "2ml"
 * @property {string}  [via_aplicacion]
 * @property {string}  [veterinario]
 * @property {number}  [costo]           - quetzales
 * @property {string}  [notas]
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

'use strict';

const PUBLIC_FIELDS = [
    'id', 'animal_id', 'finca_id',
    'tipo_vacuna', 'nombre_producto', 'lote',
    'fecha_aplicacion', 'proxima_dosis', 'alerta_enviada',
    'dosis', 'via_aplicacion', 'veterinario',
    'costo', 'notas',
    'creado_en', 'actualizado_en',
    // Campos calculados/joined que agrega vacunas.repository.js para listados
    'numero_arete', 'animal_nombre', 'finca_nombre', 'urgencia',
];

const toPublic = (row) => {
    if (!row) return null;
    return PUBLIC_FIELDS.reduce((acc, field) => {
        if (field in row) acc[field] = row[field];
        return acc;
    }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };