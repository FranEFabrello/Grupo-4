import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function FilterButton({ onPress, label = 'Filtrar' }) {
  return (
    <TouchableOpacity
      className="border border-blue-600 rounded-lg px-3 py-2 flex-row items-center"
      onPress={onPress}
    >
      <Icon name="sliders-h" size={14} color="#4a6fa5" />
      <Text className="text-blue-600 text-sm ml-1">{label}</Text>
    </TouchableOpacity>
  );
}