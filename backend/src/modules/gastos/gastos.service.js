/**
 * modules/gastos/gastos.service.js
 */
'use strict';

const repo = require('./gastos.repository');
const { toPublic } = require('./gastos.model');
const AppError = require('../../utils/AppError');
const { query } = require('../../config/db');

const listar = async (usuarioId, filtros) => {
    const { rows, total, page, limit } = await repo.findAll(usuarioId, filtros);
    return { data: rows.map(toPublic), total, page, limit };
};

const obtener = async (id, usuarioId) => {
    const gasto = await repo.findById(id, usuarioId);
    if (!gasto) throw AppError.notFound('Movimiento no encontrado.');
    return toPublic(gasto);
};

const crear = async (usuarioId, datos) => {
    // Verificar finca si se envía
    if (datos.finca_id) {
        const finca = await query(
            'SELECT id FROM fincas WHERE id = $1 AND usuario_id = $2',
            [datos.finca_id, usuarioId]
        );
        if (finca.rows.length === 0) throw AppError.notFound('Finca no encontrada.');
    }

    // Verificar animal si se envía
    if (datos.animal_id) {
        const animal = await query(
            'SELECT id FROM animales WHERE id = $1 AND usuario_id = $2',
            [datos.animal_id, usuarioId]
        );
        if (animal.rows.length === 0) throw AppError.notFound('Animal no encontrado.');
    }

    const gasto = await repo.create({ ...datos, usuario_id: usuarioId });
    return toPublic(gasto);
};

const actualizar = async (id, usuarioId, datos) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Movimiento no encontrado.');

    const actualizado = await repo.update(id, usuarioId, datos);
    return toPublic(actualizado);
};

const eliminar = async (id, usuarioId) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Movimiento no encontrado.');
    await repo.remove(id, usuarioId);
};

// ── Resumen mensual del año ──────────────────────────────────────────────────
const resumenMensual = async (usuarioId, query_params) => {
    const anio = parseInt(query_params.anio, 10) || new Date().getFullYear();
    const meses = await repo.getResumenMensual(usuarioId, anio);

    // Calcular totales anuales
    const totales = meses.reduce(
        (acc, m) => {
            acc.total_ingresos += parseFloat(m.total_ingresos);
            acc.total_gastos += parseFloat(m.total_gastos);
            acc.balance += parseFloat(m.balance);
            return acc;
        },
        { total_ingresos: 0, total_gastos: 0, balance: 0 }
    );

    return { anio, meses, totales };
};

// ── Resumen por categoría ─────────────────────────────────────────────────────
const resumenCategoria = async (usuarioId, { fecha_desde, fecha_hasta }) => {
    const hoy = new Date().toISOString().split('T')[0];
    const inicio = fecha_desde || `${new Date().getFullYear()}-01-01`;
    const fin = fecha_hasta || hoy;

    const categorias = await repo.getResumenPorCategoria(usuarioId, inicio, fin);
    return { fecha_desde: inicio, fecha_hasta: fin, categorias };
};

module.exports = {
    listar, obtener, crear, actualizar, eliminar,
    resumenMensual, resumenCategoria,
};