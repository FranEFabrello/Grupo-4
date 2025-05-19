import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Calendar({ availableDays = [], onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = [
    { day: 'L', isHeader: true },
    { day: 'M', isHeader: true },
    { day: 'X', isHeader: true },
    { day: 'J', isHeader: true },
    { day: 'V', isHeader: true },
    { day: 'S', isHeader: true },
    { day: 'D', isHeader: true },
    ...Array.from({ length: firstDayOfMonth }, () => ({ day: '', disabled: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      return {
        day: String(i + 1),
        disabled: new Date(currentYear, currentMonth, i + 1) < today || !availableDays.includes(dateStr),
        active: false,
      };
    }),
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text className="text-blue-600">Anterior</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold">
          {new Date(currentYear, currentMonth).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text className="text-blue-600">Siguiente</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap">
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
            onPress={() =>
              !day.disabled &&
              !day.isHeader &&
              onSelectDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`)
            }
            disabled={day.disabled || day.isHeader}
          >
            <Text className="text-sm">{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}