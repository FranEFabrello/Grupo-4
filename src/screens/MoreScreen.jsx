import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';

export default function MoreScreen({ navigation }) {
  const moreActions = [
    { icon: 'hospital-user', label: 'Obra social', screen: 'Insurance' },
    { icon: 'file-medical', label: 'Resultados médicos', screen: 'Results' },
    { icon: 'question-circle', label: 'Ayuda', screen: '' },
    { icon: 'shield-alt', label: 'Privacidad', screen: '' },
    { icon: 'cog', label: 'Configuración', screen: 'Profile' },
  ];

  return (
    <AppContainer navigation={navigation} screenTitle="Más Opciones">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Más opciones</Text>
          <QuickActions
            actions={moreActions}
            navigation={navigation}
            style="flex-col"
            itemStyle="w-full"
          />
        </View>
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-base font-semibold text-gray-800 mb-2">Acerca de MediBook</Text>
          <Text className="text-sm text-gray-600 mb-2">Versión 1.0.0</Text>
          <Text className="text-sm text-gray-600">
            MediBook es una aplicación para la gestión de turnos médicos, diseñada para hacer más fácil el
            acceso a servicios de salud.
          </Text>
        </View>
      </ScrollView>
    </AppContainer>
  );
}