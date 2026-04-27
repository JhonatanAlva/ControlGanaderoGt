/**
 * modules/auth/auth.repository.js
 */
"use strict";

const { query } = require("../../config/db");

const findByEmail = async (email) => {
  const result = await query(
    "SELECT * FROM usuarios WHERE email = $1 LIMIT 1",
    [email],
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query(
    "SELECT id, nombre, email, telefono, region, whatsapp, foto_url, plan, activo, creado_en FROM usuarios WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
};

const create = async ({
  nombre,
  email,
  passwordHash,
  telefono,
  region,
  whatsapp,
}) => {
  const result = await query(
    `INSERT INTO usuarios (nombre, email, password_hash, telefono, region, whatsapp)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nombre, email, telefono, region, whatsapp, plan, creado_en`,
    [
      nombre,
      email,
      passwordHash,
      telefono || null,
      region || null,
      whatsapp || null,
    ],
  );
  return result.rows[0];
};

module.exports = { findByEmail, findById, create };
