import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets, useColorScheme } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppFooter({ navigation }) {
  const insets = useSafeAreaInsets();

  const navItems = [
    { name: 'Home', icon: 'home', label: 'Inicio' },
    { name: 'Appointments', icon: 'calendar-alt', label: 'Turnos' },
    { name: 'Professionals', icon: 'user-md', label: 'Profesionales' },
    { name: 'Profile', icon: 'user', label: 'Perfil' },
  ];

  const colorScheme = useColorScheme();
  const footerClass = colorScheme === 'light' ? 'bg-white shadow-md' : 'bg-gray-800 shadow-md';
  const iconColor = colorScheme === 'light' ? '#6c757d' : '#d1d5db'; // Adjust color as needed
  const textClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <View
      className={`flex-row justify-around p-3 ${footerClass}`}
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          className="flex-col items-center"
          onPress={() => navigation.navigate(item.name)}>
          <Icon name={item.icon} size={20} color={iconColor} />
          <Text className={`text-xs ${textClass}`}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}