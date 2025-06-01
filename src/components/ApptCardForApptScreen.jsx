import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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

  return (
    <TouchableOpacity onPress={onPress} className="w-full">
      <View className={`rounded-lg p-4 shadow-md ${cardBgClass} w-full`}>
        <View className="flex-row items-center">
          <View className={`w-20 ${dateBgClass} rounded-lg p-2 items-center`}>
            <Text className={`text-xs ${dateTextClass}`}>{day}</Text>
            <Text className={`text-sm font-semibold ${dateTextClass}`}>{time}</Text>
          </View>
          <View className="ml-3 flex-1 justify-center">
            <Text className={`text-base font-semibold ${doctorTextClass}`}>{doctor}</Text>
            <Text className={`text-sm ${specialtyTextClass}`}>{specialty}</Text>
            {status && (
              <Text className={`text-xs ${specialtyTextClass}`}>
                Estado: {status}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}