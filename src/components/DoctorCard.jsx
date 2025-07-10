import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

export default function DoctorCard({
                                     name,
                                     specialty,
                                     onBook,
                                     onPress, // NUEVA PROP
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
  const translateSpecialty = (desc) => {
    return t(`especialitys.${desc}`, desc);
  };

  return (
    <TouchableOpacity
      className={containerClassName}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View
        className={`${cardBgClass} rounded-lg p-4 shadow-md items-center justify-center`}
        style={{ elevation: 5, minHeight: 180 }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-10 h-10 rounded-full mb-2"
            resizeMode="cover"
          />
        ) : (
          <View className={`w-10 h-10 ${iconBgClass} rounded-full justify-center items-center mb-2`}>
            <Icon name="user-md" size={18} color={iconColor} />
          </View>
        )}
        <Text className={`text-sm font-medium ${nameTextClass}`}>{name}</Text>
        <Text className={`text-xs ${specialtyTextClass}`}>{translateSpecialty(specialty)}</Text>

        <TouchableOpacity
          className={`${buttonBgClass} rounded-lg p-2 mt-2 w-full flex-row justify-center items-center ${borderClass}`}
          onPress={onBook}
        >
          <Icon name="calendar-alt" size={14} color="#ffffff" />
          <Text className="text-white text-xs ml-1">{t('doctor_card.book')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

