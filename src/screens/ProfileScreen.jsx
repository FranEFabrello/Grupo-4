import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Animated, TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
// import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState('light');
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');
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
    { icon: 'shield-alt', label: 'Privacidad', screen: 'SecurityPolicy' },
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
          <TouchableOpacity
            className="w-full bg-white rounded-lg p-4 mb-3 shadow-md items-center"
            onPress={() => setShowSettingsModal(true)}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mb-2">
              <Icon name="cog" size={18} color="#4a6fa5" />
            </View>
            <Text className="text-base font-medium text-gray-800">Configuración</Text>
          </TouchableOpacity>
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

      {/* Modal de configuración como una opción más */}
      {showSettingsModal && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
          onPress={() => setShowSettingsModal(false)}
        >
          <Animated.View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 24,
              width: '85%',
              elevation: 5,
              transform: [
                {
                  translateY: showSettingsModal
                    ? 0
                    : 400, // Aparece desde abajo
                },
              ],
              opacity: showSettingsModal ? 1 : 0,
            }}
            entering={Animated.spring}
            exiting={Animated.timing}
            onStartShouldSetResponder={() => true}
            onResponderStart={e => e.stopPropagation()}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Configuración</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Tema</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedTheme === 'light' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10,
                }}
                onPress={() => setSelectedTheme('light')}
              >
                <Text style={{ color: selectedTheme === 'light' ? '#fff' : '#2563EB' }}>Claro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedTheme === 'dark' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                }}
                onPress={() => setSelectedTheme('dark')}
              >
                <Text style={{ color: selectedTheme === 'dark' ? '#fff' : '#2563EB' }}>Oscuro</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Idioma</Text>
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'es' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10,
                }}
                onPress={() => setSelectedLanguage('es')}
              >
                <Text style={{ color: selectedLanguage === 'es' ? '#fff' : '#2563EB' }}>Español</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'en' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                }}
                onPress={() => setSelectedLanguage('en')}
              >
                <Text style={{ color: selectedLanguage === 'en' ? '#fff' : '#2563EB' }}>Inglés</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#2563EB',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </AppContainer>
  );
}
