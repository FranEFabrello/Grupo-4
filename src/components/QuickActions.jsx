import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function QuickActions({ actions, navigation, style = 'flex-row flex-wrap justify-between', itemStyle = 'w-[48%]' }) {
  return (
    <View className={`${style} mt-4`}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`${itemStyle} bg-white rounded-lg p-4 mb-3 shadow-md items-center`}
          onPress={() => action.screen && navigation.navigate(action.screen)}
        >
          <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mb-2">
            <Icon name={action.icon} size={18} color="#4a6fa5" />
          </View>
          <Text className="text-sm font-medium text-gray-800">{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}