/**
 * middlewares/validate.middleware.js
 * Valida req.body, req.params o req.query contra un schema de Zod.
 * Si la validación falla, lanza un 422 con los errores detallados.
 *
 * Uso en routes:
 *   router.post('/', validate(crearAnimalSchema), animalesController.crear);
 */

"use strict";

const AppError = require("../utils/AppError");

/**
 * @param {import('zod').ZodSchema} schema  - Schema de Zod
 * @param {'body'|'params'|'query'} source  - De dónde tomar los datos
 */
const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(AppError.unprocessable("Error de validación.", errors));
    }

    // Reemplaza el source con los datos limpios (coerciones de Zod aplicadas)
    req[source] = result.data;
    next();
  };

module.exports = validate;
