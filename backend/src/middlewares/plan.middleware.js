/**
 * middlewares/plan.middleware.js
 * Bloquea endpoints o acciones que requieren plan Pro.
 * Debe usarse después de authMiddleware.
 *
 * Uso:
 *   router.post('/pdf', auth, requirePro, controller.generarPdf);
 */

"use strict";

const AppError = require("../utils/AppError");
const { query } = require("../config/db");
const { LIMITES_FREE } = require("../config/constants");

/**
 * Bloquea acceso si el usuario no es Pro.
 */
const requirePro = (req, res, next) => {
  if (req.user.plan !== "pro") {
    return next(
      AppError.forbidden(
        "Esta función requiere el plan Pro. Actualiza tu cuenta para acceder.",
      ),
    );
  }
  next();
};

/**
 * Verifica que el usuario free no supere el límite de animales (10).
 * Usar antes de crear un animal nuevo.
 */
const checkLimiteAnimales = async (req, res, next) => {
  try {
    if (req.user.plan === "pro") return next();

    const result = await query(
      `SELECT COUNT(*) AS total FROM animales
       WHERE usuario_id = $1 AND estado = 'Activo'`,
      [req.user.id],
    );

    const total = parseInt(result.rows[0].total, 10);

    if (total >= LIMITES_FREE.animales) {
      return next(
        AppError.forbidden(
          `El plan gratuito permite máximo ${LIMITES_FREE.animales} animales activos. Actualiza a Pro para continuar.`,
        ),
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Verifica que el usuario free no supere el límite de fincas (1).
 */
const checkLimiteFincas = async (req, res, next) => {
  try {
    if (req.user.plan === "pro") return next();

    const result = await query(
      "SELECT COUNT(*) AS total FROM fincas WHERE usuario_id = $1 AND activa = true",
      [req.user.id],
    );

    const total = parseInt(result.rows[0].total, 10);

    if (total >= LIMITES_FREE.fincas) {
      return next(
        AppError.forbidden(
          `El plan gratuito permite máximo ${LIMITES_FREE.fincas} finca. Actualiza a Pro para continuar.`,
        ),
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requirePro, checkLimiteAnimales, checkLimiteFincas };
