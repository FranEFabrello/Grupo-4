import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // const { user } = useContext(AuthContext);
  const user = {
    name: 'Usuario',
    email: 'correo@ejemplo.com',
  };

  const moreActions = [
    { icon: 'user-cog', label: 'Editar perfil', screen: 'UserProfile' },
    { icon: 'hospital-user', label: 'Obra social', screen: 'Insurance' },
    { icon: 'file-medical', label: 'Resultados médicos', screen: 'Results' },
    { icon: 'question-circle', label: 'Ayuda', screen: 'Help' },
    { icon: 'shield-alt', label: 'Privacidad', screen: '' },
  ];

  return (
    <AppContainer navigation={navigation} screenTitle="Perfil">
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Perfil editable */}
        <Pressable
          onPress={() => navigation.navigate('UserProfile')}
          className="flex-row justify-between items-center bg-white rounded-lg p-4 mb-4 shadow-md"
          android_ripple={{ color: '#e2e8f0' }}
        >
          <View className="flex-row items-center">
            <Icon name="user-circle" size={40} color="#4A5568" className="mr-4" />
            <View>
              <Text className="text-lg font-semibold text-gray-800">{user.name}</Text>
              <Text className="text-sm text-gray-500">{user.email}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-3">
            <Icon name="eye" size={16} color="#2563EB" />
            <Text className="text-sm text-blue-700 font-medium">Ver perfil</Text>
          </View>
        </Pressable>

        {/* Acciones rápidas */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Opciones</Text>
          <QuickActions
            actions={moreActions}
            navigation={navigation}
            style="flex-col"
            itemStyle="w-full"
          />
        </View>

        {/* Acerca de la app */}
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
