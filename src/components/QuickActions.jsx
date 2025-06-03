import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function QuickActions({
                                       actions,
                                       navigation,
                                       style = 'flex-row flex-wrap justify-between',
                                       itemStyle = 'w-[48%]',
                                       colorScheme, // Prop pasada desde HomeScreen
                                     }) {
  // Definir clases condicionales basadas en colorScheme
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const iconBgClass = colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900';
  const iconColor = colorScheme === 'light' ? '#4a6fa5' : '#93c5fd'; // Ajustamos para modo oscuro
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';

  return (
    <View className={`${style} mt-4`}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`${itemStyle} ${cardBgClass} rounded-lg p-4 mb-3 shadow-md items-center`}
          onPress={() => action.screen && navigation.navigate(action.screen)}
        >
          <View className={`w-10 h-10 ${iconBgClass} rounded-full justify-center items-center mb-2`}>
            <Icon name={action.icon} size={18} color={iconColor} />
          </View>
          <Text className={`text-sm font-medium text-center mt-2 ${textClass}`}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}