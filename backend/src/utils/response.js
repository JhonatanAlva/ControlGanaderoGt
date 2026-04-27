/**
 * utils/response.js
 * Helpers para devolver respuestas JSON consistentes en todos los controllers.
 *
 * Formato de éxito:
 * { success: true, message, data, meta }
 *
 * Formato de error (manejado por error.middleware.js):
 * { success: false, status, message, errors }
 */

"use strict";

/**
 * Respuesta exitosa genérica.
 */
const success = (
  res,
  { message = "OK", data = null, meta = null, statusCode = 200 } = {},
) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * 200 OK — consulta o acción general
 */
const ok = (res, data, message = "OK") => success(res, { message, data });

/**
 * 201 Created — recurso creado
 */
const created = (res, data, message = "Creado exitosamente") =>
  success(res, { message, data, statusCode: 201 });

/**
 * 200 con paginación
 */
const paginated = (res, { data, total, page, limit, message = "OK" }) =>
  success(res, {
    message,
    data,
    meta: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
    },
  });

/**
 * 204 No Content — eliminación exitosa
 */
const noContent = (res) => res.status(204).send();

module.exports = { ok, created, paginated, noContent, success };
