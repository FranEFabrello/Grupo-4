import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function TabButton({ label, isActive, onPress }) {
  return (
    <TouchableOpacity
      className={`rounded-lg px-4 py-2 ${isActive ? 'bg-blue-600' : 'bg-blue-900'}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</Text>
    </TouchableOpacity>
  );
}
