// app/(app)/planes.jsx
// Comparación Free vs Pro. El cobro real con Pagadito queda pendiente
// hasta tener credenciales de comercio (PAGADITO_UID / PAGADITO_WSK).
import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import useAuthStore from '../../stores/authStore';
import { COLORS } from '../../constants/colors';
import { LIMITES_FREE } from '../../constants/enums';
import ScreenHeader from '../../components/ScreenHeader';
import PrimaryButton from '../../components/PrimaryButton';
import Badge from '../../components/Badge';

export default function PlanesScreen() {
  const { usuario } = useAuthStore();
  const esPro = usuario?.plan === 'pro';

  const handleActualizar = () => {
    Alert.alert(
      'Próximamente',
      'El cobro con Pagadito todavía no está configurado. Cuando tengas tu cuenta de comercio Pagadito lista, este botón iniciará el pago real.',
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Planes" />

      <View style={styles.section}>
        <View style={styles.planCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.planName}>Free</Text>
            {!esPro && <Badge text="Tu plan" color={COLORS.gray500} />}
          </View>
          <Text style={styles.item}>• Hasta {LIMITES_FREE.animales} animales activos</Text>
          <Text style={styles.item}>• Hasta {LIMITES_FREE.fincas} finca</Text>
          <Text style={styles.item}>• Todos los módulos básicos</Text>
        </View>

        <View style={[styles.planCard, styles.planPro]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.planName, { color: '#fff' }]}>Pro</Text>
            {esPro && <Badge text="Tu plan" color={COLORS.secondary} />}
          </View>
          <Text style={[styles.item, { color: '#e8f5e9' }]}>• Animales y fincas ilimitados</Text>
          <Text style={[styles.item, { color: '#e8f5e9' }]}>• Soporte prioritario</Text>
          <Text style={[styles.item, { color: '#e8f5e9' }]}>• Próximamente: reportes avanzados</Text>

          {!esPro && (
            <PrimaryButton
              label="Actualizar a Pro"
              variant="light"
              onPress={handleActualizar}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  section: { padding: 20, gap: 16 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  planPro: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planName: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
  item: { fontSize: 13, color: COLORS.gray600, marginTop: 10 },
});
