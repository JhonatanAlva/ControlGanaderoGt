/**
 * modules/gastos/gastos.model.js
 *
 * @typedef {object} Gasto
 * @property {string}  id
 * @property {string}  usuario_id
 * @property {string}  [finca_id]
 * @property {string}  [animal_id]
 * @property {string}  tipo            - 'Gasto' | 'Ingreso'
 * @property {string}  categoria
 * @property {string}  [descripcion]
 * @property {number}  monto           - quetzales
 * @property {string}  fecha
 * @property {string}  [proveedor]
 * @property {string}  [factura]
 * @property {string}  [notas]
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

'use strict';

const PUBLIC_FIELDS = [
    'id', 'usuario_id', 'finca_id', 'animal_id',
    'tipo', 'categoria', 'descripcion',
    'monto', 'fecha',
    'proveedor', 'factura', 'notas',
    'creado_en', 'actualizado_en',
    // Campos calculados/joined que agrega gastos.repository.js para listados
    'finca_nombre', 'numero_arete', 'animal_nombre',
];

const toPublic = (row) => {
    if (!row) return null;
    return PUBLIC_FIELDS.reduce((acc, field) => {
        if (field in row) acc[field] = row[field];
        return acc;
    }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };