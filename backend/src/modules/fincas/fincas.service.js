/**
 * modules/fincas/fincas.service.js
 */
"use strict";

const repo = require("./fincas.repository");
const { toPublic } = require("./fincas.model");
const AppError = require("../../utils/AppError");
const { LIMITES_FREE } = require("../../config/constants");

const listar = async (usuarioId) => {
  const rows = await repo.findAll(usuarioId);
  return rows.map(toPublic);
};

const obtener = async (id, usuarioId) => {
  const finca = await repo.findById(id, usuarioId);
  if (!finca) throw AppError.notFound("Finca no encontrada.");
  return toPublic(finca);
};

const crear = async (usuarioId, datos, plan) => {
  // Verificar límite plan free
  if (plan !== "pro") {
    const total = await repo.countActivas(usuarioId);
    if (total >= LIMITES_FREE.fincas) {
      throw AppError.forbidden(
        `El plan gratuito permite máximo ${LIMITES_FREE.fincas} finca. Actualiza a Pro para agregar más.`,
      );
    }
  }

  // Nombre único por usuario
  const existe = await repo.findByNombre(datos.nombre, usuarioId);
  if (existe)
    throw AppError.conflict(`Ya tienes una finca llamada "${datos.nombre}".`);

  const finca = await repo.create({ ...datos, usuario_id: usuarioId });
  return toPublic(finca);
};

const actualizar = async (id, usuarioId, datos) => {
  const existe = await repo.findById(id, usuarioId);
  if (!existe) throw AppError.notFound("Finca no encontrada.");

  // Si cambia el nombre, verificar que no duplique
  if (datos.nombre && datos.nombre !== existe.nombre) {
    const duplicado = await repo.findByNombre(datos.nombre, usuarioId);
    if (duplicado)
      throw AppError.conflict(`Ya tienes una finca llamada "${datos.nombre}".`);
  }

  const actualizada = await repo.update(id, usuarioId, datos);
  return toPublic(actualizada);
};

const eliminar = async (id, usuarioId) => {
  const existe = await repo.findById(id, usuarioId);
  if (!existe) throw AppError.notFound("Finca no encontrada.");

  // Verificar que no tenga animales activos antes de desactivar
  if (parseInt(existe.total_animales, 10) > 0) {
    throw AppError.conflict(
      "No puedes eliminar una finca con animales activos. Reasigna o da de baja los animales primero.",
    );
  }

  await repo.deactivate(id, usuarioId);
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
