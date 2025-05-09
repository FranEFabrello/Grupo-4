import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppointmentCard({
  day,
  time,
  doctor,
  specialty,
  location,
  onCancel,
  icon = 'map-marker-alt',
  iconColor = '#6c757d',
  bgColor = 'bg-blue-100',
}) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row items-center">
        <View className={`w-20 ${bgColor} rounded-lg p-2 items-center`}>
          <Text className="text-xs text-blue-600">{day}</Text>
          <Text className="text-sm font-semibold text-blue-600">{time}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-800">{doctor}</Text>
          <Text className="text-sm text-gray-600">{specialty}</Text>
          <View className="flex-row items-center mt-1">
            <Icon name={icon} size={12} color={iconColor} />
            <Text className="text-xs text-gray-600 ml-1">{location}</Text>
          </View>
        </View>
      </View>
      {onCancel && (
        <TouchableOpacity
          className="bg-red-500 rounded-lg p-2 mt-3 flex-row justify-center items-center"
          onPress={onCancel}
        >
          <Icon name="times" size={14} color="white" />
          <Text className="text-white text-sm ml-2">Cancelar turno</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}