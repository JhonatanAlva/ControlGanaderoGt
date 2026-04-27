/**
 * modules/auth/auth.service.js
 */
"use strict";

const bcrypt = require("bcryptjs");
const { signToken } = require("../../config/jwt");
const AppError = require("../../utils/AppError");
const repo = require("./auth.repository");
const { toPublic } = require("./auth.model");

const SALT_ROUNDS = 12;

const registro = async (datos) => {
  // Verificar email único
  const existe = await repo.findByEmail(datos.email);
  if (existe) throw AppError.conflict("Ya existe una cuenta con ese email.");

  const passwordHash = await bcrypt.hash(datos.password, SALT_ROUNDS);
  const usuarioRaw = await repo.create({ ...datos, passwordHash });
  const token = signToken({
    id: usuarioRaw.id,
    email: usuarioRaw.email,
    plan: usuarioRaw.plan,
  });

  return { usuario: toPublic(usuarioRaw), token };
};

const login = async ({ email, password }) => {
  const usuarioRaw = await repo.findByEmail(email);
  if (!usuarioRaw)
    throw AppError.unauthorized("Email o contraseña incorrectos.");
  if (!usuarioRaw.activo)
    throw AppError.unauthorized("Tu cuenta ha sido desactivada.");

  const passwordValida = await bcrypt.compare(
    password,
    usuarioRaw.password_hash,
  );
  if (!passwordValida)
    throw AppError.unauthorized("Email o contraseña incorrectos.");

  const token = signToken({
    id: usuarioRaw.id,
    email: usuarioRaw.email,
    plan: usuarioRaw.plan,
  });

  return { usuario: toPublic(usuarioRaw), token };
};

const getMe = async (id) => {
  const usuario = await repo.findById(id);
  if (!usuario) throw AppError.notFound("Usuario no encontrado.");
  return usuario;
};

module.exports = { registro, login, getMe };
