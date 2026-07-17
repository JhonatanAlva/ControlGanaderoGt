// offline/syncManager.js
// Procesa la cola de cambios hechos sin conexión, en orden, cuando vuelve la señal.
// Política de conflictos: "gana el último cambio que se sincroniza" (sin merge manual) —
// el backend no tiene control de versiones por registro, así que no se puede detectar
// un conflicto real; esto es una limitación conocida y aceptada para la v1 offline.
import NetInfo from '@react-native-community/netinfo';
import { getDb } from '../db/database';
import { animalesService } from '../services/animalesService';
import useAuthStore from '../stores/authStore';

let sincronizando = false;
const listeners = new Set();

export const suscribirseASync = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const notificar = (evento) => listeners.forEach((fn) => fn(evento));

export const encolarMutacion = async ({ entidad, accion, entidadLocalId, payload }) => {
  const db = await getDb();
  const usuarioId = useAuthStore.getState().usuario?.id || null;
  const id = `mut_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.runAsync(
    `INSERT INTO pending_mutations (id, usuario_id, entidad, accion, entidad_local_id, payload, creado_en, intentos)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [id, usuarioId, entidad, accion, entidadLocalId, JSON.stringify(payload), new Date().toISOString()],
  );
  notificar({ tipo: 'encolado' });
};

export const contarPendientes = async () => {
  const db = await getDb();
  const usuarioId = useAuthStore.getState().usuario?.id || null;
  const row = await db.getFirstAsync(
    'SELECT COUNT(*) as total FROM pending_mutations WHERE usuario_id = ?',
    [usuarioId],
  );
  return row?.total || 0;
};

// Reasigna el id local temporal ("local_...") por el id real que asignó el servidor,
// tanto en la fila cacheada como en las mutaciones que todavía están en cola.
const remapearId = async (idLocal, idReal) => {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    const row = await db.getFirstAsync('SELECT * FROM animales WHERE id = ?', [idLocal]);
    if (row) {
      const datos = { ...JSON.parse(row.datos), id: idReal };
      await db.runAsync('DELETE FROM animales WHERE id = ?', [idLocal]);
      await db.runAsync(
        'INSERT INTO animales (id, usuario_id, datos, pendiente_sync, actualizado_en) VALUES (?, ?, ?, 0, ?)',
        [idReal, row.usuario_id, JSON.stringify(datos), datos.actualizado_en || new Date().toISOString()],
      );
    }
    await db.runAsync(
      'UPDATE pending_mutations SET entidad_local_id = ? WHERE entidad_local_id = ?',
      [idReal, idLocal],
    );
  });
};

const ejecutarMutacion = async (mut) => {
  const payload = JSON.parse(mut.payload);
  if (mut.entidad !== 'animales') return;

  if (mut.accion === 'crear') {
    const res = await animalesService.crear(payload.datos, payload.foto);
    await remapearId(mut.entidad_local_id, res.data.data.animal.id);
  } else if (mut.accion === 'actualizar') {
    await animalesService.actualizar(mut.entidad_local_id, payload.datos, payload.foto);
  } else if (mut.accion === 'cambiarEstado') {
    await animalesService.cambiarEstado(mut.entidad_local_id, payload.datos);
  } else if (mut.accion === 'registrarPeso') {
    await animalesService.registrarPeso(mut.entidad_local_id, payload.datos);
  }
};

export const procesarCola = async () => {
  if (sincronizando) return;
  const estadoRed = await NetInfo.fetch();
  if (!estadoRed.isConnected || estadoRed.isInternetReachable === false) return;

  sincronizando = true;
  notificar({ tipo: 'iniciando' });

  try {
    const db = await getDb();
    const usuarioId = useAuthStore.getState().usuario?.id || null;
    const pendientes = await db.getAllAsync(
      'SELECT * FROM pending_mutations WHERE usuario_id = ? ORDER BY creado_en ASC',
      [usuarioId],
    );

    for (const mut of pendientes) {
      try {
        await ejecutarMutacion(mut);
        await db.runAsync('DELETE FROM pending_mutations WHERE id = ?', [mut.id]);
      } catch (err) {
        const status = err?.response?.status;
        const esErrorDeValidacion = status >= 400 && status < 500;
        await db.runAsync(
          'UPDATE pending_mutations SET intentos = intentos + 1, error = ? WHERE id = ?',
          [err?.mensaje || err?.message || 'Error desconocido', mut.id],
        );
        // Error de validación → no se va a resolver reintentando, se salta y se deja marcada.
        // Error de red/servidor → se detiene la cola, se reintenta completa la próxima vez.
        if (!esErrorDeValidacion) break;
      }
    }
  } finally {
    sincronizando = false;
    notificar({ tipo: 'terminado' });
  }
};

let unsubscribeNetInfo = null;
export const iniciarSyncAutomatico = () => {
  if (unsubscribeNetInfo) return;
  unsubscribeNetInfo = NetInfo.addEventListener((estado) => {
    if (estado.isConnected && estado.isInternetReachable !== false) {
      procesarCola();
    }
  });
};
