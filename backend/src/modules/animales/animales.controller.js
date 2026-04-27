/**
 * modules/animales/animales.controller.js
 */
"use strict";

const service = require("./animales.service");
const { ok, created, paginated, noContent } = require("../../utils/response");

const listar = async (req, res, next) => {
  try {
    const { data, total, page, limit } = await service.listar(
      req.user.id,
      req.query,
    );
    paginated(res, {
      data,
      total,
      page,
      limit,
      message: "Animales obtenidos.",
    });
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const animal = await service.obtener(req.params.id, req.user.id);
    ok(res, { animal });
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  try {
    const animal = await service.crear(
      req.user.id,
      req.body,
      req.user.plan,
      req.file,
    );
    created(res, { animal }, "Animal registrado exitosamente.");
  } catch (err) {
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const animal = await service.actualizar(
      req.params.id,
      req.user.id,
      req.body,
      req.file,
    );
    ok(res, { animal }, "Animal actualizado.");
  } catch (err) {
    next(err);
  }
};

const cambiarEstado = async (req, res, next) => {
  try {
    const animal = await service.cambiarEstado(
      req.params.id,
      req.user.id,
      req.body,
    );
    ok(res, { animal }, "Estado actualizado.");
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

const registrarPeso = async (req, res, next) => {
  try {
    const peso = await service.registrarPeso(
      req.params.id,
      req.user.id,
      req.body,
    );
    created(res, { peso }, "Peso registrado.");
  } catch (err) {
    next(err);
  }
};

const historialPesos = async (req, res, next) => {
  try {
    const pesos = await service.historialPesos(req.params.id, req.user.id);
    ok(res, { pesos });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
  registrarPeso,
  historialPesos,
};
