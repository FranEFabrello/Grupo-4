import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRoute } from '@react-navigation/native';

export default function AppFooter({ navigation, colorScheme }) {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  
  // Clases para modo oscuro/claro
  const bgClass = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textInactiveClass = colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const textActiveClass = colorScheme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const borderClass = colorScheme === 'dark' ? 'border-t border-t-2 border-blue-800' : 'border-t border-t-2 border-blue-500';

  const navItems = [
    { name: 'Home', icon: 'home', label: 'Inicio' },
    { name: 'Appointments', icon: 'calendar-alt', label: 'Turnos' },
    { name: 'Professionals', icon: 'user-md', label: 'Profesionales' },
    { name: 'Profile', icon: 'user', label: 'Perfil' },
  ];

  return (
    <View
      className={`flex-row justify-around p-3 ${bgClass} ${borderClass} shadow-t-2 rounded-t-lg`}
      style={{ paddingBottom: insets.bottom + 10 }}
    >
      {navItems.map((item) => {
        const isActive = route.name === item.name;
        const iconColor = isActive 
          ? (colorScheme === 'dark' ? '#60a5fa' : '#2563eb')
          : (colorScheme === 'dark' ? '#9ca3af' : '#6c757d');
        
        return (
          <TouchableOpacity
            key={item.name}
            className="flex-col items-center"
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon 
              name={item.icon} 
              size={20} 
              color={iconColor}
            />
            <Text 
              className={`text-xs ${isActive ? textActiveClass : textInactiveClass}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}