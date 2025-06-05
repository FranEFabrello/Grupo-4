import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

export default function FilterButton({ onPress, className, textClassName, iconColor }) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      className={`rounded-full px-4 py-2.5 flex-row items-center ${className}`}
      onPress={onPress}
    >
      <Icon name="filter" size={16} color={iconColor} className="mr-1.5" />
      <Text className={`text-sm ${textClassName}`}>{t('filter.title')}</Text>
    </TouchableOpacity>
  );
}