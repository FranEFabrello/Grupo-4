import React from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

export default function TimeSlot({ time, isSelected, onSelect, colorScheme }) {
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const containerStyle = [
    styles.container,
    isSelected
      ? (colorScheme === 'dark' ? styles.selectedDark : styles.selectedLight)
      : (colorScheme === 'dark' ? styles.unselectedDark : styles.unselectedLight)
  ];

  const textStyle = [
    styles.text,
    isSelected ? styles.textSelected : (colorScheme === 'dark' ? styles.textDark : styles.textLight)
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginVertical: 8 }}>
      <TouchableOpacity
        style={containerStyle}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text style={textStyle}>{time}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  selectedLight: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedDark: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  unselectedLight: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  unselectedDark: {
    backgroundColor: '#1f2937',
    borderColor: '#4b5563',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSelected: {
    color: '#fff',
  },
  textLight: {
    color: '#3b82f6',
  },
  textDark: {
    color: '#f3f4f6',
  },
});
