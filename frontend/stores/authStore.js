// stores/authStore.js
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

const useAuthStore = create((set) => ({
  usuario:  null,
  token:    null,
  cargando: true,
  error:    null,

  inicializar: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const res = await authService.me();
        set({ usuario: res.data.data.usuario, token, cargando: false });
      } else {
        set({ cargando: false });
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token');
      set({ usuario: null, token: null, cargando: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      const res = await authService.login({ email, password });
      const { usuario, token } = res.data.data;
      await SecureStore.setItemAsync('auth_token', token);
      set({ usuario, token, error: null });
      return true;
    } catch (err) {
      set({ error: err.mensaje || 'Error al iniciar sesión' });
      return false;
    }
  },

  registro: async (datos) => {
    set({ error: null });
    try {
      const res = await authService.registro(datos);
      const { usuario, token } = res.data.data;
      await SecureStore.setItemAsync('auth_token', token);
      set({ usuario, token, error: null });
      return true;
    } catch (err) {
      set({ error: err.mensaje || 'Error al registrarse' });
      return false;
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ usuario: null, token: null });
  },

  actualizarUsuario: (datos) => set((state) => ({ usuario: { ...state.usuario, ...datos } })),

  limpiarError: () => set({ error: null }),
}));

export default useAuthStore;