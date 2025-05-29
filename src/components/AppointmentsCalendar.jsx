import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function AppointmentsCalendar({ selectedDate, endDate, onSelectDate }) {
  const { t, i18n } = useTranslation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const normalizedFirstDay = (firstDayOfMonth + 6) % 7; // para que lunes sea el inicio (0 = lunes)

  const days = [
    { day: t('appointments.calendar.days.mon'), isHeader: true },
    { day: t('appointments.calendar.days.tue'), isHeader: true },
    { day: t('appointments.calendar.days.wed'), isHeader: true },
    { day: t('appointments.calendar.days.thu'), isHeader: true },
    { day: t('appointments.calendar.days.fri'), isHeader: true },
    { day: t('appointments.calendar.days.sat'), isHeader: true },
    { day: t('appointments.calendar.days.sun'), isHeader: true },
    ...Array.from({ length: normalizedFirstDay }, () => ({ day: '', disabled: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const dateObj = new Date(currentYear, currentMonth, i + 1);
      const isSelected =
        selectedDate &&
        dateObj.toDateString() === new Date(selectedDate).toDateString();
      const isInRange =
        selectedDate &&
        endDate &&
        dateObj >= new Date(selectedDate) &&
        dateObj <= new Date(endDate);
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
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text className="text-blue-600">{t('appointments.calendar.prev')}</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold capitalize">
          {new Date(currentYear, currentMonth).toLocaleDateString(i18n.language, {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text className="text-blue-600">{t('appointments.calendar.next')}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day, index) => {
          const bgColor = day.isHeader
            ? 'bg-gray-200'
            : day.disabled
              ? 'bg-gray-100'
              : day.active
                ? 'bg-blue-600'
                : day.inRange
                  ? 'bg-blue-100'
                  : 'bg-white';

          const textColor = day.isHeader
            ? 'text-gray-600'
            : day.disabled
              ? 'text-gray-400'
              : day.active
                ? 'text-white'
                : 'text-gray-800';

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
