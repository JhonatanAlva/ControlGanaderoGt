'use strict';

const service                            = require('./vacunas.service');
const { ok, created, paginated, noContent } = require('../../utils/response');

const listar = async (req, res, next) => {
  try {
    const filtros = req.validatedQuery || req.query;
    const { data, total, page, limit } = await service.listar(req.user.id, filtros);
    paginated(res, { data, total, page, limit, message: 'Vacunas obtenidas.' });
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const vacuna = await service.obtener(req.params.id, req.user.id);
    ok(res, { vacuna });
  } catch (err) { next(err); }
};

const historialAnimal = async (req, res, next) => {
  try {
    const vacunas = await service.historialAnimal(req.params.animalId, req.user.id);
    ok(res, { vacunas });
  } catch (err) { next(err); }
};

const registrar = async (req, res, next) => {
  try {
    const vacuna = await service.registrar(req.user.id, req.body);
    created(res, { vacuna }, 'Vacuna registrada exitosamente.');
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const vacuna = await service.actualizar(req.params.id, req.user.id, req.body);
    ok(res, { vacuna }, 'Vacuna actualizada.');
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    await service.eliminar(req.params.id, req.user.id);
    noContent(res);
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, historialAnimal, registrar, actualizar, eliminar };