// stores/fincaStore.js
// Guarda cuál finca está "activa" para filtrar animales/vacunas/partos/gastos.
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const KEY = 'finca_activa_id';

const useFincaStore = create((set) => ({
  fincaActivaId: null,
  cargando: true,

  inicializar: async () => {
    const id = await SecureStore.getItemAsync(KEY);
    set({ fincaActivaId: id || null, cargando: false });
  },

  setFincaActiva: async (id) => {
    if (id) await SecureStore.setItemAsync(KEY, id);
    else await SecureStore.deleteItemAsync(KEY);
    set({ fincaActivaId: id || null });
  },
}));

export default useFincaStore;
