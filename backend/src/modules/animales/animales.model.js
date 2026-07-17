/**
 * modules/animales/animales.model.js
 *
 * @typedef {object} Animal
 * @property {string}  id
 * @property {string}  usuario_id
 * @property {string}  [finca_id]
 * @property {string}  numero_arete
 * @property {string}  [nombre]
 * @property {string}  raza            - Ver RAZAS en constants.js
 * @property {string}  sexo            - 'Macho' | 'Hembra'
 * @property {string}  tipo            - 'Vaca' | 'Toro' | ...
 * @property {string}  [proposito]
 * @property {string}  estado          - 'Activo' | 'Vendido' | 'Muerto' | 'Robado'
 * @property {string}  [fecha_nacimiento]
 * @property {number}  [peso_actual]   - libras
 * @property {number}  [peso_compra]   - libras
 * @property {number}  [precio_compra] - quetzales
 * @property {number}  [precio_venta]  - quetzales
 * @property {string}  [fecha_venta]
 * @property {string}  [madre_id]      - UUID de la madre en el sistema
 * @property {string}  [padre_id]      - UUID del padre en el sistema
 * @property {string}  [madre_arete]   - Arete si la madre no está en el sistema
 * @property {string}  [padre_arete]   - Arete si el padre no está en el sistema
 * @property {string}  [procedencia]
 * @property {string}  [foto_url]
 * @property {string}  [notas]
 * @property {Date}    creado_en
 * @property {Date}    actualizado_en
 */

"use strict";

const PUBLIC_FIELDS = [
  "id",
  "usuario_id",
  "finca_id",
  "numero_arete",
  "nombre",
  "raza",
  "sexo",
  "tipo",
  "proposito",
  "estado",
  "fecha_nacimiento",
  "peso_actual",
  "peso_compra",
  "precio_compra",
  "precio_venta",
  "fecha_venta",
  "madre_id",
  "padre_id",
  "madre_arete",
  "padre_arete",
  "procedencia",
  "foto_url",
  "notas",
  "creado_en",
  "actualizado_en",
  // Campos calculados/joined que agrega animales.repository.js para listados
  "finca_nombre",
  "madre_arete_ref",
  "padre_arete_ref",
];

const toPublic = (row) => {
  if (!row) return null;
  return PUBLIC_FIELDS.reduce((acc, field) => {
    if (field in row) acc[field] = row[field];
    return acc;
  }, {});
};

module.exports = { toPublic, PUBLIC_FIELDS };
