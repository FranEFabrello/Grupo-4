import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Calendar({ onSelectDate }) {
  const days = [
    { day: 'L', isHeader: true },
    { day: 'M', isHeader: true },
    { day: 'X', isHeader: true },
    { day: 'J', isHeader: true },
    { day: 'V', isHeader: true },
    { day: 'S', isHeader: true },
    { day: 'D', isHeader: true },
    ...Array.from({ length: 35 }, (_, i) => ({
      day: i < 2 ? String(i + 29) : String(i - 1),
      disabled: i < 2 || i > 32,
      active: i === 14,
    })),
  ];

  return (
    <View className="flex-row flex-wrap mb-4">
      {days.map((day, index) => (
        <TouchableOpacity
          key={index}
          className={`w-[14.28%] p-2 rounded-lg text-center ${
            day.isHeader
              ? 'bg-gray-200'
              : day.disabled
              ? 'bg-gray-100 text-gray-400'
              : day.active
              ? 'bg-blue-600 text-white'
              : 'bg-white'
          }`}
          onPress={() => !day.disabled && !day.isHeader && onSelectDate(day.day)}
          disabled={day.disabled || day.isHeader}
        >
          <Text className="text-sm">{day.day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}