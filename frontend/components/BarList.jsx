// components/BarList.jsx
// Gráfica de barras simple (horizontal) hecha con Views, sin dependencias nativas.
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function BarList({ items }) {
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));

  return (
    <View>
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.max(4, (Math.abs(item.value) / max) * 100)}%`,
                  backgroundColor: item.color || COLORS.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.value}>{item.valueLabel ?? item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12 },
  label: { fontSize: 12, color: COLORS.gray600, marginBottom: 4 },
  track: { height: 10, backgroundColor: COLORS.gray100, borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  value: { fontSize: 11, color: COLORS.gray500, marginTop: 2, textAlign: 'right' },
});
