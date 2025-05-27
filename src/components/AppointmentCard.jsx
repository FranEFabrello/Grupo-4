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
                                          bgColor = 'bg-blue-100', // Color por defecto para modo claro
                                          colorScheme, // Prop pasada desde HomeScreen
                                        }) {
  // Definir clases condicionales basadas en colorScheme
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const dateBgClass = colorScheme === 'light' ? bgColor : 'bg-blue-900'; // Ajustamos bgColor para modo oscuro
  const dateTextClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-300';
  const doctorTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cancelButtonClass = colorScheme === 'light' ? 'bg-red-500' : 'bg-red-600';
  const confirmButtonClass = colorScheme === 'light' ? 'border-green-600' : 'border-green-500';
  const confirmTextClass = colorScheme === 'light' ? 'text-green-600' : 'text-green-500';
  const confirmIconColor = colorScheme === 'light' ? '#16a34a' : '#22c55e';

  return (
    <View className={`rounded-lg p-4 mb-4 shadow-md ${cardBgClass}`}>
      <View className="flex-row items-center">
        <View className={`w-20 ${dateBgClass} rounded-lg p-2 items-center`}>
          <Text className={`text-xs ${dateTextClass}`}>{day}</Text>
          <Text className={`text-sm font-semibold ${dateTextClass}`}>{time}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className={`text-base font-semibold ${doctorTextClass}`}>{doctor}</Text>
          <Text className={`text-sm ${specialtyTextClass}`}>{specialty}</Text>
        </View>
      </View>
      {onCancel && (
        <TouchableOpacity
          className={`${cancelButtonClass} rounded-lg p-2 mt-3 flex-row justify-center items-center`}
          onPress={onCancel}
        >
          <Icon name="times" size={14} color="white" />
          <Text className="text-white text-sm ml-2">Cancelar turno</Text>
        </TouchableOpacity>
      )}
      {status === 'PENDIENTE' && onConfirm && (
        <TouchableOpacity
          className={`border ${confirmButtonClass} rounded-lg p-2 mt-3 flex-row justify-center items-center`}
          onPress={onConfirm}
        >
          <Icon name="check" size={14} color={confirmIconColor} />
          <Text className={`text-sm ${confirmTextClass} ml-2`}>Confirmar turno</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}