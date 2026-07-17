// components/AnimalPicker.jsx
// Selector de animal con búsqueda — reemplaza los ChipPicker cuando la lista
// de animales puede crecer mucho (madre/padre, vacunas, gastos por animal).
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, FlatList, StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function AnimalPicker({ label, animales, value, onChange, placeholder = 'Buscar animal...' }) {
  const [visible, setVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const lista = animales || [];
  const seleccionado = lista.find((a) => a.id === value);

  const filtrados = lista.filter((a) => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return true;
    return (a.numero_arete || '').toLowerCase().includes(q) || (a.nombre || '').toLowerCase().includes(q);
  });

  const cerrar = () => {
    setVisible(false);
    setBusqueda('');
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={seleccionado ? styles.triggerTextSelected : styles.triggerTextPlaceholder} numberOfLines={1}>
          {seleccionado ? `${seleccionado.nombre || seleccionado.numero_arete} (${seleccionado.numero_arete})` : placeholder}
        </Text>
        {seleccionado && (
          <TouchableOpacity onPress={() => onChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={cerrar}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.search}
              placeholder="Buscar por arete o nombre..."
              placeholderTextColor={COLORS.gray500}
              value={busqueda}
              onChangeText={setBusqueda}
              autoFocus
            />
            <TouchableOpacity onPress={cerrar} style={{ marginLeft: 12 }}>
              <Text style={styles.cerrarText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filtrados}
            keyExtractor={(a) => a.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.emptyText}>Sin resultados.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => { onChange(item.id); cerrar(); }}
              >
                <Text style={styles.itemTitle}>{item.nombre || item.numero_arete}</Text>
                <Text style={styles.itemSub}>{item.numero_arete} · {item.raza} · {item.sexo}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, color: COLORS.gray600, fontWeight: '500', marginBottom: 6 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: COLORS.gray300, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.gray50,
  },
  triggerTextSelected: { fontSize: 15, color: COLORS.black, flex: 1 },
  triggerTextPlaceholder: { fontSize: 15, color: COLORS.gray500, flex: 1 },
  clear: { fontSize: 16, color: COLORS.gray500, marginLeft: 8 },

  modal: { flex: 1, backgroundColor: '#fff', paddingTop: 56 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  search: {
    flex: 1, borderWidth: 1, borderColor: COLORS.gray300, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, backgroundColor: COLORS.gray50,
  },
  cerrarText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  emptyText: { textAlign: 'center', color: COLORS.gray500, marginTop: 32, fontSize: 14 },
  item: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.black },
  itemSub: { fontSize: 12, color: COLORS.gray600, marginTop: 2 },
});
