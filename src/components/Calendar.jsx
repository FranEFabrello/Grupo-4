import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import '~/i18n'; // Import your i18n configuration
import { useAppTheme } from "~/providers/ThemeProvider"; // ajustá si la ruta es distinta

export default function Calendar({ availableDays = [], onSelectDate, selectedDate, colorScheme: propColorScheme, isLoading }) {
  const { useColorScheme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const colorScheme = propColorScheme || useColorScheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = domingo
  const normalizedFirstDay = firstDayOfMonth; // Ya empieza en domingo, no necesita ajuste

  // Clases base según el tema, siguiendo el estilo de AppointmentsCalendar.jsx
  const bgBase = colorScheme === 'dark' ? 'bg-darkBackground' : 'bg-lightBackground';
  const textBase = colorScheme === 'dark' ? 'text-darkText' : 'text-lightText';
  const headerBg = colorScheme === 'dark' ? 'bg-darkCard' : 'bg-gray-200';
  const disabledBg = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const activeBg = colorScheme === 'dark' ? 'bg-blue-700' : 'bg-blue-600';
  const linkColor = colorScheme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const weekDays = [
    { day: t('filter.calendar.days.sun'), isHeader: true },
    { day: t('filter.calendar.days.mon'), isHeader: true },
    { day: t('filter.calendar.days.tue'), isHeader: true },
    { day: t('filter.calendar.days.wed'), isHeader: true },
    { day: t('filter.calendar.days.thu'), isHeader: true },
    { day: t('filter.calendar.days.fri'), isHeader: true },
    { day: t('filter.calendar.days.sat'), isHeader: true },
  ];

  // Cálculo del padding inicial
  const paddingDays = normalizedFirstDay;

  // Creamos las celdas de los días
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
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
  });

  // Calculamos el total de celdas (padding inicial + días del mes)
  const totalCells = paddingDays + daysInMonth;
  // Calculamos cuántas celdas vacías necesitamos al final para completar la última fila
  const paddingEnd = (7 - (totalCells % 7)) % 7;

  // Combinamos todo: días de la semana, padding inicial, días y padding final
  const dayCells = [
    ...weekDays,
    ...Array.from({ length: paddingDays }, () => ({ day: '', disabled: true })),
    ...daysArray,
    ...Array.from({ length: paddingEnd }, () => ({ day: '', disabled: true })),
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

  return (
    <Animated.View style={{ opacity: fadeAnim }} className={`mb-4 ${bgBase} rounded-lg p-4 shadow-md border ${borderColor}`}>
      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563eb' : '#60a5fa'} />
          <Text className={`text-base ${textBase}`}>
            {t('filter.calendar.loading')}
          </Text>
        </View>
      ) : (
        <>
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
            {dayCells.map((day, index) => {
              const bgColor = day.isHeader
                ? headerBg
                : day.disabled
                  ? disabledBg
                  : day.active
                    ? activeBg
                    : day.isToday
                      ? colorScheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                      : bgBase;

              const textColor = day.isHeader
                ? colorScheme === 'dark' ? 'text-blue-700' : 'text-gray-600'
                : day.disabled
                  ? colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  : day.active
                    ? 'text-white'
                    : textBase;

              return (
                <TouchableOpacity
                  key={index}
                  className={`w-[14.28%] h-12 items-center justify-center rounded-lg ${bgColor}`}
                  onPress={() => !day.disabled && !day.isHeader && handleSelectDate(day.dateStr)}
                  disabled={day.disabled || day.isHeader}
                >
                  <Text className={`text-sm font-medium ${textColor}`}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </Animated.View>
  );
}