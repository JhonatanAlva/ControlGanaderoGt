/**
 * modules/fincas/fincas.repository.js
 */
"use strict";

const { query } = require("../../config/db");

const findAll = async (usuarioId) => {
  const result = await query(
    `SELECT
       f.*,
       COUNT(a.id) FILTER (WHERE a.estado = 'Activo') AS total_animales
     FROM fincas f
     LEFT JOIN animales a ON a.finca_id = f.id
     WHERE f.usuario_id = $1 AND f.activa = true
     GROUP BY f.id
     ORDER BY f.creado_en DESC`,
    [usuarioId],
  );
  return result.rows;
};

const findById = async (id, usuarioId) => {
  const result = await query(
    `SELECT
       f.*,
       COUNT(a.id) FILTER (WHERE a.estado = 'Activo') AS total_animales
     FROM fincas f
     LEFT JOIN animales a ON a.finca_id = f.id
     WHERE f.id = $1 AND f.usuario_id = $2
     GROUP BY f.id`,
    [id, usuarioId],
  );
  return result.rows[0] || null;
};

const findByNombre = async (nombre, usuarioId) => {
  const result = await query(
    "SELECT id FROM fincas WHERE LOWER(nombre) = LOWER($1) AND usuario_id = $2 AND activa = true",
    [nombre, usuarioId],
  );
  return result.rows[0] || null;
};

const create = async ({
  usuario_id,
  nombre,
  ubicacion,
  region,
  hectareas,
  notas,
}) => {
  const result = await query(
    `INSERT INTO fincas (usuario_id, nombre, ubicacion, region, hectareas, notas)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      usuario_id,
      nombre,
      ubicacion || null,
      region || null,
      hectareas || null,
      notas || null,
    ],
  );
  return result.rows[0];
};

const update = async (id, usuarioId, campos) => {
  const keys = Object.keys(campos).filter((k) => campos[k] !== undefined);
  if (keys.length === 0) return findById(id, usuarioId);

  const sets = keys.map((k, i) => `${k} = $${i + 3}`);
  const values = keys.map((k) => campos[k]);

  const result = await query(
    `UPDATE fincas SET ${sets.join(", ")}
     WHERE id = $1 AND usuario_id = $2
     RETURNING *`,
    [id, usuarioId, ...values],
  );
  return result.rows[0] || null;
};

// Soft delete — marca como inactiva
const deactivate = async (id, usuarioId) => {
  const result = await query(
    `UPDATE fincas SET activa = false
     WHERE id = $1 AND usuario_id = $2
     RETURNING id`,
    [id, usuarioId],
  );
  return result.rows[0] || null;
};

const countActivas = async (usuarioId) => {
  const result = await query(
    "SELECT COUNT(*) AS total FROM fincas WHERE usuario_id = $1 AND activa = true",
    [usuarioId],
  );
  return parseInt(result.rows[0].total, 10);
};

module.exports = {
  findAll,
  findById,
  findByNombre,
  create,
  update,
  deactivate,
  countActivas,
};
