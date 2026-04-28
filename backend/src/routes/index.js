/**
 * routes/index.js
 * Registra todas las rutas de la API bajo /api/v1.
 * Cada módulo expone su propio router.
 */

"use strict";

const { Router } = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const fincasRoutes = require("../modules/fincas/fincas.routes");
const animalesRoutes = require("../modules/animales/animales.routes");
const vacunasRoutes   = require('../modules/vacunas/vacunas.routes');
const partosRoutes    = require('../modules/partos/partos.routes');
const gastosRoutes    = require('../modules/gastos/gastos.routes');
const comunidadRoutes = require('../modules/comunidad/comunidad.routes');

const router = Router();

router.use("/auth", authRoutes);
router.use("/fincas", fincasRoutes);
router.use("/animales", animalesRoutes);
router.use('/vacunas',   vacunasRoutes);
router.use('/partos',    partosRoutes);
router.use('/gastos',    gastosRoutes);
router.use('/comunidad', comunidadRoutes);

// Ruta de referencia de la API
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🐄  GanaderíaGT API v1",
    endpoints: {
      auth: "/api/v1/auth",
      fincas: "/api/v1/fincas",
      animales: "/api/v1/animales",
      vacunas: "/api/v1/vacunas",
      partos: "/api/v1/partos",
      gastos: "/api/v1/gastos",
      comunidad: "/api/v1/comunidad",
    },
  });
});

module.exports = router;
