/**
 * modules/comunidad/comunidad.service.js
 */
'use strict';

const repo = require('./comunidad.repository');
const { toPublic } = require('./comunidad.model');
const AppError = require('../../utils/AppError');
const cloudinary = require('../../config/cloudinary');

const listar = async (usuarioId, filtros) => {
    const { rows, total, page, limit } = await repo.findAll(usuarioId, filtros);
    return {
        data: rows.map((r) => ({ ...toPublic(r), autor_nombre: r.autor_nombre, autor_region: r.autor_region, yo_di_like: r.yo_di_like || false })),
        total, page, limit,
    };
};

const obtener = async (id, usuarioId) => {
    const post = await repo.findById(id, usuarioId);
    if (!post) throw AppError.notFound('Publicación no encontrada.');
    return { ...toPublic(post), autor_nombre: post.autor_nombre, autor_region: post.autor_region, yo_di_like: post.yo_di_like || false };
};

const misPosts = async (usuarioId) => {
    const rows = await repo.findByAutor(usuarioId);
    return rows.map((r) => ({ ...toPublic(r), autor_nombre: r.autor_nombre }));
};

const crear = async (usuarioId, datos, archivo) => {
    let foto_url = null;
    if (archivo) {
        foto_url = await cloudinary.upload(archivo.buffer, {
            folder: `ganaderia-gt/${usuarioId}/comunidad`,
            public_id: `post_${Date.now()}`,
        });
    }

    const post = await repo.create({ ...datos, autor_id: usuarioId, foto_url });
    return toPublic(post);
};

const actualizar = async (id, usuarioId, datos, archivo) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Publicación no encontrada.');
    if (existe.autor_id !== usuarioId) throw AppError.forbidden('No puedes editar esta publicación.');

    let foto_url = undefined;
    if (archivo) {
        foto_url = await cloudinary.upload(archivo.buffer, {
            folder: `ganaderia-gt/${usuarioId}/comunidad`,
            public_id: `post_${id}_${Date.now()}`,
        });
    }

    const actualizado = await repo.update(id, usuarioId, {
        ...datos,
        ...(foto_url && { foto_url }),
    });
    return toPublic(actualizado);
};

const eliminar = async (id, usuarioId) => {
    const existe = await repo.findById(id, usuarioId);
    if (!existe) throw AppError.notFound('Publicación no encontrada.');
    if (existe.autor_id !== usuarioId) throw AppError.forbidden('No puedes eliminar esta publicación.');

    await repo.deactivate(id, usuarioId);
};

// ── Likes ─────────────────────────────────────────────────────────────────────
const toggleLike = async (postId, usuarioId) => {
    const post = await repo.findById(postId, usuarioId);
    if (!post) throw AppError.notFound('Publicación no encontrada.');

    // Intentar agregar like primero
    const added = await repo.addLike(postId, usuarioId);

    // Si ya tenía like, lo quitamos
    if (!added) await repo.removeLike(postId, usuarioId);

    const likes = await repo.getLikesCount(postId);
    return { likes, liked: !!added };
};

module.exports = { listar, obtener, misPosts, crear, actualizar, eliminar, toggleLike };