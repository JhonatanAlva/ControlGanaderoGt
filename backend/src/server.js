/**
 * server.js
 * Punto de entrada de la aplicación.
 * Verifica la conexión a DB y luego levanta el servidor HTTP.
 * Maneja señales del sistema para un apagado limpio (graceful shutdown).
 */

'use strict';

// Carga .env antes que cualquier otro módulo
require('./config/env');

const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { testConnection, pool } = require('./config/db');

// ── Arranque ─────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    // 1. Verificar conexión a PostgreSQL
    await testConnection();

    // 3. Iniciar jobs programados
    const { iniciarAlertas } = require('./jobs/alertas.job');
    const { iniciarPartos } = require('./jobs/partos.job');
    iniciarAlertas();
    iniciarPartos();

    // 4. Levantar servidor HTTP
    const server = app.listen(env.PORT, () => {
      logger.info(`📌  Entorno: ${env.NODE_ENV}`);
      logger.info(`📋  Docs:    http://localhost:${env.PORT}/api/v1`);
    });

    // ── Graceful shutdown ──────────────────────────────────────────────────
    const shutdown = async (signal) => {
      logger.info(`\n⚠️   Señal ${signal} recibida. Cerrando servidor...`);

      server.close(async () => {
        logger.info('✅  Servidor HTTP cerrado.');
        try {
          await pool.end();
          logger.info('✅  Pool de PostgreSQL cerrado.');
        } catch (err) {
          logger.error('❌  Error cerrando el pool:', err.message);
        }
        process.exit(0);
      });

      // Si tarda más de 10s, forzar salida
      setTimeout(() => {
        logger.error('❌  Cierre forzado después de 10s.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ── Errores no capturados ──────────────────────────────────────────────
    process.on('uncaughtException', (err) => {
      logger.error('💥  uncaughtException:', err.message, err.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('💥  unhandledRejection:', reason);
      process.exit(1);
    });

  } catch (err) {
    logger.error('❌  Error al arrancar el servidor:', err.message);
    process.exit(1);
  }
};

start();