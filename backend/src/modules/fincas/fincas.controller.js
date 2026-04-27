/**
 * modules/fincas/fincas.controller.js
 */
"use strict";

const service = require("./fincas.service");
const { ok, created, noContent } = require("../../utils/response");

const listar = async (req, res, next) => {
  try {
    const fincas = await service.listar(req.user.id);
    ok(res, { fincas });
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const finca = await service.obtener(req.params.id, req.user.id);
    ok(res, { finca });
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const finca = await service.crear(req.user.id, req.body, req.user.plan);
    created(res, { finca }, "Finca registrada exitosamente.");
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const finca = await service.actualizar(
      req.params.id,
      req.user.id,
      req.body,
    );
    ok(res, { finca }, "Finca actualizada.");
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await service.eliminar(req.params.id, req.user.id);
    noContent(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
