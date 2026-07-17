/**
 * modules/comunidad/comunidad.model.js
 *
 * @typedef {object} ComunidadPost
 * @property {string}  id
 * @property {string}  autor_id
 * @property {string}  tipo              - Ver TIPOS_POST en constants.js
 * @property {string}  titulo
 * @property {string}  contenido
 * @property {string}  region            - Departamento de Guatemala
 * @property {number}  [precio]          - quetzales (compra/venta)
 * @property {string}  [raza_animal]
 * @property {number}  [peso_animal]     - libras
 * @property {string}  [foto_url]
 * @property {string}  [contacto_whatsapp]
 * @property {number}  likes
 * @property {boolean} activo
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

'use strict';

const PUBLIC_FIELDS = [
    'id', 'autor_id',
    'tipo', 'titulo', 'contenido', 'region',
    'precio', 'raza_animal', 'peso_animal',
    'foto_url', 'contacto_whatsapp',
    'likes', 'activo',
    'creado_en', 'actualizado_en',
    // Campos calculados/joined que agrega comunidad.repository.js para listados
    'autor_nombre', 'autor_region', 'yo_di_like',
];

const toPublic = (row) => {
    if (!row) return null;
    return PUBLIC_FIELDS.reduce((acc, field) => {
        if (field in row) acc[field] = row[field];
        return acc;
    }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };