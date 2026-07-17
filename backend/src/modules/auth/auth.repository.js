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

const findByIdConPassword = async (id) => {
  const result = await query("SELECT * FROM usuarios WHERE id = $1", [id]);
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

const update = async (id, campos) => {
  const keys = Object.keys(campos).filter((k) => campos[k] !== undefined);
  if (keys.length === 0) return findById(id);

  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  const values = keys.map((k) => campos[k]);

  const result = await query(
    `UPDATE usuarios SET ${sets.join(", ")}
     WHERE id = $1
     RETURNING id, nombre, email, telefono, region, whatsapp, foto_url, plan, activo, creado_en, actualizado_en`,
    [id, ...values],
  );
  return result.rows[0] || null;
};

const updatePassword = async (id, passwordHash) => {
  await query("UPDATE usuarios SET password_hash = $2 WHERE id = $1", [
    id,
    passwordHash,
  ]);
};

module.exports = {
  findByEmail,
  findById,
  findByIdConPassword,
  create,
  update,
  updatePassword,
};
