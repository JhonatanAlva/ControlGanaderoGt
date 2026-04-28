/**
 * modules/gastos/gastos.controller.js
 */
'use strict';

const service = require('./gastos.service');
const { ok, created, paginated, noContent } = require('../../utils/response');

const listar = async (req, res, next) => {
    try {
        const { data, total, page, limit } = await service.listar(req.user.id, req.query);
        paginated(res, { data, total, page, limit, message: 'Movimientos obtenidos.' });
    } catch (err) { next(err); }
};

const obtener = async (req, res, next) => {
    try {
        const gasto = await service.obtener(req.params.id, req.user.id);
        ok(res, { gasto });
    } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
    try {
        const gasto = await service.crear(req.user.id, req.body);
        created(res, { gasto }, 'Movimiento registrado exitosamente.');
    } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
    try {
        const gasto = await service.actualizar(req.params.id, req.user.id, req.body);
        ok(res, { gasto }, 'Movimiento actualizado.');
    } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
    try {
        await service.eliminar(req.params.id, req.user.id);
        noContent(res);
    } catch (err) { next(err); }
};

const resumenMensual = async (req, res, next) => {
    try {
        const resumen = await service.resumenMensual(req.user.id, req.query);
        ok(res, resumen, 'Resumen mensual obtenido.');
    } catch (err) { next(err); }
};

const resumenCategoria = async (req, res, next) => {
    try {
        const resumen = await service.resumenCategoria(req.user.id, req.query);
        ok(res, resumen, 'Resumen por categoría obtenido.');
    } catch (err) { next(err); }
};

module.exports = {
    listar, obtener, crear, actualizar, eliminar,
    resumenMensual, resumenCategoria,
};