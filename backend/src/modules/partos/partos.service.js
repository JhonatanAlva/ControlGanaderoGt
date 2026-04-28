/**
 * modules/partos/partos.service.js
 */
'use strict';

const repo = require('./partos.repository');
const { toPublic } = require('./partos.model');
const AppError = require('../../utils/AppError');
const { query } = require('../../config/db');

const listar = async (usuarioId, filtros) => {
    const { rows, total, page, limit } = await repo.findAll(usuarioId, filtros);
    return { data: rows.map(toPublic), total, page, limit };
};

const obtener = async (id, usuarioId) => {
    const parto = await repo.findById(id, usuarioId);
    if (!parto) throw AppError.notFound('Parto no encontrado.');
    return toPublic(parto);
};

const historialMadre = async (madreId, usuarioId) => {
    const animal = await query(
        'SELECT id FROM animales WHERE id = $1 AND usuario_id = $2',
        [madreId, usuarioId]
    );
    if (animal.rows.length === 0) throw AppError.notFound('Animal no encontrado.');

    const rows = await repo.findByMadre(madreId, usuarioId);
    return rows.map(toPublic);
};

// ── Registrar servicio/inseminación ──────────────────────────────────────────
const registrarServicio = async (usuarioId, datos) => {
    // Verificar que la madre pertenece al usuario y es hembra
    const madre = await query(
        `SELECT id, sexo, tipo FROM animales
     WHERE id = $1 AND usuario_id = $2`,
        [datos.madre_id, usuarioId]
    );
    if (madre.rows.length === 0) throw AppError.notFound('Animal madre no encontrado.');
    if (madre.rows[0].sexo !== 'Hembra') {
        throw AppError.badRequest('El animal seleccionado como madre no es hembra.');
    }

    // Verificar que no tenga ya un parto en curso (sin fecha_parto)
    const enCurso = await query(
        `SELECT id FROM partos
     WHERE madre_id = $1 AND fecha_parto IS NULL`,
        [datos.madre_id]
    );
    if (enCurso.rows.length > 0) {
        throw AppError.conflict('Esta vaca ya tiene un servicio/gestación en curso sin resolver.');
    }

    // Verificar padre si se envía
    if (datos.padre_id) {
        const padre = await query(
            'SELECT id, sexo FROM animales WHERE id = $1 AND usuario_id = $2',
            [datos.padre_id, usuarioId]
        );
        if (padre.rows.length === 0) throw AppError.notFound('Animal padre no encontrado.');
        if (padre.rows[0].sexo !== 'Macho') {
            throw AppError.badRequest('El animal seleccionado como padre no es macho.');
        }
    }

    const parto = await repo.createServicio({ ...datos });
    return toPublic(parto);
};

// ── Registrar resultado del parto ────────────────────────────────────────────
const registrarResultado = async (id, usuarioId, datos) => {
    const parto = await repo.findById(id, usuarioId);
    if (!parto) throw AppError.notFound('Registro de parto no encontrado.');

    if (parto.fecha_parto) {
        throw AppError.conflict('Este parto ya tiene resultado registrado.');
    }

    // Verificar que el arete de la cría no exista ya
    if (datos.cria_arete) {
        const areteExiste = await query(
            'SELECT id FROM animales WHERE numero_arete = $1 AND usuario_id = $2',
            [datos.cria_arete, usuarioId]
        );
        if (areteExiste.rows.length > 0) {
            throw AppError.conflict(`El arete ${datos.cria_arete} ya está registrado en otro animal.`);
        }
    }

    const { parto: partoActualizado, cria_id } = await repo.registrarResultado(id, usuarioId, datos);
    return {
        parto: toPublic(partoActualizado),
        cria_creada: cria_id ? true : false,
        cria_id,
    };
};

const actualizar = async (id, usuarioId, datos) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Parto no encontrado.');

    const actualizado = await repo.update(id, usuarioId, datos);
    return toPublic(actualizado);
};

const eliminar = async (id, usuarioId) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Parto no encontrado.');
    await repo.remove(id, usuarioId);
};

module.exports = {
    listar, obtener, historialMadre,
    registrarServicio, registrarResultado,
    actualizar, eliminar,
};