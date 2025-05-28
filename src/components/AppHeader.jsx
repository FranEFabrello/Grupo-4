import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppHeader({ navigation, screenTitle }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200"
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-row items-center">
        <View className="w-6 h-6 bg-blue-600 rounded-md justify-center items-center">
          <Text className="text-white text-xs font-bold">MB</Text>
        </View>
        <Text className="ml-2 text-lg font-semibold text-blue-600">{screenTitle}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell" size={20} color="#6c757d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}