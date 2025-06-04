import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";

export default function AppointmentCardFullWidth({
                                                   day,
                                                   time,
                                                   doctor,
                                                   specialty,
                                                   status,
                                                   onPress,
                                                   bgColor = 'bg-blue-100',
                                                   colorScheme,
                                                 }) {
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const dateBgClass = colorScheme === 'light' ? bgColor : 'bg-blue-900';
  const dateTextClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-300';
  const doctorTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const textAccentClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} className="w-full">
      <View className={`rounded-lg p-4 shadow-md ${cardBgClass} w-[320px]`}>
        <View className="flex-row items-center">
          <View className={`${dateBgClass} rounded-lg items-center justify-center`} style={{ width: 90, height: 70 }}>
            <Text className={`text-xs ${dateTextClass}`}>{day}</Text>
            <Text className={`text-sm font-semibold mt-1 ${dateTextClass}`}>{time}</Text>
          </View>
          <View className="ml-3 flex-1 justify-center">
            <Text className={`text-base font-semibold ${doctorTextClass}`}>{doctor}</Text>
            <Text className={`text-sm ${specialtyTextClass}`}>{specialty}</Text>
            <Text className={`text-sm ${textAccentClass}`}>
              {t('appointments.view_medical_notes')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}