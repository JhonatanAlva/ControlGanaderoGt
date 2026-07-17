// app/(app)/_layout.jsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import useFincaStore from '../../stores/fincaStore';

export default function AppLayout() {
  const inicializar = useFincaStore((s) => s.inicializar);

  useEffect(() => { inicializar(); }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
