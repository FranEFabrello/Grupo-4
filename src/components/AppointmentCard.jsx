import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";

export default function AppointmentCard({
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
  const { t,i18n} = useTranslation();
  const dateTextClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-300';
  const doctorTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <TouchableOpacity onPress={onPress} className="self-start">
      <View className={`rounded-lg p-4 shadow-md ${cardBgClass} flex-row items-center`}>
        <View
          className={`${dateBgClass} rounded-lg items-center justify-center px-3 py-2`}
          style={{ minHeight: 70, alignSelf: 'flex-start' }}
        >
          <Text className={`text-xs ${dateTextClass}`}>{day}</Text>
          <Text className={`text-sm font-semibold mt-1 ${dateTextClass}`}>{time}</Text>
        </View>
        <View className="ml-3 justify-center">
          <Text className={`text-base font-semibold ${doctorTextClass}`} numberOfLines={1}>
            {doctor}
          </Text>
          <Text className={`text-sm ${specialtyTextClass}`}>{specialty}</Text>
        </View>

      </View>
    </TouchableOpacity>

  );
}