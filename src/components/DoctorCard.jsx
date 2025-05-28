import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

export default function DoctorCard({ name, specialty, stars, noRating, onBook }) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-lg p-3 shadow-md items-center w-full">
      <View className="w-16 h-16 bg-gray-200 rounded-full justify-center items-center mb-2">
        <Icon name="user-md" size={24} color="#4a6fa5" />
      </View>
      <Text className="text-sm font-semibold text-gray-800">{name}</Text>
      <Text className="text-xs text-gray-600">{specialty}</Text>
      <View className="flex-row items-center my-1">
        {noRating ? (
          <Text className="text-xs text-gray-400"> {t('doctor_card.no_rating')}</Text>
        ) : (
          <>
            <Text className="text-xs text-yellow-500 mr-1">{stars}</Text>
            <Text className="text-xs text-yellow-500">★</Text>
          </>
        )}
      </View>
      <TouchableOpacity
        className="border border-blue-600 rounded-lg p-2 mt-2 w-full flex-row justify-center"
        onPress={onBook}
      >
        <Icon name="calendar-alt" size={14} color="#4a6fa5" />
        <Text className="text-blue-600 text-xs ml-1"> {t('doctor_card.book')}</Text>
      </TouchableOpacity>
    </View>
  );
}