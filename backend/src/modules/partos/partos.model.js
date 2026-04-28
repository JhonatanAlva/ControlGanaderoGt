/**
 * modules/partos/partos.model.js
 *
 * @typedef {object} Parto
 * @property {string}  id
 * @property {string}  madre_id
 * @property {string}  [padre_id]
 * @property {string}  [padre_arete]
 * @property {string}  [finca_id]
 * @property {string}  tipo_reproduccion
 * @property {string}  [fecha_servicio]
 * @property {string}  [fecha_parto_esperada]   - calculada automáticamente (trigger)
 * @property {string}  [fecha_parto]
 * @property {string}  [tipo_parto]
 * @property {string}  [resultado]
 * @property {string}  [cria_id]
 * @property {string}  [cria_arete]
 * @property {string}  [cria_sexo]
 * @property {number}  [peso_nacimiento]        - libras
 * @property {boolean} asistencia_veterinaria
 * @property {number}  [costo_veterinario]      - quetzales
 * @property {string}  [notas]
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

'use strict';

const PUBLIC_FIELDS = [
    'id', 'madre_id', 'padre_id', 'padre_arete', 'finca_id',
    'tipo_reproduccion',
    'fecha_servicio', 'fecha_parto_esperada', 'fecha_parto',
    'tipo_parto', 'resultado',
    'cria_id', 'cria_arete', 'cria_sexo', 'peso_nacimiento',
    'asistencia_veterinaria', 'costo_veterinario',
    'notas', 'creado_en', 'actualizado_en',
];

const toPublic = (row) => {
    if (!row) return null;
    return PUBLIC_FIELDS.reduce((acc, field) => {
        if (field in row) acc[field] = row[field];
        return acc;
    }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };