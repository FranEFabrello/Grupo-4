import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function DoctorCard({
                                     name,
                                     specialty,
                                     stars,
                                     noRating,
                                     onBook,
                                     containerClassName = 'w-full',
                                     colorScheme,
                                   }) {
  // Definir clases condicionales basadas en colorScheme
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'; // Fondo interno de la tarjeta
  const iconBgClass = colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900';
  const iconColor = colorScheme === 'light' ? '#4a6fa5' : '#93c5fd';
  const nameTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const noRatingTextClass = colorScheme === 'light' ? 'text-gray-400' : 'text-gray-500';
  const starsTextClass = colorScheme === 'light' ? 'text-yellow-500' : 'text-yellow-400';
  const buttonBgClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';

  return (
    <View className={`${containerClassName}`}>
      <View className={`${cardBgClass} rounded-lg p-4 shadow-md items-center`}>
        <View className={`w-10 h-10 ${iconBgClass} rounded-full justify-center items-center mb-2`}>
          <Icon name="user-md" size={18} color={iconColor} />
        </View>
        <Text className={`text-sm font-medium ${nameTextClass}`}>{name}</Text>
        <Text className={`text-xs ${specialtyTextClass}`}>{specialty}</Text>
        <View className="flex-row items-center my-1">
          {noRating ? (
            <Text className={`text-xs ${noRatingTextClass}`}>Sin calificación</Text>
          ) : (
            <>
              <Text className={`text-xs ${starsTextClass} mr-1`}>{stars}</Text>
              <Text className={`text-xs ${starsTextClass}`}>★</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          className={`${buttonBgClass} rounded-lg p-2 mt-2 w-full flex-row justify-center items-center`}
          onPress={onBook}
        >
          <Icon name="calendar-alt" size={14} color="#ffffff" />
          <Text className="text-white text-xs ml-1">Turno</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}