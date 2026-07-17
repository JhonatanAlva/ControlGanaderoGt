// components/PrimaryButton.jsx
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary', style }) {
  const isDanger = variant === 'danger';
  const isOutline = variant === 'outline'; // borde/texto rojo — para acciones destructivas
  const isOutlinePrimary = variant === 'outlinePrimary'; // borde/texto verde — para acciones neutrales
  const isLight = variant === 'light'; // fondo blanco, texto primary — para usar sobre fondos de color

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isDanger && styles.btnDanger,
        isOutline && styles.btnOutline,
        isOutlinePrimary && styles.btnOutlinePrimary,
        isLight && styles.btnLight,
        (disabled || loading) && { opacity: 0.7 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading
        ? <ActivityIndicator color={isOutline ? COLORS.danger : (isOutlinePrimary || isLight) ? COLORS.primary : '#fff'} />
        : (
          <Text style={[
            styles.text,
            isOutline && styles.textOutline,
            (isOutlinePrimary || isLight) && styles.textLight,
          ]}>
            {label}
          </Text>
        )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDanger: { backgroundColor: COLORS.danger },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.danger },
  btnOutlinePrimary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  btnLight: { backgroundColor: '#fff' },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  textOutline: { color: COLORS.danger },
  textLight: { color: COLORS.primary },
});
