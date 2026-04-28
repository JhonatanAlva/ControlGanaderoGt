/**
 * modules/vacunas/vacunas.routes.js
 *
 * GET    /api/v1/vacunas                        → listar (filtros: animal_id, finca_id, tipo, pendientes=true)
 * POST   /api/v1/vacunas                        → registrar vacuna
 * GET    /api/v1/vacunas/:id                    → obtener una
 * PUT    /api/v1/vacunas/:id                    → actualizar
 * DELETE /api/v1/vacunas/:id                    → eliminar
 * GET    /api/v1/vacunas/animal/:animalId        → historial de un animal
 */
'use strict';

const { Router } = require('express');
const controller = require('./vacunas.controller');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
    registrarVacunaSchema,
    actualizarVacunaSchema,
    filtrosVacunaSchema,
} = require('./vacunas.schema');

const router = Router();

router.use(auth);

router.get('/', validate(filtrosVacunaSchema, 'query'), controller.listar);
router.post('/', validate(registrarVacunaSchema), controller.registrar);
router.get('/animal/:animalId', controller.historialAnimal);
router.get('/:id', controller.obtener);
router.put('/:id', validate(actualizarVacunaSchema), controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;