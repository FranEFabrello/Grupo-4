import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppFooter({ navigation }) {
  const insets = useSafeAreaInsets();

  const navItems = [
    { name: 'Home', icon: 'home', label: 'Inicio' },
    { name: 'Appointments', icon: 'calendar-alt', label: 'Turnos' },
    { name: 'Professionals', icon: 'user-md', label: 'Profesionales' },
    { name: 'Profile', icon: 'user', label: 'Perfil' },
  ];

  return (
    <View
      className="flex-row justify-around p-3 bg-white shadow-md"
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          className="flex-col items-center"
          onPress={() => navigation.navigate(item.name)}
        >
          <Icon name={item.icon} size={20} color="#6c757d" />
          <Text className="text-xs text-gray-600">{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}