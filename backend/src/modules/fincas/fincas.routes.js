/**
 * modules/fincas/fincas.routes.js
 *
 * GET    /api/v1/fincas        → listar todas las fincas del usuario
 * POST   /api/v1/fincas        → crear finca
 * GET    /api/v1/fincas/:id    → obtener una finca
 * PUT    /api/v1/fincas/:id    → actualizar finca
 * DELETE /api/v1/fincas/:id    → desactivar finca (soft delete)
 */
"use strict";

const { Router } = require("express");
const controller = require("./fincas.controller");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { crearFincaSchema, actualizarFincaSchema } = require("./fincas.schema");

const router = Router();

router.use(auth);

router.get("/", controller.listar);
router.post("/", validate(crearFincaSchema), controller.crear);
router.get("/:id", controller.obtener);
router.put("/:id", validate(actualizarFincaSchema), controller.actualizar);
router.delete("/:id", controller.eliminar);

module.exports = router;
