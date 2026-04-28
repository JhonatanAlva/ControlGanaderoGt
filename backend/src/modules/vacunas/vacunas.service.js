/**
 * modules/vacunas/vacunas.service.js
 */
'use strict';

const repo = require('./vacunas.repository');
const { toPublic } = require('./vacunas.model');
const AppError = require('../../utils/AppError');
const { query } = require('../../config/db');

const listar = async (usuarioId, filtros) => {
    const { rows, total, page, limit } = await repo.findAll(usuarioId, filtros);
    return { data: rows.map(toPublic), total, page, limit };
};

const obtener = async (id, usuarioId) => {
    const vacuna = await repo.findById(id, usuarioId);
    if (!vacuna) throw AppError.notFound('Vacuna no encontrada.');
    return toPublic(vacuna);
};

const historialAnimal = async (animalId, usuarioId) => {
    // Verificar que el animal pertenece al usuario
    const animal = await query(
        'SELECT id FROM animales WHERE id = $1 AND usuario_id = $2',
        [animalId, usuarioId]
    );
    if (animal.rows.length === 0) throw AppError.notFound('Animal no encontrado.');

    const rows = await repo.findByAnimal(animalId, usuarioId);
    return rows.map(toPublic);
};

const registrar = async (usuarioId, datos) => {
    // Verificar que el animal pertenece al usuario
    const animal = await query(
        'SELECT id FROM animales WHERE id = $1 AND usuario_id = $2',
        [datos.animal_id, usuarioId]
    );
    if (animal.rows.length === 0) throw AppError.notFound('Animal no encontrado.');

    // Verificar que finca_id pertenece al usuario si se envía
    if (datos.finca_id) {
        const finca = await query(
            'SELECT id FROM fincas WHERE id = $1 AND usuario_id = $2',
            [datos.finca_id, usuarioId]
        );
        if (finca.rows.length === 0) throw AppError.notFound('Finca no encontrada.');
    }

    const vacuna = await repo.create(datos);
    return toPublic(vacuna);
};

const actualizar = async (id, usuarioId, datos) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Vacuna no encontrada.');

    const actualizada = await repo.update(id, usuarioId, datos);
    return toPublic(actualizada);
};

const eliminar = async (id, usuarioId) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Vacuna no encontrada.');
    await repo.remove(id, usuarioId);
};

module.exports = { listar, obtener, historialAnimal, registrar, actualizar, eliminar };