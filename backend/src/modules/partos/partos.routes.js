/**
 * modules/partos/partos.routes.js
 *
 * GET    /api/v1/partos                        → listar (filtros: madre_id, proximos=true)
 * POST   /api/v1/partos/servicio               → registrar servicio/inseminación
 * GET    /api/v1/partos/:id                    → obtener uno
 * POST   /api/v1/partos/:id/resultado          → registrar resultado del parto
 * PUT    /api/v1/partos/:id                    → actualizar
 * DELETE /api/v1/partos/:id                    → eliminar
 * GET    /api/v1/partos/madre/:madreId         → historial de una vaca
 */
'use strict';

const { Router } = require('express');
const controller = require('./partos.controller');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
    registrarServicioSchema,
    registrarPartoSchema,
    actualizarPartoSchema,
    filtrosPartoSchema,
} = require('./partos.schema');

const router = Router();

router.use(auth);

router.get('/', validate(filtrosPartoSchema, 'query'), controller.listar);
router.post('/servicio', validate(registrarServicioSchema), controller.registrarServicio);
router.get('/madre/:madreId', controller.historialMadre);
router.get('/:id', controller.obtener);
router.post('/:id/resultado', validate(registrarPartoSchema), controller.registrarResultado);
router.put('/:id', validate(actualizarPartoSchema), controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;