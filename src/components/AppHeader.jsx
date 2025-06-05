import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppHeader({ navigation, screenTitle, colorScheme }) {
  const insets = useSafeAreaInsets();
  const bgClass = colorScheme === 'dark' ? 'bg-gray-700' : 'bg-lightBackground';
  const borderClass = colorScheme === 'dark' ? 'border-blue-700' : 'border-blue-600';
  const textClass = colorScheme === 'dark' ? 'text-darkText' : 'text-lightText';

  // Detectar si estamos en Home
  // Considera tanto "Home" como "MediBook" como posibles títulos de Home
  const isHome = screenTitle === 'Home' || screenTitle === 'MediBook';

  return (
    <View
      className={`flex-row justify-between items-center p-4 ${bgClass} border-b-2 rounded-b-lg border-double ${borderClass} `}
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className={`flex-row items-center`}>
        {/* Botón de volver, solo si no es Home */}
        {!isHome && (
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
            <Icon name="arrow-left" size={20} color={colorScheme === 'dark' ? '#d1d5db' : '#6c757d'} />
          </TouchableOpacity>
        )}
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

