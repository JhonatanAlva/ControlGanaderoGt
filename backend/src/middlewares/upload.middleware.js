/**
 * middlewares/upload.middleware.js
 * Configuración de Multer para recibir fotos de animales y posts.
 * Las imágenes se guardan en memoria y se suben a Cloudinary desde el service.
 */

"use strict";

const multer = require("multer");
const AppError = require("../utils/AppError");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_SIZE_MB = 5;

const storage = multer.memoryStorage(); // buffer en RAM, Cloudinary lo consume directo

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_MIME_TYPES.join(", ")}`,
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
});

// Middlewares listos para usar en routes
const uploadFotoAnimal = upload.single("foto"); // campo: "foto"
const uploadFotoPost = upload.single("foto");
const uploadMultiple = upload.array("fotos", 5); // máximo 5 fotos

module.exports = { uploadFotoAnimal, uploadFotoPost, uploadMultiple };
