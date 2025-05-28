import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Animated, TouchableOpacity
} from "react-native";
import { useSafeAreaInsets, useColorScheme } from 'react-native-safe-area-context';
import AppContainer from '~/components/AppContainer';
import QuickActions from '../components/QuickActions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

import Modal from 'react-native-modal';
// import { AuthContext } from '../context/AuthContext';
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState('light');
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');
  const insets = useSafeAreaInsets();
  // const { user } = useContext(AuthContext);

  const { t } = useTranslation();

  const user = {
    name: 'Usuario',
    email: 'correo@ejemplo.com',
  };

  const moreActions = [
    { icon: 'user-cog', label: t('profile.menu.edit'), screen: 'UserProfile' },
    { icon: 'hospital-user', label: t('profile.menu.insurance'), screen: 'Insurance' },
    { icon: 'file-medical', label: t('profile.menu.results'), screen: 'Results' },
    { icon: 'question-circle', label: t('profile.menu.help'), screen: 'Help' },
    { icon: 'shield-alt', label: t('profile.menu.privacy'), screen: 'SecurityPolicy' },
  ];

  // Definir clases condicionales basadas en colorScheme
  const containerBgClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const linkTextClass = colorScheme === 'light' ? 'text-blue-700' : 'text-blue-400';

  return (
    <AppContainer navigation={navigation} screenTitle={t('profile.screen_title')}>
      <ScrollView
        className={`p-5 ${containerBgClass}`}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Perfil editable */}
        <Pressable
          onPress={() => navigation.navigate('UserProfile')}
          className={`flex-row justify-between items-center rounded-lg p-4 mb-4 shadow-md ${cardBgClass}`}
          android_ripple={{ color: '#e2e8f0' }}
        >
          <View className="flex-row items-center">
            <Icon name="user-circle" size={40} color={colorScheme === 'light' ? '#4A5568' : '#A0AEC0'} className="mr-4" />
            <View>
              <Text className={`text-lg font-semibold ${textClass}`}>{user.name}</Text>
              <Text className={`text-sm ${secondaryTextClass}`}>{user.email}</Text>
            </View>
          </View>
          <View className={`flex-row items-center gap-x-3 ${linkTextClass}`}>
            <Icon name="eye" size={16} color="#2563EB" />
            <Text className="text-sm text-blue-700 font-medium">{t('profile.view_profile')}</Text>
          </View>
        </Pressable>

        {/* Acciones rápidas */}
        <View className={`rounded-lg p-4 mb-4 shadow-md ${cardBgClass}`}>
          <Text className={`text-lg font-semibold mb-4 ${textClass}`}>{t('profile.options_title')}</Text>
          <QuickActions
            actions={moreActions}
            navigation={navigation}
            style="flex-col"
            itemStyle="w-full"
          />
          <TouchableOpacity
            className={`w-full rounded-lg p-4 mb-3 shadow-md items-center ${cardBgClass}`}
            onPress={() => setShowSettingsModal(true)}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mb-2">
              <Icon name="cog" size={18} color={colorScheme === 'light' ? '#4a6fa5' : '#90CDF4'} />
            </View>
            <Text className={`text-base font-medium ${textClass}`}>{t('profile.menu.settings.title')}</Text>
          </TouchableOpacity>
        </View>

        {/* Acerca de la app */}
        <View className={`rounded-lg p-4 shadow-md ${cardBgClass}`}>
          <Text className={`text-base font-semibold mb-2 ${textClass}`}>{t('profile.about_title')}</Text>
          <Text className={`text-sm mb-2 ${secondaryTextClass}`}>{t('profile.about_version')} 1.0.0</Text>
          <Text className={`text-sm ${secondaryTextClass}`}>{t('profile.about')}</Text>
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
            backgroundColor: colorScheme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
          onPress={() => setShowSettingsModal(false)}
        >
          <Animated.View
            style={{
              backgroundColor: colorScheme === 'light' ? '#fff' : '#374151',
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colorScheme === 'light' ? '#1F2937' : '#D1D5DB' }}>{t('profile.menu.settings.title')}</Text>{/* Title */}
            <Text style={{ fontWeight: 'bold', marginBottom: 8, color: colorScheme === 'light' ? '#1F2937' : '#D1D5DB' }}>{t('profile.menu.settings.theme')}</Text>{/* Theme Label */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedTheme === 'light' ? (colorScheme === 'light' ? '#2563EB' : '#60A5FA') : (colorScheme === 'light' ? '#E2E8F0' : '#4B5563'),
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10, // Added marginRight here
                }}
                onPress={() => setSelectedTheme('light')}
              >
                <Text style={{ color: selectedTheme === 'light' ? (colorScheme === 'light' ? '#fff' : '#1F2937') : (colorScheme === 'light' ? '#2563EB' : '#9CA3AF') }}>{t('profile.menu.settings.theme_light')}</Text>
              </TouchableOpacity> 
              <TouchableOpacity 
                style={{
                  backgroundColor: selectedTheme === 'dark' ? (colorScheme === 'light' ? '#2563EB' : '#60A5FA') : (colorScheme === 'light' ? '#E2E8F0' : '#4B5563'),
                  padding: 10,
                  borderRadius: 6,
                  marginLeft: 10,
                 }}
                onPress={() => setSelectedTheme('dark')}
              >
                <Text style={{ color: selectedTheme === 'dark' ? (colorScheme === 'light' ? '#fff' : '#1F2937') : (colorScheme === 'light' ? '#2563EB' : '#9CA3AF') }}>{t('profile.menu.settings.theme_dark')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <TouchableOpacity
                style={{ 
                  backgroundColor: selectedLanguage === 'es' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6, // Corrected borderRadius
                  marginRight: 10,
                }}
                onPress={() => {
                  setSelectedLanguage('es');
                  import('../i18n').then(({ default: i18n }) => {
                    i18n.changeLanguage('es');
                  });
                }}
              >
                <Text style={{ color: selectedLanguage === 'es' ? (colorScheme === 'light' ? '#fff' : '#1F2937') : (colorScheme === 'light' ? '#2563EB' : '#9CA3AF') }}>{t('profile.menu.settings.language_es')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ 
                  backgroundColor: selectedLanguage === 'en' ? '#2563EB' : '#E2E8F0',
                  padding: 10,
                  borderRadius: 6,
                }} // Corrected style closing
                onPress={() => {
                  setSelectedLanguage('en');
                  import('../i18n').then(({ default: i18n }) => {
                    i18n.changeLanguage('en');
                  });
                }}
              >
                <Text style={{ color: selectedLanguage === 'en' ? (colorScheme === 'light' ? '#fff' : '#1F2937') : (colorScheme === 'light' ? '#2563EB' : '#9CA3AF') }}>{t('profile.menu.settings.language_en')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colorScheme === 'light' ? '#2563EB' : '#60A5FA',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowSettingsModal(false)} // Added closing parenthesis and brace
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('profile.menu.settings.save_button')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </AppContainer>
  );
}
