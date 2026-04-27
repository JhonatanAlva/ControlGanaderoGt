/**
 * config/env.js
 * Valida que todas las variables de entorno necesarias existan al arrancar.
 * Si falta alguna obligatoria, el proceso termina con un mensaje claro.
 */

'use strict';

require('dotenv').config();

const required = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`\n  Faltan variables de entorno obligatorias:\n   ${missing.join(', ')}\n`);
  console.error('   Revisa tu archivo backend/.env\n');
  process.exit(1);
}

const env = {
  // Servidor
  NODE_ENV:    process.env.NODE_ENV || 'development',
  PORT:        parseInt(process.env.PORT, 10) || 3000,
  isDev:       process.env.NODE_ENV === 'development',
  isProd:      process.env.NODE_ENV === 'production',

  // Base de datos
  db: {
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10) || 5432,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name:     process.env.DB_NAME,
  },

  // JWT
  jwt: {
    secret:    process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey:    process.env.CLOUDINARY_API_KEY    || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // Pagadito
  pagadito: {
    uid: process.env.PAGADITO_UID || '',
    wsk: process.env.PAGADITO_WSK || '',
  },
};

module.exports = env;