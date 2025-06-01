import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

export default function AppointmentsCalendar({ selectedDate, endDate, onSelectDate }) {
  const colorScheme = useColorScheme();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const { t,i18n } = useTranslation();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const normalizedFirstDay = (firstDayOfMonth + 6) % 7;

  // Clases base según el tema
  const bgBase = colorScheme === 'dark' ? 'bg-darkBackground' : 'bg-lightBackground';
  const textBase = colorScheme === 'dark' ? 'text-darkText' : 'text-lightText';
  const headerBg = colorScheme === 'dark' ? 'bg-darkCard' : 'bg-gray-200';
  const disabledBg = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const activeBg = colorScheme === 'dark' ? 'bg-blue-700' : 'bg-blue-600';
  const rangeBg = colorScheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100';
  const linkColor = colorScheme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const days = [
    { day: t('filter.calendar.days.mon'), isHeader: true },
    { day: t('filter.calendar.days.tue'), isHeader: true },
    { day: t('filter.calendar.days.wed'), isHeader: true },
    { day: t('filter.calendar.days.thu'), isHeader: true },
    { day: t('filter.calendar.days.fri'), isHeader: true },
    { day: t('filter.calendar.days.sat'), isHeader: true },
    { day: t('filter.calendar.days.sun'), isHeader: true },
    ...Array.from({ length: normalizedFirstDay }, () => ({ day: '', disabled: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const dateObj = new Date(currentYear, currentMonth, i + 1);
      const isSelected = selectedDate && dateObj.toDateString() === new Date(selectedDate).toDateString();
      const isInRange = selectedDate && endDate && dateObj >= new Date(selectedDate) && dateObj <= new Date(endDate);
      return {
        day: String(i + 1),
        disabled: false,
        active: isSelected,
        inRange: isInRange,
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
    <View className={`mb-4 ${bgBase} rounded-lg p-4 shadow-md border ${borderColor}`}>
      <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text className={linkColor}>{t('filter.calendar.prev')}</Text>
        </TouchableOpacity>
        <Text className={`text-base font-semibold capitalize ${textBase}`}>
          {new Date(currentYear, currentMonth).toLocaleDateString(i18n.language, {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text className={linkColor}>{t('filter.calendar.next')}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day, index) => {
          const bgColor = day.isHeader
            ? headerBg
            : day.disabled
              ? disabledBg
              : day.active
                ? activeBg
                : day.inRange
                  ? rangeBg
                  : bgBase;

          const textColor = day.isHeader
            ? colorScheme === 'dark' ? 'text-blue-700' : 'text-gray-600' // Cambiado de text-red-300 a text-blue-700
            : day.disabled
              ? colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400' // Cambiado de text-blue-600 a text-gray-500
              : day.active
                ? 'text-white'
                : textBase;

          return (
            <TouchableOpacity
              key={index}
              className={`w-[14.28%] h-12 items-center justify-center rounded-lg ${bgColor}`}
              onPress={() =>
                !day.disabled &&
                !day.isHeader &&
                onSelectDate(new Date(currentYear, currentMonth, Number(day.day)))
              }
              disabled={day.disabled || day.isHeader}
            >
              <Text className={`text-sm font-medium ${textColor}`}>
                {day.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}