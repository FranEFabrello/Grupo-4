import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function DoctorCard({ name, specialty, onBook }) {
  return (
    <View className="w-36 bg-white rounded-lg p-3 mr-3 shadow-md items-center">
      <View className="w-16 h-16 bg-gray-200 rounded-full justify-center items-center mb-2">
        <Icon name="user-md" size={24} color="#4a6fa5" />
      </View>
      <Text className="text-sm font-semibold text-gray-800">{name}</Text>
      <Text className="text-xs text-gray-600">{specialty}</Text>
      <TouchableOpacity
        className="border border-blue-600 rounded-lg p-2 mt-2 w-full flex-row justify-center"
        onPress={onBook}
      >
        <Icon name="calendar-alt" size={14} color="#4a6fa5" />
        <Text className="text-blue-600 text-xs ml-1">Turno</Text>
      </TouchableOpacity>
    </View>
  );
}