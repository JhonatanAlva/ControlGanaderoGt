// app/(app)/comunidad/[id].jsx
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comunidadService } from '../../../services/comunidadService';
import useAuthStore from '../../../stores/authStore';
import { COLORS } from '../../../constants/colors';
import { formatQ } from '../../../utils/format';
import ScreenHeader from '../../../components/ScreenHeader';
import PrimaryButton from '../../../components/PrimaryButton';

export default function DetallePublicacionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { usuario } = useAuthStore();

  const { data: post, isLoading } = useQuery({
    queryKey: ['comunidad', id],
    queryFn: () => comunidadService.obtener(id),
    select: (res) => res.data.data.post,
  });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['comunidad'] });

  const likeMutation = useMutation({
    mutationFn: () => comunidadService.toggleLike(id),
    onSuccess: invalidar,
  });

  const eliminarMutation = useMutation({
    mutationFn: () => comunidadService.eliminar(id),
    onSuccess: async () => {
      await invalidar();
      router.back();
    },
    onError: (err) => Alert.alert('Error', err.mensaje || 'No se pudo eliminar la publicación.'),
  });

  const confirmarEliminar = () => {
    Alert.alert('Eliminar publicación', '¿Seguro que quieres eliminarla?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminarMutation.mutate() },
    ]);
  };

  if (isLoading || !post) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const esAutor = post.autor_id === usuario?.id;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title={post.tipo} />

      <View style={styles.section}>
        <Text style={styles.titulo}>{post.titulo}</Text>
        <Text style={styles.meta}>{post.autor_nombre} · {post.region}</Text>
        <Text style={styles.contenido}>{post.contenido}</Text>

        {post.precio && <Text style={styles.precio}>{formatQ(post.precio)}</Text>}
        {post.raza_animal && <Text style={styles.sub}>Raza: {post.raza_animal}</Text>}
        {post.peso_animal && <Text style={styles.sub}>Peso: {post.peso_animal} lb</Text>}
        {post.contacto_whatsapp && <Text style={styles.sub}>WhatsApp: {post.contacto_whatsapp}</Text>}

        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => likeMutation.mutate()}
        >
          <Text style={[styles.likeIcon, post.yo_di_like && { color: COLORS.danger }]}>
            {post.yo_di_like ? '♥' : '♡'}
          </Text>
          <Text style={styles.likeCount}>{post.likes} likes</Text>
        </TouchableOpacity>

        {esAutor && (
          <PrimaryButton
            label="Eliminar publicación"
            variant="outline"
            onPress={confirmarEliminar}
            loading={eliminarMutation.isPending}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  section: { padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
  meta: { fontSize: 12, color: COLORS.gray500, marginTop: 4 },
  contenido: { fontSize: 14, color: COLORS.gray700, marginTop: 16, lineHeight: 20 },
  precio: { fontSize: 18, fontWeight: 'bold', color: COLORS.success, marginTop: 16 },
  sub: { fontSize: 13, color: COLORS.gray600, marginTop: 6 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 6 },
  likeIcon: { fontSize: 24, color: COLORS.gray500 },
  likeCount: { fontSize: 14, color: COLORS.gray600 },
});
