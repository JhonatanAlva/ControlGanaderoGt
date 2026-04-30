'use strict';

const service                            = require('./comunidad.service');
const { ok, created, paginated, noContent } = require('../../utils/response');

const listar = async (req, res, next) => {
  try {
    const filtros = req.validatedQuery || req.query;
    const { data, total, page, limit } = await service.listar(req.user?.id, filtros);
    paginated(res, { data, total, page, limit, message: 'Publicaciones obtenidas.' });
  } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
  try {
    const post = await service.obtener(req.params.id, req.user?.id);
    ok(res, { post });
  } catch (err) { next(err); }
};

const misPosts = async (req, res, next) => {
  try {
    const posts = await service.misPosts(req.user.id);
    ok(res, { posts });
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const post = await service.crear(req.user.id, req.body, req.file);
    created(res, { post }, 'Publicación creada exitosamente.');
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const post = await service.actualizar(req.params.id, req.user.id, req.body, req.file);
    ok(res, { post }, 'Publicación actualizada.');
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    await service.eliminar(req.params.id, req.user.id);
    noContent(res);
  } catch (err) { next(err); }
};

const toggleLike = async (req, res, next) => {
  try {
    const resultado = await service.toggleLike(req.params.id, req.user.id);
    ok(res, resultado, resultado.liked ? 'Like agregado.' : 'Like eliminado.');
  } catch (err) { next(err); }
};

module.exports = { listar, obtener, misPosts, crear, actualizar, eliminar, toggleLike };