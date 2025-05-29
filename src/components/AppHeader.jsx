import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppHeader({ navigation, screenTitle, colorScheme }) {
  const insets = useSafeAreaInsets();
  const bgClass = colorScheme === 'dark' ? 'bg-gray-700' : 'bg-lightBackground';
  const borderClass = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textClass = colorScheme === 'dark' ? 'text-darkText' : 'text-lightText';

  return (
    <View
      className={`flex-row justify-between items-center p-4 ${bgClass} border-b ${borderClass}`}
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-row items-center">
        <View className="w-6 h-6 bg-blue-600 rounded-md justify-center items-center">
          <Text className="text-white text-xs font-bold">MB</Text>
        </View>
        <Text className={`ml-2 text-lg font-semibold ${textClass}`}>{screenTitle}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={20} color={colorScheme === 'dark' ? '#d1d5db' : '#6c757d'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}