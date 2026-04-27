/**
 * config/cloudinary.js
 * Helper para subir imágenes a Cloudinary desde un buffer (multer memoryStorage).
 */
"use strict";

const cloudinarySDK = require("cloudinary").v2;
const env = require("./env");

cloudinarySDK.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Sube un buffer de imagen a Cloudinary.
 * @param {Buffer} buffer       - Buffer del archivo (de multer memoryStorage)
 * @param {object} options
 * @param {string} options.folder    - Carpeta en Cloudinary
 * @param {string} options.public_id - Nombre del archivo sin extensión
 * @returns {Promise<string>}   - URL segura de la imagen subida
 */
const upload = (buffer, { folder, public_id }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinarySDK.uploader.upload_stream(
      {
        folder,
        public_id,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

/**
 * Elimina una imagen de Cloudinary por su public_id.
 * @param {string} publicId
 */
const destroy = (publicId) => cloudinarySDK.uploader.destroy(publicId);

module.exports = { upload, destroy };
