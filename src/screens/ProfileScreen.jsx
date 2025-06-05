import React, { useContext, useEffect } from "react";
import { View, ScrollView, Text, Pressable, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { actualizarConfiguraciones } from "~/store/slices/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colorScheme, setTheme } = useAppTheme(); // Usa el contexto del tema

  const userForLogout = {
    nombre: '',
    apellido: '',
    correo: '',
    urlimagenperfil: '',
    idioma: 'es',
    celular: '',
    cuentaActiva: null,
    dni: '',
    edad:'',
    fcmToken: '',
    fechaNacimiento: '',
    genero:'',
    id: '',
    obraSocialId: '',
    sesionActiva: null
  };

  const user = useSelector(state => state.user.usuario) || userForLogout;
  const dispatch = useDispatch();

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');



  // Cargar idioma al iniciar
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

  // Guardar configuraciones de idioma
  const saveSettings = async () => {
    await AsyncStorage.setItem('language', selectedLanguage);
    setShowSettingsModal(false);
  };

  // Theme variables usando colorScheme del ThemeProvider
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-600';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const iconColor = colorScheme === 'light' ? '#4A5568' : '#9CA3AF';
  const actionIconColor = colorScheme === 'light' ? '#2563EB' : '#60A5FA';


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
          className={`flex-row justify-between items-center ${containerBg} rounded-xl p-4 mb-4 shadow-md`}
          android_ripple={{ color: '#e2e8f0' }}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center bg-gray-500">
              {user && user.urlimagenperfil ? (
                <Image
                  source={{ uri: user.urlimagenperfil }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onError={() => console.log(t('user_profile.alerts.no_img'))}
                />
              ) : (
                <Icon
                  name="user-circle"
                  size={96}
                  color={colorScheme === 'light' ? '#2563EB' : '#1E40AF'}
                  style={{ backgroundColor: '#000' }}
                />
              )}
            </View>
            <View className="ml-2">
              <Text className={`text-lg font-semibold ${primaryText}`}>
                {t('home.greeting', { name: user?.nombre || 'Usuario' })}
              </Text>
              <Text className={`text-sm italic ${secondaryText}`}>
                {user.correo}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-2">
            <Icon name="eye" size={16} color={actionIconColor} />
            <Text
              className={`text-sm font-medium ${primaryText}`}
              style={{ color: colorScheme === 'light' ? '#2563EB' : '#fff' }}
            >
              {t('profile.view_profile')}
            </Text>
          </View>
        </Pressable>

        {/* Acciones rápidas */}
        <View className={`${containerBg} rounded-xl p-4 mb-4 shadow-md`}>
          <Text className={`text-xl font-semibold ${primaryText} mb-2`}>{t('profile.options_title')}</Text>
          <QuickActions
            actions={moreActions}
            navigation={navigation}
            style="flex-col"
            itemStyle="w-full mb-3"
            colorScheme={colorScheme}
          />
          <TouchableOpacity
            className={`w-full ${containerBg} rounded-xl p-4 shadow-md items-center`}
            style={{
              backgroundColor: colorScheme === 'light' ? '#fff' : '#1F2937',
            }}
            onPress={() => setShowSettingsModal(true)}
          >
            <View className={`w-10 h-10 ${colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900'} rounded-full justify-center items-center mb-2`}>
              <Icon name="cog" size={18} color={colorScheme === 'light' ? '#4a6fa5' : '#60A5FA'} />
            </View>
            <Text className={`text-base font-medium ${primaryText}`}>{t('profile.menu.settings.title')}</Text>
          </TouchableOpacity>
        </View>

        {/* Acerca de la app */}
        <View className={`${containerBg} rounded-xl p-4 shadow-md`}>
          <Text className={`text-base font-semibold ${primaryText} mb-2`}>{t('profile.about_title')}</Text>
          <Text className={`text-sm ${secondaryText} mb-2`}>{t('profile.about_version')}</Text>
          <Text className={`text-sm ${secondaryText}`}>{t('profile.about')}</Text>
        </View>
      </ScrollView>

      {/* Modal de configuración */}
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
              backgroundColor: colorScheme === 'light' ? '#fff' : '#1F2937',
              borderRadius: 12,
              padding: 24,
              width: '85%',
              elevation: 5,
              transform: [
                {
                  translateY: showSettingsModal ? 0 : 400,
                },
              ],
              opacity: showSettingsModal ? 1 : 0,
            }}
            entering={Animated.spring}
            exiting={Animated.timing}
            onStartShouldSetResponder={() => true}
            onResponderStart={e => e.stopPropagation()}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 16,
                color: colorScheme === 'light' ? '#1F2937' : '#fff',
              }}
            >
              {t('profile.menu.settings.title')}
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                color: colorScheme === 'light' ? '#1F2937' : '#fff',
              }}
            >
              {t('profile.menu.settings.theme')}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colorScheme === 'light' ? '#2563EB' : (colorScheme === 'light' ? '#E2E8F0' : '#374151'),
                  padding: 10,
                  borderRadius: 6,
                  marginRight: 10,
                }}
                onPress={() => {
                  setTheme('light');
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { modoOscuro: false } }));
                    dispatch({ type: 'user/setModoOscuro', payload: false });
                  }
                  console.log('Tema cambiado a: light');
                }}
              >
                <Text
                  style={{
                    color: colorScheme === 'light' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#2563EB'),
                  }}
                >
                  {t('profile.menu.settings.theme_light')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colorScheme === 'dark' ? '#2563EB' : (colorScheme === 'light' ? '#E2E8F0' : '#374151'),
                  padding: 10,
                  borderRadius: 6,
                }}
                onPress={() => {
                  setTheme('dark');
                  if (user) {
                    dispatch(actualizarConfiguraciones({ id: user.id, configuraciones: { modoOscuro: true } }));
                    dispatch({ type: 'user/setModoOscuro', payload: true });
                  }
                  console.log('Tema cambiado a: dark');
                }}
              >
                <Text
                  style={{
                    color: colorScheme === 'dark' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#2563EB'),
                  }}
                >
                  {t('profile.menu.settings.theme_dark')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                color: colorScheme === 'light' ? '#1F2937' : '#fff',
              }}
            >
              {t('profile.menu.settings.language')}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'es' ? '#2563EB' : (colorScheme === 'light' ? '#E2E8F0' : '#374151'),
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
                <Text
                  style={{
                    color: selectedLanguage === 'es' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#2563EB'),
                  }}
                >
                  {t('profile.menu.settings.language_es')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLanguage === 'en' ? '#2563EB' : (colorScheme === 'light' ? '#E2E8F0' : '#374151'),
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
                <Text
                  style={{
                    color: selectedLanguage === 'en' ? '#fff' : (colorScheme === 'dark' ? '#fff' : '#2563EB'),
                  }}
                >
                  {t('profile.menu.settings.language_en')}
                </Text>
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