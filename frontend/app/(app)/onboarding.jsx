// app/(app)/onboarding.jsx
// Tour de bienvenida — se muestra una sola vez tras el primer login/registro.
import { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Dimensions, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import useOnboardingStore from '../../stores/onboardingStore';
import { COLORS } from '../../constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🐄',
    title: '¡Bienvenido a GanaderíaGT!',
    text: 'Controla tu ganado, tu finca y tus finanzas desde el celular, sin papeleo.',
  },
  {
    emoji: '🐮',
    title: 'Registra tus animales',
    text: 'Arete, raza, peso y genealogía — todo en un solo lugar, con historial de pesajes y ganancia diaria.',
  },
  {
    emoji: '💉',
    title: 'No se te pasa ninguna vacuna',
    text: 'Te avisamos qué animales tienen vacunas vencidas o próximas a vencer en los siguientes 30 días.',
  },
  {
    emoji: '🐣',
    title: 'Lleva el control de partos',
    text: 'Registra el servicio y calculamos automáticamente la fecha esperada del parto.',
  },
  {
    emoji: '💰',
    title: 'Controla tus finanzas',
    text: 'Gastos, ingresos y balance mensual con gráficas, por finca o por animal.',
  },
  {
    emoji: '💬',
    title: 'Conecta con la comunidad',
    text: 'Precios de mercado, alertas sanitarias y compra-venta con otros ganaderos de tu región.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const marcarVisto = useOnboardingStore((s) => s.marcarVisto);
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  const finalizar = async () => {
    await marcarVisto();
    router.replace('/(app)');
  };

  const irA = (i) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setIndex(i);
  };

  const onScrollEnd = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const esUltima = index === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.saltar} onPress={finalizar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.saltarText}>Saltar</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <TouchableOpacity key={slide.title} onPress={() => irA(i)}>
              <View style={[styles.dot, i === index && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => (esUltima ? finalizar() : irA(index + 1))}
        >
          <Text style={styles.btnText}>{esUltima ? 'Comenzar' : 'Siguiente'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  saltar: { position: 'absolute', top: 56, right: 24, zIndex: 1 },
  saltarText: { color: COLORS.gray500, fontSize: 14, fontWeight: '600' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  emoji: { fontSize: 72, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, textAlign: 'center' },
  text: { fontSize: 14, color: COLORS.gray600, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gray200 },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
