/**
 * modules/animales/animales.repository.js
 * Todas las queries SQL del módulo de animales.
 */
"use strict";

const { query, getClient } = require("../../config/db");
const paginate = require("../../utils/paginate");

// ── Listar con filtros y paginación ──────────────────────────────────────────
const findAll = async (usuarioId, filtros = {}) => {
  const { page, limit, offset } = paginate(filtros);
  const values = [usuarioId];
  const where = ["a.usuario_id = $1"];
  let idx = 2;

  if (filtros.estado) {
    where.push(`a.estado = $${idx++}`);
    values.push(filtros.estado);
  }
  if (filtros.sexo) {
    where.push(`a.sexo = $${idx++}`);
    values.push(filtros.sexo);
  }
  if (filtros.tipo) {
    where.push(`a.tipo = $${idx++}`);
    values.push(filtros.tipo);
  }
  if (filtros.raza) {
    where.push(`a.raza = $${idx++}`);
    values.push(filtros.raza);
  }
  if (filtros.finca_id) {
    where.push(`a.finca_id = $${idx++}`);
    values.push(filtros.finca_id);
  }

  if (filtros.search) {
    where.push(`(a.numero_arete ILIKE $${idx} OR a.nombre ILIKE $${idx})`);
    values.push(`%${filtros.search}%`);
    idx++;
  }

  const whereClause = where.join(" AND ");

  // Total para paginación
  const countResult = await query(
    `SELECT COUNT(*) AS total FROM animales a WHERE ${whereClause}`,
    values,
  );
  const total = parseInt(countResult.rows[0].total, 10);

  // Datos paginados con info de finca
  const rows = await query(
    `SELECT
        a.*,
        f.nombre AS finca_nombre,
        m.numero_arete AS madre_arete_ref,
        p.numero_arete AS padre_arete_ref
     FROM animales a
     LEFT JOIN fincas   f ON f.id = a.finca_id
     LEFT JOIN animales m ON m.id = a.madre_id
     LEFT JOIN animales p ON p.id = a.padre_id
     WHERE ${whereClause}
     ORDER BY a.creado_en DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );

  return { rows: rows.rows, total, page, limit };
};

// ── Buscar por ID (solo del usuario autenticado) ─────────────────────────────
const findById = async (id, usuarioId) => {
  const result = await query(
    `SELECT
        a.*,
        f.nombre AS finca_nombre,
        m.numero_arete AS madre_arete_ref,
        p.numero_arete AS padre_arete_ref
     FROM animales a
     LEFT JOIN fincas   f ON f.id = a.finca_id
     LEFT JOIN animales m ON m.id = a.madre_id
     LEFT JOIN animales p ON p.id = a.padre_id
     WHERE a.id = $1 AND a.usuario_id = $2`,
    [id, usuarioId],
  );
  return result.rows[0] || null;
};

// ── Buscar por arete (dentro del usuario) ────────────────────────────────────
const findByArete = async (numeroArete, usuarioId) => {
  const result = await query(
    "SELECT * FROM animales WHERE numero_arete = $1 AND usuario_id = $2",
    [numeroArete, usuarioId],
  );
  return result.rows[0] || null;
};

// ── Crear ────────────────────────────────────────────────────────────────────
const create = async (datos) => {
  const {
    usuario_id,
    finca_id,
    numero_arete,
    nombre,
    raza,
    sexo,
    tipo,
    proposito,
    estado,
    fecha_nacimiento,
    peso_actual,
    peso_compra,
    precio_compra,
    madre_id,
    padre_id,
    madre_arete,
    padre_arete,
    procedencia,
    notas,
  } = datos;

  const result = await query(
    `INSERT INTO animales (
        usuario_id, finca_id, numero_arete, nombre, raza, sexo, tipo,
        proposito, estado, fecha_nacimiento, peso_actual, peso_compra,
        precio_compra, madre_id, padre_id, madre_arete, padre_arete,
        procedencia, notas
     ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
     ) RETURNING *`,
    [
      usuario_id,
      finca_id || null,
      numero_arete,
      nombre || null,
      raza,
      sexo,
      tipo,
      proposito || null,
      estado || "Activo",
      fecha_nacimiento || null,
      peso_actual || null,
      peso_compra || null,
      precio_compra || null,
      madre_id || null,
      padre_id || null,
      madre_arete || null,
      padre_arete || null,
      procedencia || null,
      notas || null,
    ],
  );
  return result.rows[0];
};

// ── Actualizar ───────────────────────────────────────────────────────────────
const update = async (id, usuarioId, campos) => {
  const keys = Object.keys(campos).filter((k) => campos[k] !== undefined);
  if (keys.length === 0) return findById(id, usuarioId);

  const sets = keys.map((k, i) => `${k} = $${i + 3}`);
  const values = keys.map((k) => campos[k]);

  const result = await query(
    `UPDATE animales SET ${sets.join(", ")}
     WHERE id = $1 AND usuario_id = $2
     RETURNING *`,
    [id, usuarioId, ...values],
  );
  return result.rows[0] || null;
};

// ── Cambiar estado (venta, muerte, robo) ─────────────────────────────────────
const cambiarEstado = async (
  id,
  usuarioId,
  { estado, fecha_venta, precio_venta, notas },
) => {
  const result = await query(
    `UPDATE animales
     SET estado = $3, fecha_venta = $4, precio_venta = $5, notas = COALESCE($6, notas)
     WHERE id = $1 AND usuario_id = $2
     RETURNING *`,
    [
      id,
      usuarioId,
      estado,
      fecha_venta || null,
      precio_venta || null,
      notas || null,
    ],
  );
  return result.rows[0] || null;
};

// ── Eliminar (soft delete → estado = 'Muerto' es preferible, pero se ofrece hard delete) ──
const remove = async (id, usuarioId) => {
  const result = await query(
    "DELETE FROM animales WHERE id = $1 AND usuario_id = $2 RETURNING id",
    [id, usuarioId],
  );
  return result.rows[0] || null;
};

// ── Historial de pesos ────────────────────────────────────────────────────────
const addPeso = async (animalId, { peso, fecha, notas }) => {
  // Inserta en historial Y actualiza peso_actual en animales (trigger lo hace, pero por si acaso)
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const pesoResult = await client.query(
      `INSERT INTO pesos_historico (animal_id, peso, fecha, notas)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [animalId, peso, fecha, notas || null],
    );

    await client.query("COMMIT");
    return pesoResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getPesos = async (animalId) => {
  const result = await query(
    "SELECT * FROM pesos_historico WHERE animal_id = $1 ORDER BY fecha DESC",
    [animalId],
  );
  return result.rows;
};

// ── Conteo de animales activos (para límite free) ────────────────────────────
const countActivos = async (usuarioId) => {
  const result = await query(
    `SELECT COUNT(*) AS total FROM animales
     WHERE usuario_id = $1 AND estado = 'Activo'`,
    [usuarioId],
  );
  return parseInt(result.rows[0].total, 10);
};

module.exports = {
  findAll,
  findById,
  findByArete,
  create,
  update,
  cambiarEstado,
  remove,
  addPeso,
  getPesos,
  countActivos,
};
