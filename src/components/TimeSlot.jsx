import React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';

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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginVertical: 8 }}>
      <TouchableOpacity
        className={`w-full rounded-xl px-4 py-3 items-center justify-center border-2 ${isSelected
          ? (colorScheme === 'dark' ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-blue-500 border-blue-400 shadow-lg')
          : (colorScheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')} transition-all duration-200`}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text className={`text-base font-semibold ${isSelected ? 'text-white' : (colorScheme === 'dark' ? 'text-gray-100' : 'text-blue-600')}`}>
          {time}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}