/**
 * modules/auth/auth.routes.js
 */
'use strict';

const { Router }  = require('express');
const controller  = require('./auth.controller');
const validate    = require('../../middlewares/validate.middleware');
const auth        = require('../../middlewares/auth.middleware');
const {
  registroSchema, loginSchema,
  actualizarPerfilSchema, cambiarPasswordSchema,
} = require('./auth.schema');

const router = Router();

router.post('/registro', validate(registroSchema), controller.registro);
router.post('/login',    validate(loginSchema),    controller.login);
router.get( '/me',       auth,                     controller.me);
router.put( '/me',       auth, validate(actualizarPerfilSchema), controller.actualizarPerfil);
router.put( '/password', auth, validate(cambiarPasswordSchema),  controller.cambiarPassword);
router.post('/logout',   auth,                     controller.logout);

module.exports = router;