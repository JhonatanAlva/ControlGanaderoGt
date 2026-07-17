/**
 * modules/comunidad/comunidad.repository.js
 */
'use strict';

const { query } = require('../../config/db');
const paginate = require('../../utils/paginate');

// ── Listar posts públicos con filtros ────────────────────────────────────────
const findAll = async (usuarioId, filtros = {}) => {
    const { page, limit, offset } = paginate(filtros);
    const values = [];
    const where = ['p.activo = true'];
    let idx = 1;

    if (filtros.tipo) { where.push(`p.tipo = $${idx++}`); values.push(filtros.tipo); }
    if (filtros.region) { where.push(`p.region = $${idx++}`); values.push(filtros.region); }

    if (filtros.search) {
        where.push(`(p.titulo ILIKE $${idx} OR p.contenido ILIKE $${idx})`);
        values.push(`%${filtros.search}%`);
        idx++;
    }

    const whereClause = where.join(' AND ');

    const countResult = await query(
        `SELECT COUNT(*) AS total FROM comunidad_posts p WHERE ${whereClause}`,
        values
    );
    const total = parseInt(countResult.rows[0].total, 10);

    // Si hay usuario autenticado, indica si ya dio like
    const rowValues = [...values];
    let likeJoin = '';
    let likeSelect = '';
    if (usuarioId) {
        likeJoin = `LEFT JOIN comunidad_likes cl ON cl.post_id = p.id AND cl.usuario_id = $${idx}`;
        likeSelect = ', (cl.usuario_id IS NOT NULL) AS yo_di_like';
        rowValues.push(usuarioId);
        idx++;
    }

    const rows = await query(
        `SELECT
        p.*,
        u.nombre AS autor_nombre,
        u.region AS autor_region
        ${likeSelect}
     FROM comunidad_posts p
     JOIN usuarios u ON u.id = p.autor_id
     ${likeJoin}
     WHERE ${whereClause}
     ORDER BY p.creado_en DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
        [...rowValues, limit, offset]
    );

    return { rows: rows.rows, total, page, limit };
};

const findById = async (id, usuarioId) => {
    const values = [id];
    let likeJoin = '';
    let likeSelect = '';
    if (usuarioId) {
        likeJoin = `LEFT JOIN comunidad_likes cl ON cl.post_id = p.id AND cl.usuario_id = $2`;
        likeSelect = ', (cl.usuario_id IS NOT NULL) AS yo_di_like';
        values.push(usuarioId);
    }

    const result = await query(
        `SELECT
        p.*,
        u.nombre AS autor_nombre,
        u.region AS autor_region
        ${likeSelect}
     FROM comunidad_posts p
     JOIN usuarios u ON u.id = p.autor_id
     ${likeJoin}
     WHERE p.id = $1 AND p.activo = true`,
        values
    );
    return result.rows[0] || null;
};

// Posts del propio usuario (incluyendo inactivos)
const findByAutor = async (autorId) => {
    const result = await query(
        `SELECT p.*, u.nombre AS autor_nombre
     FROM comunidad_posts p
     JOIN usuarios u ON u.id = p.autor_id
     WHERE p.autor_id = $1
     ORDER BY p.creado_en DESC`,
        [autorId]
    );
    return result.rows;
};

const create = async (datos) => {
    const {
        autor_id, tipo, titulo, contenido, region,
        precio, raza_animal, peso_animal, foto_url, contacto_whatsapp,
    } = datos;

    const result = await query(
        `INSERT INTO comunidad_posts (
        autor_id, tipo, titulo, contenido, region,
        precio, raza_animal, peso_animal, foto_url, contacto_whatsapp
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
        [
            autor_id, tipo, titulo, contenido, region,
            precio || null, raza_animal || null, peso_animal || null,
            foto_url || null, contacto_whatsapp || null,
        ]
    );
    return result.rows[0];
};

const update = async (id, autorId, campos) => {
    const keys = Object.keys(campos).filter((k) => campos[k] !== undefined);
    if (keys.length === 0) return findById(id, autorId);

    const sets = keys.map((k, i) => `${k} = $${i + 3}`);
    const values = keys.map((k) => campos[k]);

    const result = await query(
        `UPDATE comunidad_posts SET ${sets.join(', ')}
     WHERE id = $1 AND autor_id = $2
     RETURNING *`,
        [id, autorId, ...values]
    );
    return result.rows[0] || null;
};

// Soft delete — marca como inactivo
const deactivate = async (id, autorId) => {
    const result = await query(
        `UPDATE comunidad_posts SET activo = false
     WHERE id = $1 AND autor_id = $2
     RETURNING id`,
        [id, autorId]
    );
    return result.rows[0] || null;
};

// ── Likes ────────────────────────────────────────────────────────────────────
const addLike = async (postId, usuarioId) => {
    // INSERT OR IGNORE — el trigger actualiza el contador
    const result = await query(
        `INSERT INTO comunidad_likes (post_id, usuario_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING post_id`,
        [postId, usuarioId]
    );
    return result.rows[0] || null; // null = ya tenía like
};

const removeLike = async (postId, usuarioId) => {
    const result = await query(
        `DELETE FROM comunidad_likes
     WHERE post_id = $1 AND usuario_id = $2
     RETURNING post_id`,
        [postId, usuarioId]
    );
    return result.rows[0] || null; // null = no tenía like
};

const getLikesCount = async (postId) => {
    const result = await query(
        'SELECT likes FROM comunidad_posts WHERE id = $1',
        [postId]
    );
    return result.rows[0]?.likes || 0;
};

module.exports = {
    findAll, findById, findByAutor,
    create, update, deactivate,
    addLike, removeLike, getLikesCount,
};