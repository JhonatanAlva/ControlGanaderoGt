// app/_layout.jsx
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from '../stores/authStore';
import { COLORS } from '../constants/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

function AuthGuard() {
  const { usuario, cargando, inicializar } = useAuthStore();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => { inicializar(); }, []);

  useEffect(() => {
    if (cargando) return;
    const enAuth = segments[0] === '(auth)';
    if (!usuario && !enAuth) router.replace('/(auth)/login');
    else if (usuario && enAuth) router.replace('/(app)');
  }, [usuario, cargando, segments]);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}