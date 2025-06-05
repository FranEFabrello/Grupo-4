import React from 'react';
import { View, StyleSheet, Pressable, Text, useColorScheme } from 'react-native';
import { showToast } from '~/components/ToastProvider';
import { useAppTheme } from "~/providers/ThemeProvider"; // ajustá si la ruta es distinta

export default function TestToastButton() {
  const { colorScheme } = useAppTheme();

  const buttonStyle = (bgColor) => [
    styles.buttonBase,
    { backgroundColor: bgColor },
  ];

  const textStyle = {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={buttonStyle('#22c55e')} // verde para success
        onPress={() => showToast('success', '¡Éxito!', 'Este es un toast de éxito.')}
      >
        <Text style={textStyle}>Probar Toast Success</Text>
      </Pressable>

      <Pressable
        style={buttonStyle('#ef4444')} // rojo para error
        onPress={() => showToast('error', 'Error', 'Algo salió mal, intenta de nuevo.')}
      >
        <Text style={textStyle}>Probar Toast Error</Text>
      </Pressable>

      <Pressable
        style={buttonStyle('#3b82f6')} // azul para info
        onPress={() => showToast('info', 'Información', 'Este es un mensaje informativo.')}
      >
        <Text style={textStyle}>Probar Toast Info</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});
