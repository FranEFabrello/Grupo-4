import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

export default function DoctorCard({
                                     name,
                                     specialty,
                                     onBook,
                                     onPress,
                                     containerClassName = 'w-full',
                                     colorScheme,
                                     imageUrl,
                                   }) {
  const cardBgClass = colorScheme === 'light' ? 'bg-white shadow-lg shadow-gray-300' : 'bg-gray-800 shadow-lg shadow-black/40';
  const iconBgClass = colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900';
  const iconColor = colorScheme === 'light' ? '#4a6fa5' : '#93c5fd';
  const nameTextClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const specialtyTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const buttonBgClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const borderClass = colorScheme === 'light' ? 'border border-blue-400 shadow-md' : 'border border-blue-500 shadow-md';
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className={containerClassName}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View
        className={`${cardBgClass} rounded-lg p-4 shadow-md flex-row items-start justify-start m-0 relative`}
        style={{ elevation: 5 }}
      >
        {/* Foto con borde y brillo */}
        <View className="justify-center items-center mr-4">
          <View
            className={
              colorScheme === 'light'
                ? "rounded-full border-4 border-blue-300 shadow-lg"
                : "rounded-full border-4 border-blue-500 shadow-lg"
            }
            style={{
              shadowColor: colorScheme === 'light' ? '#60a5fa' : '#3b82f6',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className={`w-20 h-20 ${iconBgClass} rounded-full justify-center items-center`}>
                <Icon name="user-md" size={32} color={iconColor} />
              </View>
            )}
          </View>
        </View>
        {/* Contenido */}
        <View className="flex-1 justify-center">
          <Text className={`text-base font-semibold ${nameTextClass}`}>{name}</Text>
          <Text className={`text-sm ${specialtyTextClass} mt-1`}>{specialty}</Text>
          <TouchableOpacity
            className={`${buttonBgClass} rounded-lg py-2 px-2 w-28 flex-row justify-center items-center ${borderClass} mt-3`}
            onPress={onBook}
          >
            <Icon name="calendar-alt" size={14} color="#ffffff" />
            <Text className="text-white text-xs ml-1">{t('doctor_card.book')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
