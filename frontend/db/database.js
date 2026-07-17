// db/database.js
// Base de datos local SQLite — caché offline. Por ahora solo cubre `animales`
// como prueba de concepto; el patrón se puede replicar a otros módulos.
import * as SQLite from 'expo-sqlite';

let dbPromise = null;

export const getDb = () => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('ganaderiagt.db');
  return dbPromise;
};

export const initDb = async () => {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS animales (
      id TEXT PRIMARY KEY,
      usuario_id TEXT,
      datos TEXT NOT NULL,
      pendiente_sync INTEGER NOT NULL DEFAULT 0,
      actualizado_en TEXT
    );

    CREATE TABLE IF NOT EXISTS pending_mutations (
      id TEXT PRIMARY KEY,
      usuario_id TEXT,
      entidad TEXT NOT NULL,
      accion TEXT NOT NULL,
      entidad_local_id TEXT,
      payload TEXT NOT NULL,
      creado_en TEXT NOT NULL,
      intentos INTEGER NOT NULL DEFAULT 0,
      error TEXT
    );
  `);
  return db;
};

// Utilidad para un futuro "borrar caché" manual. No se llama automáticamente al
// cerrar sesión: a diferencia del caché de React Query, aquí cada fila queda
// asociada a un usuario_id y toda lectura/escritura ya filtra por el usuario
// activo, así que no hay filtrado entre cuentas — y borrar podría tirar
// mutaciones pendientes de sincronizar de otra sesión.
export const limpiarCacheLocal = async () => {
  const db = await getDb();
  await db.execAsync('DELETE FROM animales; DELETE FROM pending_mutations;');
};
