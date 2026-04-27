/**
 * utils/calculos.js
 * Funciones de cálculo específicas del dominio ganadero.
 */

"use strict";

const { DIAS_GESTACION } = require("../config/constants");

/**
 * Calcula la fecha esperada de parto sumando DIAS_GESTACION a la fecha de servicio.
 * @param {Date|string} fechaServicio
 * @returns {Date}
 */
const fechaPartoEsperada = (fechaServicio) => {
  const fecha = new Date(fechaServicio);
  fecha.setDate(fecha.getDate() + DIAS_GESTACION);
  return fecha;
};

/**
 * Calcula la edad de un animal en años y meses.
 * @param {Date|string} fechaNacimiento
 * @returns {{ anios: number, meses: number, texto: string }}
 */
const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento);
  let anios = hoy.getFullYear() - nac.getFullYear();
  let meses = hoy.getMonth() - nac.getMonth();

  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  let texto;
  if (anios > 0 && meses > 0)
    texto = `${anios} año${anios > 1 ? "s" : ""} y ${meses} mes${meses > 1 ? "es" : ""}`;
  else if (anios > 0) texto = `${anios} año${anios > 1 ? "s" : ""}`;
  else if (meses > 0) texto = `${meses} mes${meses > 1 ? "es" : ""}`;
  else texto = "Recién nacido";

  return { anios, meses, texto };
};

/**
 * Calcula la ganancia diaria de peso (GDP) en libras/día.
 * @param {number} pesoInicial   - libras
 * @param {number} pesoFinal     - libras
 * @param {number} dias
 * @returns {number}
 */
const gananciaDiariaWeight = (pesoInicial, pesoFinal, dias) => {
  if (dias <= 0) return 0;
  return parseFloat(((pesoFinal - pesoInicial) / dias).toFixed(3));
};

/**
 * Retorna cuántos días faltan para una fecha (negativo si ya pasó).
 * @param {Date|string} fecha
 * @returns {number}
 */
const diasHasta = (fecha) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
};

/**
 * Formatea una cantidad en quetzales.
 * @param {number} monto
 * @returns {string}  ej: "Q 1,250.00"
 */
const formatQuetzales = (monto) =>
  `Q ${Number(monto).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

module.exports = {
  fechaPartoEsperada,
  calcularEdad,
  gananciaDiariaWeight,
  diasHasta,
  formatQuetzales,
};
