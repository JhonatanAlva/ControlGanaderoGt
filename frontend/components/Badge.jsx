// components/Badge.jsx
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ text, color }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
