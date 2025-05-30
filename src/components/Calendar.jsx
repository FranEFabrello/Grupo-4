import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Calendar({ availableDays = [], onSelectDate, selectedDate, colorScheme: propColorScheme }) {
  const { t, i18n } = useTranslation();
  const colorScheme = propColorScheme || useColorScheme();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const normalizedFirstDay = (firstDayOfMonth + 6) % 7; // lunes como inicio

  // Renderizar headers en una sola fila
  const weekDays = [
    t('appointments.calendar.days.mon'),
    t('appointments.calendar.days.tue'),
    t('appointments.calendar.days.wed'),
    t('appointments.calendar.days.thu'),
    t('appointments.calendar.days.fri'),
    t('appointments.calendar.days.sat'),
    t('appointments.calendar.days.sun'),
  ];

  // Generar solo los días (sin headers)
  const dayCells = [
    ...Array.from({ length: normalizedFirstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
      const isDisabled = date < today || !availableDays.includes(dateStr);
      const isActive = selectedDate === dateStr;
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      return {
        day: String(i + 1),
        disabled: isDisabled,
        active: isActive,
        isToday,
        dateStr,
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

  const handleSelectDate = (dateStr) => {
    onSelectDate(dateStr);
  };

  // Colores y estilos para dark y light mode mejorados
  const bgMain = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white border border-gray-200 shadow-lg';
  const bgHeader = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const textHeader = colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderHeader = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <View className={`mb-4 rounded-xl p-4 ${bgMain}`}>
      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity onPress={handlePrevMonth} className="px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-gray-700">
          <Text className="text-blue-600 font-bold">{t('appointments.calendar.prev')}</Text>
        </TouchableOpacity>
        <Text className={`text-base font-semibold capitalize ${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          {new Date(currentYear, currentMonth).toLocaleDateString(i18n.language, {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} className="px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-gray-700">
          <Text className="text-blue-600 font-bold">{t('appointments.calendar.next')}</Text>
        </TouchableOpacity>
      </View>
      {/* Header de días */}
      <View className={`flex-row mb-1 rounded-lg overflow-hidden border ${borderHeader}`}>
        {weekDays.map((wd, i) => (
          <View key={i} className={`w-[14.28%] items-center py-1 ${bgHeader}`}>
            <Text className={`text-xs font-semibold ${textHeader}`}>{wd}</Text>
          </View>
        ))}
      </View>
      {/* Días del mes en filas de 7 */}
      <View>
        {Array.from({ length: Math.ceil(dayCells.length / 7) }).map((_, rowIdx) => (
          <View key={rowIdx} className="flex-row">
            {dayCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (!day) {
                return <View key={colIdx} className="w-[14.28%] h-12" />;
              }
              let isAvailable = !day.disabled;
              let bgColor = day.disabled
                ? (colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')
                : day.active
                  ? 'bg-blue-600'
                  : day.isToday
                    ? (colorScheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100')
                    : (colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white');
              let border = day.active
                ? 'border-2 border-blue-400'
                : isAvailable
                  ? 'border border-blue-400'
                  : '';
              let textColor = day.disabled
                ? (colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400')
                : day.active
                  ? 'text-white font-bold'
                  : day.isToday
                    ? (colorScheme === 'dark' ? 'text-blue-200 font-bold' : 'text-blue-700 font-bold')
                    : (colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800');
              return (
                <TouchableOpacity
                  key={colIdx}
                  className={`w-[14.28%] h-12 items-center justify-center m-[1px] rounded-lg ${bgColor} ${border} ${day.active ? 'shadow-lg' : ''}`}
                  onPress={() => !day.disabled && handleSelectDate(day.dateStr)}
                  disabled={day.disabled}
                  style={{ opacity: day.disabled ? 0.4 : 1 }}
                >
                  <Text className={`text-sm ${textColor}`}>{day.day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
