import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppointmentCard({
  day,
  time,
  doctor,
  specialty,
  onCancel,
  onConfirm,
  status,
  bgColor = 'bg-blue-100',
  colorScheme,
  showActions = false, // nuevo prop para mostrar botones
}) {
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const dateBgClass = colorScheme === 'light' ? bgColor : 'bg-blue-900';
  const dateTextClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-300';
  const doctorTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cancelButtonClass = colorScheme === 'light' ? 'bg-red-600' : 'bg-red-700';
  //const confirmButtonClass = colorScheme === 'light' ? 'border-green-600' : 'border-green-500';
  //const confirmTextClass = colorScheme === 'light' ? 'text-green-600' : 'text-green-500';
  //const confirmIconColor = colorScheme === 'light' ? '#16a34a' : '#22c55e';

  return (
    <View className={`rounded-lg p-4 shadow-md ${cardBgClass} ${cardBgClass}`}>
      <View className="flex-row items-center h-full">
        <View className={`w-20 ${dateBgClass} rounded-lg p-2 items-center`}>
          <Text className={`text-xs ${dateTextClass}`}>{day}</Text>
          <Text className={`text-sm font-semibold ${dateTextClass}`}>{time}</Text>
        </View>
        <View className="ml-3 flex-1 justify-center">
          <Text className={`text-base font-semibold ${doctorTextClass}`}>{doctor}</Text>
          <Text className={`text-sm ${specialtyTextClass}`}>{specialty}</Text>
          {showActions && onCancel && (
            <TouchableOpacity
              className={`${cancelButtonClass} rounded-lg p-2 flex-row justify-center items-center mt-3`}
              onPress={onCancel}
            >
              <Icon name="times" size={14} color="white" />
              <Text className="text-white text-sm ml-2">Cancelar turno</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}