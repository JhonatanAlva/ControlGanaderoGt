/**
 * modules/comunidad/comunidad.routes.js
 *
 * GET    /api/v1/comunidad           → listar posts públicos (sin auth, pero con auth muestra yo_di_like)
 * POST   /api/v1/comunidad           → crear post (requiere auth)
 * GET    /api/v1/comunidad/mis-posts → posts del usuario autenticado
 * GET    /api/v1/comunidad/:id       → obtener uno
 * PUT    /api/v1/comunidad/:id       → actualizar (solo el autor)
 * DELETE /api/v1/comunidad/:id       → eliminar (solo el autor)
 * POST   /api/v1/comunidad/:id/like  → toggle like (requiere auth)
 */

'use strict';

const { Router } = require('express');
const controller = require('./comunidad.controller');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { uploadFotoPost } = require('../../middlewares/upload.middleware');
const {
    crearPostSchema,
    actualizarPostSchema,
    filtrosPostSchema,
} = require('./comunidad.schema');

// Auth opcional — adjunta req.user si hay token, pero no bloquea
const authOpcional = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const { verifyToken } = require('../../config/jwt');
            const decoded = verifyToken(authHeader.split(' ')[1]);
            req.user = decoded;
        }
    } catch {
        // Token inválido — se ignora
    }
    next();
};

const router = Router();

// ── Rutas estáticas PRIMERO (antes de /:id) ──────────────────────────────────
router.get('/mis-posts', auth, controller.misPosts);

// ── Rutas públicas ───────────────────────────────────────────────────────────
router.get('/', authOpcional, validate(filtrosPostSchema, 'query'), controller.listar);
router.post('/', auth, uploadFotoPost, validate(crearPostSchema), controller.crear);

// ── Rutas con parámetro /:id (SIEMPRE al final) ──────────────────────────────
router.get('/:id', authOpcional, controller.obtener);
router.put('/:id', auth, uploadFotoPost, validate(actualizarPostSchema), controller.actualizar);
router.delete('/:id', auth, controller.eliminar);
router.post('/:id/like', auth, controller.toggleLike);

module.exports = router;