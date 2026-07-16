// app/(app)/index.jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAuthStore from '../../stores/authStore';
import { COLORS } from '../../constants/colors';

export default function DashboardScreen() {
  const { usuario, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola, {usuario?.nombre}!</Text>
      <Text style={styles.subtitle}>Dashboard — próximamente</Text>

      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title:    { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.gray500, marginBottom: 32 },
  btn: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
