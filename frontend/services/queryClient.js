// services/queryClient.js
// Instancia única compartida entre el Provider (app/_layout.jsx) y authStore,
// para poder limpiar el caché al cerrar sesión y evitar que datos de un
// usuario se filtren visualmente a la sesión del siguiente.
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});
