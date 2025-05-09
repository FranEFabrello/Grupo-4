import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function TabButton({ label, isActive, onPress }) {
  return (
    <TouchableOpacity
      className={`rounded-lg px-4 py-2 ${isActive ? 'bg-blue-600' : 'border border-blue-600'}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${isActive ? 'text-white' : 'text-blue-600'}`}>{label}</Text>
    </TouchableOpacity>
  );
}