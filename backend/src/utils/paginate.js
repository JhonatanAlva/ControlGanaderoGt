/**
 * utils/paginate.js
 * Extrae y valida parámetros de paginación del query string.
 * Genera el LIMIT/OFFSET para PostgreSQL.
 *
 * Uso en repository:
 *   const { limit, offset, page } = paginate(req.query);
 *   const rows = await query(`SELECT * FROM animales LIMIT $1 OFFSET $2`, [limit, offset]);
 */

"use strict";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * @param {object} query  - req.query
 * @returns {{ page, limit, offset }}
 */
const paginate = (query = {}) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = paginate;
