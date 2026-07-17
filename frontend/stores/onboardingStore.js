// stores/onboardingStore.js
// Recuerda si el usuario ya vio el tour de bienvenida, para no mostrarlo de nuevo.
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const KEY = 'onboarding_visto';

const useOnboardingStore = create((set) => ({
  visto: true, // por defecto true hasta confirmar, para no destellar el tour
  cargando: true,

  inicializar: async () => {
    const valor = await SecureStore.getItemAsync(KEY);
    set({ visto: valor === 'true', cargando: false });
  },

  marcarVisto: async () => {
    await SecureStore.setItemAsync(KEY, 'true');
    set({ visto: true });
  },
}));

export default useOnboardingStore;
