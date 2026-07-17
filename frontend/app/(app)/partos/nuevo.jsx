// app/(app)/partos/nuevo.jsx
import { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { partosService } from '../../../services/partosService';
import { animalesService } from '../../../services/animalesService';
import { TIPOS_REPRODUCCION } from '../../../constants/enums';
import ScreenHeader from '../../../components/ScreenHeader';
import FormInput from '../../../components/FormInput';
import ChipPicker from '../../../components/ChipPicker';
import PrimaryButton from '../../../components/PrimaryButton';

export default function NuevoPartoScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: hembras } = useQuery({
    queryKey: ['animales', { estado: 'Activo', sexo: 'Hembra' }],
    queryFn: () => animalesService.listar({ estado: 'Activo', sexo: 'Hembra', limit: 100 }),
    select: (res) => res.data.data,
  });

  const [form, setForm] = useState({
    madre_id: '', padre_arete: '', tipo_reproduccion: '', fecha_servicio: '', notas: '',
  });
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const mutation = useMutation({
    mutationFn: () => partosService.registrarServicio({
      madre_id: form.madre_id,
      padre_arete: form.padre_arete.trim() || undefined,
      tipo_reproduccion: form.tipo_reproduccion,
      fecha_servicio: form.fecha_servicio,
      notas: form.notas.trim() || undefined,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partos'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      Alert.alert('Listo', 'Servicio registrado. La fecha de parto esperada se calculó automáticamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (err) => Alert.alert('Error', err.mensaje || 'No se pudo registrar el servicio.'),
  });

  const handleGuardar = () => {
    if (!form.madre_id) return Alert.alert('Campo requerido', 'Selecciona la madre.');
    if (!form.tipo_reproduccion) return Alert.alert('Campo requerido', 'Selecciona el tipo de reproducción.');
    if (!form.fecha_servicio) return Alert.alert('Campo requerido', 'Ingresa la fecha de servicio.');
    mutation.mutate();
  };

  const madreSeleccionada = hembras?.find((a) => a.id === form.madre_id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Nuevo Servicio" />

      <View style={{ padding: 24 }}>
        {hembras?.length > 0 ? (
          <ChipPicker
            label="Madre *"
            options={hembras.map((a) => a.nombre || a.numero_arete)}
            value={madreSeleccionada?.nombre || madreSeleccionada?.numero_arete || ''}
            onChange={(label) => {
              const a = hembras.find((x) => (x.nombre || x.numero_arete) === label);
              set('madre_id', a ? a.id : '');
            }}
          />
        ) : (
          <FormInput label="Madre" editable={false} value="No tienes hembras activas registradas" />
        )}

        <ChipPicker
          label="Tipo de reproducción *"
          options={TIPOS_REPRODUCCION}
          value={form.tipo_reproduccion}
          onChange={(v) => set('tipo_reproduccion', v)}
        />

        <FormInput
          label="Fecha de servicio (YYYY-MM-DD) *"
          placeholder="2026-07-16"
          value={form.fecha_servicio}
          onChangeText={(v) => set('fecha_servicio', v)}
        />
        <FormInput
          label="Arete del padre (si no está en el sistema)"
          value={form.padre_arete}
          onChangeText={(v) => set('padre_arete', v)}
        />
        <FormInput label="Notas" multiline value={form.notas} onChangeText={(v) => set('notas', v)} />

        <PrimaryButton label="Registrar servicio" onPress={handleGuardar} loading={mutation.isPending} />
      </View>
    </ScrollView>
  );
}
