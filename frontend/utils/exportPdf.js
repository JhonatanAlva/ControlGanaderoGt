// utils/exportPdf.js
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Genera un PDF a partir de HTML y abre el diálogo nativo para compartirlo/guardarlo.
export const exportarPDF = async (html, dialogTitle = 'Reporte') => {
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle, UTI: 'com.adobe.pdf' });
  }
};

const ESTILOS = `
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #1a202c; }
  h1 { color: #2d7a3a; font-size: 20px; margin-bottom: 4px; }
  .sub { color: #718096; font-size: 12px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { background: #2d7a3a; color: #fff; text-align: left; padding: 8px; font-size: 12px; }
  td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
  .totales { margin-top: 16px; display: flex; gap: 16px; }
  .totales div { flex: 1; background: #f7fafc; border-radius: 8px; padding: 12px; }
  .totales .label { font-size: 11px; color: #718096; }
  .totales .valor { font-size: 16px; font-weight: bold; }
`;

export const htmlReporteGastos = ({ usuarioNombre, anio, meses, totales, movimientos }) => `
  <html><head><meta charset="utf-8"><style>${ESTILOS}</style></head><body>
    <h1>🐄 GanaderíaGT — Reporte Financiero ${anio}</h1>
    <div class="sub">${usuarioNombre} · Generado el ${new Date().toLocaleDateString('es-GT')}</div>

    <div class="totales">
      <div><div class="label">Ingresos</div><div class="valor" style="color:#38a169">Q${Number(totales.total_ingresos).toFixed(2)}</div></div>
      <div><div class="label">Gastos</div><div class="valor" style="color:#e53e3e">Q${Number(totales.total_gastos).toFixed(2)}</div></div>
      <div><div class="label">Balance</div><div class="valor">Q${Number(totales.balance).toFixed(2)}</div></div>
    </div>

    <table>
      <thead><tr><th>Mes</th><th>Ingresos</th><th>Gastos</th><th>Balance</th></tr></thead>
      <tbody>
        ${meses.map((m) => `
          <tr>
            <td>${m.mes}</td>
            <td>Q${Number(m.total_ingresos).toFixed(2)}</td>
            <td>Q${Number(m.total_gastos).toFixed(2)}</td>
            <td>Q${Number(m.balance).toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <h2 style="font-size:14px;margin-top:24px">Movimientos (${movimientos.length})</h2>
    <table>
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Descripción</th><th>Monto</th></tr></thead>
      <tbody>
        ${movimientos.map((g) => `
          <tr>
            <td>${g.fecha?.slice(0, 10)}</td>
            <td>${g.tipo}</td>
            <td>${g.categoria}</td>
            <td>${g.descripcion || '—'}</td>
            <td>${g.tipo === 'Ingreso' ? '+' : '-'}Q${Number(g.monto).toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </body></html>
`;

export const htmlReporteAnimales = ({ usuarioNombre, animales }) => `
  <html><head><meta charset="utf-8"><style>${ESTILOS}</style></head><body>
    <h1>🐄 GanaderíaGT — Inventario de Animales</h1>
    <div class="sub">${usuarioNombre} · ${animales.length} animal(es) · Generado el ${new Date().toLocaleDateString('es-GT')}</div>

    <table>
      <thead>
        <tr><th>Arete</th><th>Nombre</th><th>Raza</th><th>Tipo</th><th>Sexo</th><th>Estado</th><th>Peso (lb)</th><th>Finca</th></tr>
      </thead>
      <tbody>
        ${animales.map((a) => `
          <tr>
            <td>${a.numero_arete}</td>
            <td>${a.nombre || '—'}</td>
            <td>${a.raza}</td>
            <td>${a.tipo}</td>
            <td>${a.sexo}</td>
            <td>${a.estado}</td>
            <td>${a.peso_actual || '—'}</td>
            <td>${a.finca_nombre || '—'}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </body></html>
`;
