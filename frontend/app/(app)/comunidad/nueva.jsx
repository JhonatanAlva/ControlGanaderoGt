// app/(app)/comunidad/nueva.jsx
import { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { comunidadService } from '../../../services/comunidadService';
import { TIPOS_POST, REGIONES_GUATEMALA } from '../../../constants/enums';
import ScreenHeader from '../../../components/ScreenHeader';
import FormInput from '../../../components/FormInput';
import ChipPicker from '../../../components/ChipPicker';
import PrimaryButton from '../../../components/PrimaryButton';

const TIPOS_CON_ANIMAL = ['Venta de animal', 'Compra de animal'];

export default function NuevaPublicacionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    tipo: '', titulo: '', contenido: '', region: '',
    precio: '', raza_animal: '', peso_animal: '', contacto_whatsapp: '',
  });
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const mutation = useMutation({
    mutationFn: () => comunidadService.crear({
      tipo: form.tipo,
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      region: form.region,
      precio: form.precio ? parseFloat(form.precio) : undefined,
      raza_animal: form.raza_animal.trim() || undefined,
      peso_animal: form.peso_animal ? parseFloat(form.peso_animal) : undefined,
      contacto_whatsapp: form.contacto_whatsapp.trim() || undefined,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comunidad'] });
      Alert.alert('Listo', 'Publicación creada.', [{ text: 'OK', onPress: () => router.back() }]);
    },
    onError: (err) => Alert.alert('Error', err.mensaje || 'No se pudo crear la publicación.'),
  });

  const handlePublicar = () => {
    if (!form.tipo) return Alert.alert('Campo requerido', 'Selecciona el tipo de publicación.');
    if (form.titulo.trim().length < 3) return Alert.alert('Campo requerido', 'El título debe tener al menos 3 caracteres.');
    if (form.contenido.trim().length < 10) return Alert.alert('Campo requerido', 'El contenido debe tener al menos 10 caracteres.');
    if (!form.region) return Alert.alert('Campo requerido', 'Selecciona el departamento.');
    mutation.mutate();
  };

  const mostrarCamposAnimal = TIPOS_CON_ANIMAL.includes(form.tipo);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Nueva Publicación" />

      <View style={{ padding: 24 }}>
        <ChipPicker label="Tipo *" options={TIPOS_POST} value={form.tipo} onChange={(v) => set('tipo', v)} />
        <FormInput label="Título *" value={form.titulo} onChangeText={(v) => set('titulo', v)} />
        <FormInput label="Contenido *" multiline value={form.contenido} onChangeText={(v) => set('contenido', v)} />
        <ChipPicker label="Departamento *" options={REGIONES_GUATEMALA} value={form.region} onChange={(v) => set('region', v)} />

        {mostrarCamposAnimal && (
          <>
            <FormInput
              label="Precio (Q)"
              keyboardType="decimal-pad"
              value={form.precio}
              onChangeText={(v) => set('precio', v.replace(/[^0-9.]/g, ''))}
            />
            <FormInput label="Raza del animal" value={form.raza_animal} onChangeText={(v) => set('raza_animal', v)} />
            <FormInput
              label="Peso del animal (lb)"
              keyboardType="decimal-pad"
              value={form.peso_animal}
              onChangeText={(v) => set('peso_animal', v.replace(/[^0-9.]/g, ''))}
            />
          </>
        )}

        <FormInput
          label="WhatsApp de contacto"
          placeholder="502..."
          keyboardType="phone-pad"
          value={form.contacto_whatsapp}
          onChangeText={(v) => set('contacto_whatsapp', v)}
        />

        <PrimaryButton label="Publicar" onPress={handlePublicar} loading={mutation.isPending} />
      </View>
    </ScrollView>
  );
}
