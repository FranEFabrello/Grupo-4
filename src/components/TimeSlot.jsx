import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TimeSlot({ time, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      className={`w-[30%] p-2 rounded-lg text-center mb-2 ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
      }`}
      onPress={onSelect}
    >
      <Text className="text-sm">{time}</Text>
    </TouchableOpacity>
  );
}