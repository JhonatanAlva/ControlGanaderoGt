/**
 * modules/fincas/fincas.model.js
 *
 * @typedef {object} Finca
 * @property {string}  id
 * @property {string}  usuario_id
 * @property {string}  nombre
 * @property {string}  [ubicacion]
 * @property {string}  [region]       - Departamento de Guatemala
 * @property {number}  [hectareas]
 * @property {string}  [notas]
 * @property {boolean} activa
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

"use strict";

const PUBLIC_FIELDS = [
  "id",
  "usuario_id",
  "nombre",
  "ubicacion",
  "region",
  "hectareas",
  "notas",
  "activa",
  "creado_en",
  "actualizado_en",
];

const toPublic = (row) => {
  if (!row) return null;
  return PUBLIC_FIELDS.reduce((acc, field) => {
    if (field in row) acc[field] = row[field];
    return acc;
  }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };
