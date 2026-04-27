/**
 * modules/auth/auth.model.js
 * Define la estructura del objeto Usuario tal como vive en la aplicación.
 * No es un ORM — es documentación viva + helpers de transformación.
 *
 * Columnas en PostgreSQL → tabla: usuarios
 */

"use strict";

/**
 * Campos públicos que se pueden devolver al cliente.
 * Nunca incluir password_hash aquí.
 */
const PUBLIC_FIELDS = [
  "id",
  "nombre",
  "email",
  "telefono",
  "region",
  "whatsapp",
  "foto_url",
  "plan",
  "activo",
  "creado_en",
  "actualizado_en",
];

/**
 * Transforma una fila de la DB al objeto público del usuario.
 * Elimina campos sensibles como password_hash.
 *
 * @param {object} row  - Fila cruda de PostgreSQL
 * @returns {object}    - Usuario seguro para devolver al cliente
 */
const toPublic = (row) => {
  if (!row) return null;
  return PUBLIC_FIELDS.reduce((acc, field) => {
    if (field in row) acc[field] = row[field];
    return acc;
  }, {});
};

/**
 * Estructura de referencia del modelo (como documentación).
 *
 * @typedef {object} Usuario
 * @property {string}  id             - UUID
 * @property {string}  nombre         - Nombre completo
 * @property {string}  email          - Email único
 * @property {string}  [telefono]     - Teléfono opcional
 * @property {string}  [region]       - Departamento de Guatemala
 * @property {string}  [whatsapp]     - Número de WhatsApp
 * @property {string}  [foto_url]     - URL de foto de perfil
 * @property {string}  plan           - 'free' | 'pro'
 * @property {boolean} activo         - Si la cuenta está activa
 * @property {Date}    creado_en      - Fecha de registro
 * @property {Date}    actualizado_en - Última actualización
 */

module.exports = { toPublic, PUBLIC_FIELDS };
