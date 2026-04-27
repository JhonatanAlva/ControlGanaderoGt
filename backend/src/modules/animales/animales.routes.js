/**
 * modules/animales/animales.routes.js
 *
 * GET    /api/v1/animales              → listar (con filtros y paginación)
 * POST   /api/v1/animales              → crear
 * GET    /api/v1/animales/:id          → obtener uno
 * PUT    /api/v1/animales/:id          → actualizar
 * PATCH  /api/v1/animales/:id/estado   → cambiar estado (venta, muerte, robo)
 * DELETE /api/v1/animales/:id          → eliminar
 * POST   /api/v1/animales/:id/pesos    → registrar pesaje
 * GET    /api/v1/animales/:id/pesos    → historial de pesos
 */
"use strict";

const { Router } = require("express");
const controller = require("./animales.controller");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { uploadFotoAnimal } = require("../../middlewares/upload.middleware");
const {
  crearAnimalSchema,
  actualizarAnimalSchema,
  cambiarEstadoSchema,
  registrarPesoSchema,
  filtrosAnimalSchema,
} = require("./animales.schema");

const router = Router();

// Todos los endpoints requieren autenticación
router.use(auth);

router.get("/", validate(filtrosAnimalSchema, "query"), controller.listar);
router.post(
  "/",
  uploadFotoAnimal,
  validate(crearAnimalSchema),
  controller.crear,
);
router.get("/:id", controller.obtener);
router.put(
  "/:id",
  uploadFotoAnimal,
  validate(actualizarAnimalSchema),
  controller.actualizar,
);
router.patch(
  "/:id/estado",
  validate(cambiarEstadoSchema),
  controller.cambiarEstado,
);
router.delete("/:id", controller.eliminar);
router.post(
  "/:id/pesos",
  validate(registrarPesoSchema),
  controller.registrarPeso,
);
router.get("/:id/pesos", controller.historialPesos);

module.exports = router;
