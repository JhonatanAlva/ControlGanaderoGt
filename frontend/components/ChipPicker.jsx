// components/ChipPicker.jsx
// Selector horizontal tipo "chip". Si `multi` es true, value/onChange trabajan con arrays.
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ChipPicker({ label, options, value, onChange, allowDeselect = true }) {
  return (
    <View style={{ marginBottom: 16 }}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onChange(active && allowDeselect ? '' : opt)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, color: COLORS.gray600, fontWeight: '500', marginBottom: 6 },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.gray600 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});
