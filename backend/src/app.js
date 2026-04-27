/**
 * app.js
 * Crea y configura la instancia de Express.
 * No llama a .listen() — eso lo hace server.js.
 */

"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const logger = require("./utils/logger");
const routes = require("./routes/index");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// ── Seguridad ────────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.isDev ? "*" : process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limit global: 200 requests / 15 min por IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos.",
    },
  }),
);

// Rate limit estricto solo para auth: 10 intentos / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Demasiados intentos de acceso. Espera 15 minutos.",
  },
});

// ── Parsers ───────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// ── Logs de requests ─────────────────────────────────────────────────────────
if (env.isDev) {
  app.use(morgan("dev"));
} else {
  // En producción: log en formato combinado usando winston
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.http(msg.trim()) },
    }),
  );
}

// ── Health check (no requiere auth) ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "GanaderíaGT API corriendo",
    env: env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// ── Rutas de la API ──────────────────────────────────────────────────────────
app.use("/api/v1/auth", authLimiter); // rate limit estricto solo en auth
app.use("/api/v1", routes);

// ── Ruta no encontrada ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada.`,
  });
});

// ── Manejador global de errores (debe ir último) ─────────────────────────────
app.use(errorMiddleware);

module.exports = app;
