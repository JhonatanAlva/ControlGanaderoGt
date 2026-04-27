/**
 * utils/AppError.js
 * Clase base para errores operacionales de la aplicación.
 * El error.middleware.js los atrapa y responde JSON limpio al cliente.
 */

"use strict";

class AppError extends Error {
  /**
   * @param {string} message    - Mensaje legible para el cliente
   * @param {number} statusCode - Código HTTP (400, 401, 403, 404, 409, 422, 500...)
   * @param {object} [errors]   - Errores de validación detallados (opcional)
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? "error" : "fail";
    this.isOperational = true; // distingue errores esperados de bugs reales
    this.errors = errors;

    // Mantiene el stack trace limpio apuntando al llamador
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores comunes listos para usar
AppError.badRequest = (msg, errors) =>
  new AppError(msg || "Solicitud inválida", 400, errors);
AppError.unauthorized = (msg) => new AppError(msg || "No autenticado", 401);
AppError.forbidden = (msg) =>
  new AppError(msg || "Sin permiso para esta acción", 403);
AppError.notFound = (msg) => new AppError(msg || "Recurso no encontrado", 404);
AppError.conflict = (msg) =>
  new AppError(msg || "Conflicto con datos existentes", 409);
AppError.unprocessable = (msg, errors) =>
  new AppError(msg || "Datos no procesables", 422, errors);
AppError.internal = (msg) =>
  new AppError(msg || "Error interno del servidor", 500);

module.exports = AppError;
