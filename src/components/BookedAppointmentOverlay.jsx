import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from "~/providers/ThemeProvider";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');
const BASE_SCALE = 2.5;
const SIZE = width * 0.3 * BASE_SCALE;
const LOGO_SIZE = SIZE * 0.5;
const blueTones = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

export default function BookedAppointmentOverlay({ appointment, onClose }) {
  const { colorScheme } = useAppTheme();
  const blurTint = colorScheme === 'dark' ? 'dark' : 'light';
  const [activeHearts, setActiveHearts] = React.useState([]);

  if (!appointment) return null;

  React.useEffect(() => {
    blueTones.forEach((_, index) => {
      setTimeout(() => {
        setActiveHearts((prev) => [...prev, index]);
      }, index * 500);
    });
  }, []);

  return (
    <BlurView intensity={50} tint={blurTint} style={styles.blur}>
      <View style={[styles.container, { width: SIZE, height: SIZE }]}>
        {activeHearts.map((i) => (
          <Animatable.View
            key={i}
            animation={pulseAnimation}
            iterationCount="infinite"
            duration={2000}
            useNativeDriver
            style={styles.pulse}
          >
            <Ionicons name="heart-outline" size={LOGO_SIZE * 0.9} color={blueTones[i]} />
          </Animatable.View>
        ))}
        <Ionicons name="checkmark-circle" size={LOGO_SIZE * 0.9} color={blueTones[0]} style={{ marginBottom: 10, position: 'absolute', zIndex: 2 }} />
        <Image
          source={require('../assets/logo.png')}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE, marginBottom: 10, zIndex: 3 }}
          resizeMode="contain"
        />
        <View style={{ alignItems: 'center', marginTop: LOGO_SIZE * 0.6, zIndex: 4 }}>
          <Text style={[styles.title, { color: colorScheme === 'light' ? '#2563EB' : '#60A5FA' }]}>¡Turno agendado!</Text>
          <Text style={[styles.info, { color: colorScheme === 'light' ? '#222' : '#eee' }]}>Fecha: {appointment.fecha}</Text>
          <Text style={[styles.info, { color: colorScheme === 'light' ? '#222' : '#eee' }]}>Hora: {appointment.horaInicio} - {appointment.horaFin}</Text>
          <Text style={[styles.info, { color: colorScheme === 'light' ? '#222' : '#eee' }]}>Profesional: {appointment.doctorInfo?.nombre} {appointment.doctorInfo?.apellido}</Text>
          <Text style={[styles.info, { color: colorScheme === 'light' ? '#222' : '#eee' }]}>Especialidad: {appointment.especialidadInfo?.descripcion}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Ver mis turnos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
}

const pulseAnimation = {
  0: { scale: 1, opacity: 0 },
  0.2: { scale: 1.2, opacity: 1 },
  0.7: { scale: 2.5, opacity: 0 },
  1: { scale: 3, opacity: 0 },
};

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: SIZE * 0.25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2563EB',
  },
  info: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
    color: '#222',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pulse: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
