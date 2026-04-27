/**
 * config/jwt.js
 * Helpers para generar y verificar JSON Web Tokens.
 */

'use strict';

const jwt = require('jsonwebtoken');
const env = require('./env');

/**
 * Genera un JWT con el payload dado.
 * @param {object} payload  - Datos a incluir (ej: { id, email, plan })
 * @returns {string}        - Token firmado
 */
const signToken = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

/**
 * Verifica y decodifica un JWT.
 * Lanza error si el token es inválido o expiró.
 * @param {string} token
 * @returns {object} - Payload decodificado
 */
const verifyToken = (token) => jwt.verify(token, env.jwt.secret);

module.exports = { signToken, verifyToken };