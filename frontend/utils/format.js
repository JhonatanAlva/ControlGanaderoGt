// utils/format.js
export const formatQ = (n) =>
  `Q${Number(n || 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Postgres devuelve las columnas DATE como ISO completo ("2025-11-01T00:00:00.000Z").
export const formatFecha = (fecha) => {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
};
