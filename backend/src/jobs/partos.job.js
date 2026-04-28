/**
 * jobs/partos.job.js
 * Revisa cada mañana a las 7:30 AM partos esperados
 * en los próximos 7 días y alerta al ganadero por email.
 */
'use strict';

const cron = require('node-cron');
const repo = require('../modules/partos/partos.repository');
const { sendMail } = require('../config/mailer');
const logger = require('../utils/logger');

const procesarPartosProximos = async () => {
    logger.info('🐄  Job partos: revisando partos próximos...');

    try {
        const proximos = await repo.findProximosParaAlertar();

        if (proximos.length === 0) {
            logger.info('✅  Job partos: sin partos próximos hoy.');
            return;
        }

        // Agrupar por usuario
        const porUsuario = proximos.reduce((acc, p) => {
            if (!acc[p.usuario_id]) {
                acc[p.usuario_id] = { email: p.email, nombre: p.usuario_nombre, partos: [] };
            }
            acc[p.usuario_id].partos.push(p);
            return acc;
        }, {});

        for (const [usuarioId, datos] of Object.entries(porUsuario)) {
            try {
                await enviarCorreoPartos(datos);
                logger.info(`📧  Alerta partos enviada a ${datos.email} (${datos.partos.length} parto(s))`);
            } catch (err) {
                logger.error(`❌  Error enviando alerta de partos a usuario ${usuarioId}:`, err.message);
            }
        }

        logger.info(`✅  Job partos: procesados ${Object.keys(porUsuario).length} usuario(s).`);
    } catch (err) {
        logger.error('❌  Job partos falló:', err.message);
    }
};

const enviarCorreoPartos = async ({ email, nombre, partos }) => {
    const filas = partos.map((p) => {
        const dias = parseInt(p.dias_restantes, 10);
        const estado = dias === 0
            ? `<span style="color:#dd6b20"><strong>HOY</strong></span>`
            : dias < 0
                ? `<span style="color:#e53e3e">Atrasado ${Math.abs(dias)} día(s)</span>`
                : `<span style="color:#2d7a3a">En ${dias} día(s)</span>`;

        return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0">
          ${p.madre_arete} ${p.madre_nombre ? `(${p.madre_nombre})` : ''}
        </td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0">${p.fecha_parto_esperada}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0">${estado}</td>
      </tr>`;
    }).join('');

    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#2d7a3a;padding:20px;border-radius:8px 8px 0 0">
        <h2 style="color:white;margin:0">🐄 GanaderíaGT — Partos Próximos</h2>
      </div>
      <div style="padding:20px;background:#f7fafc;border-radius:0 0 8px 8px">
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tienes <strong>${partos.length}</strong> parto(s) esperado(s) próximamente:</p>
        <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px">
          <thead>
            <tr style="background:#e2e8f0">
              <th style="padding:10px;text-align:left">Vaca</th>
              <th style="padding:10px;text-align:left">Fecha esperada</th>
              <th style="padding:10px;text-align:left">Estado</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
        <p style="margin-top:20px;color:#718096;font-size:14px">
          Prepara el área de partos y ten a mano los implementos necesarios.
          Ingresa a GanaderíaGT para registrar el resultado cuando ocurra.
        </p>
      </div>
    </div>`;

    await sendMail({
        to: email,
        subject: `🐄 GanaderíaGT — ${partos.length} parto(s) próximo(s)`,
        html,
    });
};

const iniciarPartos = () => {
    cron.schedule('30 7 * * *', procesarPartosProximos, {
        timezone: 'America/Guatemala',
    });
    logger.info('⏰  Job partos registrado — corre cada día a las 7:30 AM (Guatemala)');
};

module.exports = { iniciarPartos, procesarPartosProximos };