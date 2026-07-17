// app/(app)/animales/[id]/editar.jsx
import { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalesService } from '../../../../services/animalesService';
import { fincasService } from '../../../../services/fincasService';
import { RAZAS, SEXOS, TIPOS_ANIMAL, PROPOSITOS } from '../../../../constants/enums';
import { COLORS } from '../../../../constants/colors';
import ScreenHeader from '../../../../components/ScreenHeader';
import FormInput from '../../../../components/FormInput';
import ChipPicker from '../../../../components/ChipPicker';
import PrimaryButton from '../../../../components/PrimaryButton';

export default function EditarAnimalScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data: animal, isLoading } = useQuery({
    queryKey: ['animales', id],
    queryFn: () => animalesService.obtener(id),
    select: (res) => res.data.data.animal,
  });

  const { data: fincas } = useQuery({
    queryKey: ['fincas'],
    queryFn: () => fincasService.listar(),
    select: (res) => res.data.data.fincas,
  });

  const [form, setForm] = useState(null);
  useEffect(() => {
    if (animal && !form) {
      setForm({
        nombre: animal.nombre || '',
        raza: animal.raza || '',
        sexo: animal.sexo || '',
        tipo: animal.tipo || '',
        proposito: animal.proposito || '',
        finca_id: animal.finca_id || '',
        fecha_nacimiento: animal.fecha_nacimiento ? animal.fecha_nacimiento.slice(0, 10) : '',
        peso_actual: animal.peso_actual ? String(animal.peso_actual) : '',
        peso_compra: animal.peso_compra ? String(animal.peso_compra) : '',
        precio_compra: animal.precio_compra ? String(animal.precio_compra) : '',
        madre_arete: animal.madre_arete || '',
        padre_arete: animal.padre_arete || '',
        procedencia: animal.procedencia || '',
        notas: animal.notas || '',
      });
    }
  }, [animal]);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const mutation = useMutation({
    mutationFn: () => animalesService.actualizar(id, {
      nombre: form.nombre.trim() || undefined,
      raza: form.raza,
      sexo: form.sexo,
      tipo: form.tipo,
      proposito: form.proposito || undefined,
      finca_id: form.finca_id || undefined,
      fecha_nacimiento: form.fecha_nacimiento || undefined,
      peso_actual: form.peso_actual ? parseFloat(form.peso_actual) : undefined,
      peso_compra: form.peso_compra ? parseFloat(form.peso_compra) : undefined,
      precio_compra: form.precio_compra ? parseFloat(form.precio_compra) : undefined,
      madre_arete: form.madre_arete.trim() || undefined,
      padre_arete: form.padre_arete.trim() || undefined,
      procedencia: form.procedencia.trim() || undefined,
      notas: form.notas.trim() || undefined,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['animales'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      Alert.alert('Listo', 'Animal actualizado.', [{ text: 'OK', onPress: () => router.back() }]);
    },
    onError: (err) => Alert.alert('Error', err.mensaje || 'No se pudo actualizar el animal.'),
  });

  if (isLoading || !form) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title={`Editar ${animal.numero_arete}`} />

      <View style={{ padding: 24 }}>
        <FormInput label="Nombre" value={form.nombre} onChangeText={(v) => set('nombre', v)} />

        <ChipPicker label="Raza" options={RAZAS} value={form.raza} onChange={(v) => set('raza', v)} />
        <ChipPicker label="Sexo" options={SEXOS} value={form.sexo} onChange={(v) => set('sexo', v)} />
        <ChipPicker label="Tipo" options={TIPOS_ANIMAL} value={form.tipo} onChange={(v) => set('tipo', v)} />
        <ChipPicker label="Propósito" options={PROPOSITOS} value={form.proposito} onChange={(v) => set('proposito', v)} />

        {fincas?.length > 0 && (
          <ChipPicker
            label="Finca"
            options={fincas.map((f) => f.nombre)}
            value={fincas.find((f) => f.id === form.finca_id)?.nombre || ''}
            onChange={(nombre) => {
              const f = fincas.find((x) => x.nombre === nombre);
              set('finca_id', f ? f.id : '');
            }}
          />
        )}

        <FormInput
          label="Fecha de nacimiento (YYYY-MM-DD)"
          value={form.fecha_nacimiento}
          onChangeText={(v) => set('fecha_nacimiento', v)}
        />
        <FormInput
          label="Peso actual (libras)"
          keyboardType="decimal-pad"
          value={form.peso_actual}
          onChangeText={(v) => set('peso_actual', v.replace(/[^0-9.]/g, ''))}
        />
        <FormInput
          label="Peso de compra (libras)"
          keyboardType="decimal-pad"
          value={form.peso_compra}
          onChangeText={(v) => set('peso_compra', v.replace(/[^0-9.]/g, ''))}
        />
        <FormInput
          label="Precio de compra (Q)"
          keyboardType="decimal-pad"
          value={form.precio_compra}
          onChangeText={(v) => set('precio_compra', v.replace(/[^0-9.]/g, ''))}
        />
        <FormInput label="Arete de la madre" value={form.madre_arete} onChangeText={(v) => set('madre_arete', v)} />
        <FormInput label="Arete del padre" value={form.padre_arete} onChangeText={(v) => set('padre_arete', v)} />
        <FormInput label="Procedencia" value={form.procedencia} onChangeText={(v) => set('procedencia', v)} />
        <FormInput label="Notas" multiline value={form.notas} onChangeText={(v) => set('notas', v)} />

        <PrimaryButton label="Guardar cambios" onPress={() => mutation.mutate()} loading={mutation.isPending} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
