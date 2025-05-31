import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Calendar({ availableDays = [], onSelectDate, selectedDate, colorScheme: propColorScheme, isLoading }) {
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
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const normalizedFirstDay = (firstDayOfMonth + 6) % 7;

  const weekDays = [
    { day: t('filter.calendar.days.mon'), isHeader: true },
    { day: t('filter.calendar.days.tue'), isHeader: true },
    { day: t('filter.calendar.days.wed'), isHeader: true },
    { day: t('filter.calendar.days.thu'), isHeader: true },
    { day: t('filter.calendar.days.fri'), isHeader: true },
    { day: t('filter.calendar.days.sat'), isHeader: true },
    { day: t('filter.calendar.days.sun'), isHeader: true },
  ];

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

  const bgMain = colorScheme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white border border-gray-200 shadow-xl';
  const bgHeader = colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const textHeader = colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-600';
  const borderHeader = colorScheme === 'dark' ? 'border-gray-600' : 'border-gray-200';

  return (
    <Animated.View style={{ opacity: fadeAnim }} className={`rounded-2xl p-6 ${bgMain}`}>
      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563eb' : '#60a5fa'} />
          <Text className={`mt-4 text-base ${colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
            Cargando calendario...
          </Text>
        </View>
      ) : (
        <>
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={handlePrevMonth}
              className={`px-3 py-2 rounded-lg ${colorScheme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-blue-50'}`}
            >
              <Text className="text-blue-500 font-semibold">{t('filter.calendar.prev')}</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold capitalize ${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {new Date(currentYear, currentMonth).toLocaleDateString(i18n.language, {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity
              onPress={handleNextMonth}
              className={`px-3 py-2 rounded-lg ${colorScheme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-blue-50'}`}
            >
              <Text className="text-blue-500 font-semibold">{t('filter.calendar.next')}</Text>
            </TouchableOpacity>
          </View>
          <View className={`flex-row mb-3 rounded-lg overflow-hidden border ${borderHeader}`}>
            {weekDays.map((wd, i) => (
              <View key={i} className={`w-[14.28%] items-center py-2 ${bgHeader}`}>
                <Text className={`text-sm font-semibold ${textHeader}`}>{wd.day}</Text>
              </View>
            ))}
          </View>
          <View>
            {Array.from({ length: Math.ceil(dayCells.length / 7) }).map((_, rowIdx) => (
              <View key={rowIdx} className="flex-row">
                {dayCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                  if (!day) {
                    return <View key={colIdx} className="w-[14.28%] h-12" />;
                  }
                  let isAvailable = !day.disabled;
                  let bgColor = day.disabled
                    ? (colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')
                    : day.active
                      ? 'bg-blue-500'
                      : day.isToday
                        ? (colorScheme === 'dark' ? 'bg-blue-800' : 'bg-blue-50')
                        : (colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white');
                  let border = day.active
                    ? 'border-2 border-blue-400'
                    : isAvailable
                      ? 'border border-blue-300'
                      : '';
                  let textColor = day.disabled
                    ? (colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-400')
                    : day.active
                      ? 'text-white font-bold'
                      : day.isToday
                        ? (colorScheme === 'dark' ? 'text-blue-200 font-bold' : 'text-blue-600 font-bold')
                        : (colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-900');
                  return (
                    <TouchableOpacity
                      key={colIdx}
                      className={`w-[14.28%] h-12 items-center justify-center m-[2px] rounded-lg ${bgColor} ${border} ${day.active ? 'shadow-md' : ''}`}
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
        </>
      )}
    </Animated.View>
  );
}
