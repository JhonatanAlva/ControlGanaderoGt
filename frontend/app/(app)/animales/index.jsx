// app/(app)/animales/index.jsx
import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, RefreshControl,
  TouchableOpacity, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { animalesService } from '../../../services/animalesService';
import { COLORS } from '../../../constants/colors';
import { ESTADOS_ANIMAL } from '../../../constants/enums';
import ScreenHeader from '../../../components/ScreenHeader';
import ChipPicker from '../../../components/ChipPicker';
import Badge from '../../../components/Badge';

const ESTADO_COLOR = {
  Activo: COLORS.success,
  Vendido: COLORS.secondary,
  Muerto: COLORS.gray500,
  Robado: COLORS.danger,
};

export default function AnimalesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['animales', { estado, search }],
    queryFn: () => animalesService.listar({
      ...(estado && { estado }),
      ...(search && { search }),
      limit: 100,
    }),
    select: (res) => res.data.data,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['animales'] });
    setRefreshing(false);
  }, [queryClient]);

  const animales = data || [];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Animales"
        rightLabel="+ Nuevo"
        onRightPress={() => router.push('/(app)/animales/nuevo')}
      />

      <View style={styles.filtros}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por arete o nombre..."
          placeholderTextColor={COLORS.gray500}
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <ChipPicker
          options={ESTADOS_ANIMAL}
          value={estado}
          onChange={setEstado}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {isLoading && <ActivityIndicator style={{ marginTop: 32 }} color={COLORS.primary} />}

        {isError && (
          <Text style={styles.errorText}>No se pudieron cargar los animales. Desliza para reintentar.</Text>
        )}

        {!isLoading && animales.length === 0 && (
          <Text style={styles.emptyText}>No hay animales que coincidan con el filtro.</Text>
        )}

        {animales.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={styles.card}
            onPress={() => router.push(`/(app)/animales/${a.id}`)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{a.nombre || a.numero_arete}</Text>
              <Text style={styles.cardSub}>
                {a.numero_arete} · {a.raza} · {a.tipo} · {a.sexo}
              </Text>
              {a.finca_nombre && <Text style={styles.cardSub}>{a.finca_nombre}</Text>}
            </View>
            <Badge text={a.estado} color={ESTADO_COLOR[a.estado] || COLORS.gray500} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  filtros: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  search: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.gray50,
    marginBottom: 12,
  },
  errorText: { color: COLORS.danger, textAlign: 'center', marginTop: 24, paddingHorizontal: 24 },
  emptyText: { color: COLORS.gray500, textAlign: 'center', marginTop: 32, paddingHorizontal: 32, fontSize: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  cardSub: { fontSize: 12, color: COLORS.gray600, marginTop: 2 },
});
