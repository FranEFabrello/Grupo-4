import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProfileField from './ProfileField';

export default function MedicalNote({ doctor, date, reason, diagnosis, notes, prescription, onDownload }) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-md">
      <View className="flex-row items-center mb-4">
        <View className="w-16 h-16 bg-gray-200 rounded-full justify-center items-center mr-3">
          <Icon name="user-md" size={24} color="#4a6fa5" />
        </View>
        <View>
          <Text className="text-lg font-semibold text-gray-800">{doctor}</Text>
          <Text className="text-sm text-gray-600">{date}</Text>
        </View>
      </View>
      <ProfileField label="Motivo de consulta" value={reason} />
      <ProfileField label="Diagnóstico" value={diagnosis} />
      <ProfileField label="Notas médicas" value={notes} />
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-800 mb-1">Receta médica</Text>
        <View className="flex-row justify-between items-center bg-gray-100 rounded-lg p-3">
          <View className="flex-row items-center">
            <Icon name="file-prescription" size={14} color="#6c757d" />
            <Text className="text-sm text-gray-600 ml-2">{prescription}</Text>
          </View>
          <TouchableOpacity className="border border-blue-600 rounded-lg px-2 py-1" onPress={onDownload}>
            <Icon name="download" size={14} color="#4a6fa5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}