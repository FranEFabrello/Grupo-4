import React, { useContext, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useSelector } from "react-redux";
import { actualizarConfiguraciones } from "~/store/slices/userSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';


export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState('light');
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');
  const user = useSelector(state => state.user.usuario);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const lang = await AsyncStorage.getItem('language');
      if (user && user.idioma) {
        setSelectedLanguage(user.idioma);
      } else if (lang) {
        setSelectedLanguage(lang);
      }
    })();
  }, [user]);

  // Cargar configuraciones guardadas al iniciar
  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      const lang = await AsyncStorage.getItem('language');
      if (theme) setSelectedTheme(theme);
      if (lang) setSelectedLanguage(lang);
    })();
  }, []);

  // Guardar configuraciones cuando cambian
  const saveSettings = async () => {
    await AsyncStorage.setItem('theme', selectedTheme);
    await AsyncStorage.setItem('language', selectedLanguage);
    setShowSettingsModal(false);
  };

  const moreActions = [
    { icon: 'user-cog', label: t('profile.menu.edit'), screen: 'UserProfile' },
    { icon: 'hospital-user', label: t('profile.menu.insurance'), screen: 'Insurance' },
    { icon: 'file-medical', label: t('profile.menu.results'), screen: 'Results' },
    { icon: 'question-circle', label: t('profile.menu.help'), screen: 'Help' },
    { icon: 'shield-alt', label: t('profile.menu.privacy'), screen: 'SecurityPolicy' },
  ];

  return (
    <AppContainer navigation={navigation} screenTitle={t('profile.title')}>
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
            <Text className="text-sm text-blue-700 font-medium">{t('profile.view_profile')}</Text>
          </View>
        </Pressable>

        {/* Acciones rápidas */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">{t('profile.options_title')}</Text>
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
            <Text className="text-base font-medium text-gray-800">{t('profile.menu.settings.title')}</Text>
          </TouchableOpacity>
        </View>

        {/* Acerca de la app */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-base font-semibold text-gray-800 mb-2">{t('profile.about_title')}</Text>
          <Text className="text-sm text-gray-600 mb-2">{t('profile.about_version')}</Text>
          <Text className="text-sm text-gray-600">{t('profile.about')}</Text>
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>{t('profile.menu.settings.title')}</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('profile.menu.settings.theme')}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedTheme === 'light' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10,
                }}
                onPress={() => {
                  setSelectedTheme('light');
                  AsyncStorage.setItem('theme', 'light');
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { modoOscuro: false } }));
                    dispatch({ type: 'user/setModoOscuro', payload: false });
                  }
                  console.log('Tema cambiado a: light');
                }}
              >
                <Text style={{ color: selectedTheme === 'light' ? '#fff' : '#2563EB' }}>{t('profile.menu.settings.theme_light')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedTheme === 'dark' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                }}
                onPress={() => {
                  setSelectedTheme('dark');
                  AsyncStorage.setItem('theme', 'dark');
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { modoOscuro: true } }));
                    dispatch({ type: 'user/setModoOscuro', payload: true });
                  }
                  console.log('Tema cambiado a: dark');
                }}
              >
                <Text style={{ color: selectedTheme === 'dark' ? '#fff' : '#2563EB' }}>{t('profile.menu.settings.theme_dark')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{t('profile.menu.settings.language')}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'es' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10,
                }}
                onPress={() => {
                  setSelectedLanguage('es');
                  AsyncStorage.setItem('language', 'es');
                  import('../i18n').then(({ default: i18n }) => {
                    i18n.changeLanguage('es');
                  });
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { idioma: 'es' } }));
                  }
                }}
              >
                <Text style={{ color: selectedLanguage === 'es' ? '#fff' : '#2563EB' }}>{t('profile.menu.settings.language_es')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'en' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                }}
                onPress={() => {
                  setSelectedLanguage('en');
                  AsyncStorage.setItem('language', 'en');
                  import('../i18n').then(({ default: i18n }) => {
                    i18n.changeLanguage('en');
                  });
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { idioma: 'en' } }));
                  }
                }}
              >
                <Text style={{ color: selectedLanguage === 'en' ? '#fff' : '#2563EB' }}>{t('profile.menu.settings.language_en')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#2563EB',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={saveSettings}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('profile.menu.settings.save_button')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </AppContainer>
  );
}