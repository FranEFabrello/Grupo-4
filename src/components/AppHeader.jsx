import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useColorScheme } from 'react-native';

export default function AppHeader({ navigation, screenTitle }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const headerClass = colorScheme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-gray-800 border-b border-gray-700';
  const titleColorClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const iconColor = colorScheme === 'light' ? '#6c757d' : '#a0a0a0';

  return (
    <View
      className={`flex-row justify-between items-center p-4 ${headerClass}`}
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-row items-center">
        <View className="w-6 h-6 bg-blue-600 rounded-md justify-center items-center">
          <Text className="text-white text-xs font-bold">MB</Text>
        </View>
        <Text className={`ml-2 text-lg font-semibold ${titleColorClass}`}>{screenTitle}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="p-1">
          <Icon name="bell" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}