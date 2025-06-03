import React, { useContext } from 'react';
import { View, ScrollView, Text, Pressable, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useColorScheme } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState('light');
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');

  const user = {
    name: 'Usuario',
    email: 'correo@ejemplo.com',
  };

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-600';
  const modalBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-500' : 'bg-blue-400';
  const selectedButtonText = 'text-white';
  const inactiveButtonBg = colorScheme === 'light' ? 'bg-gray-200' : 'bg-gray-600';
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
            <Icon name="user-circle" size={40} color={iconColor} className="mr-4" />
            <View>
              <Text className={`text-lg font-semibold ${primaryText}`}>{user.name}</Text>
              <Text className={`text-sm ${secondaryText}`}>{user.email}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-3">
            <Icon name="eye" size={16} color={actionIconColor} />
            <Text className={`text-sm font-medium ${actionIconColor}`}>{t('profile.view_profile')}</Text>
          </View>
        </Pressable>

        {/* Acciones rápidas */}
        <View className={`${containerBg} rounded-xl p-4 mb-4 shadow-md`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-4`}>{t('profile.options_title')}</Text>
          <QuickActions
            actions={moreActions}
            navigation={navigation}
            style="flex-col"
            itemStyle="w-full mb-3"
            colorScheme={colorScheme}
          />
          <TouchableOpacity
            className={`w-full ${containerBg} rounded-xl p-4 shadow-md items-center`}
            onPress={() => setShowSettingsModal(true)}
          >
            <View className={`w-10 h-10 ${colorScheme === 'light' ? 'bg-blue-100' : 'bg-gray-700'} rounded-full justify-center items-center mb-2`}>
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
      <Modal
        isVisible={showSettingsModal}
        onBackdropPress={() => setShowSettingsModal(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        className="justify-center items-center"
      >
        <View className={`${modalBg} rounded-xl p-6 w-[85%]`}>
          <Text className={`text-lg font-bold ${primaryText} mb-4`}>{t('profile.menu.settings.title')}</Text>
          <Text className={`font-bold ${primaryText} mb-2`}>{t('profile.menu.settings.theme')}</Text>
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`py-2 px-4 rounded-lg ${selectedTheme === 'light' ? selectedButtonBg : inactiveButtonBg} mr-2`}
              onPress={() => setSelectedTheme('light')}
            >
              <Text className={`${selectedTheme === 'light' ? selectedButtonText : primaryText}`}>{t('profile.menu.settings.theme_light')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-2 px-4 rounded-lg ${selectedTheme === 'dark' ? selectedButtonBg : inactiveButtonBg}`}
              onPress={() => setSelectedTheme('dark')}
            >
              <Text className={`${selectedTheme === 'dark' ? selectedButtonText : primaryText}`}>{t('profile.menu.settings.theme_dark')}</Text>
            </TouchableOpacity>
          </View>
          <Text className={`font-bold ${primaryText} mb-2`}>{t('profile.menu.settings.language')}</Text>
          <View className="flex-row mb-6">
            <TouchableOpacity
              className={`py-2 px-4 rounded-lg ${selectedLanguage === 'es' ? selectedButtonBg : inactiveButtonBg} mr-2`}
              onPress={() => {
                setSelectedLanguage('es');
                import('../i18n').then(({ default: i18n }) => {
                  i18n.changeLanguage('es');
                });
              }}
            >
              <Text className={`${selectedLanguage === 'es' ? selectedButtonText : primaryText}`}>{t('profile.menu.settings.language_es')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-2 px-4 rounded-lg ${selectedLanguage === 'en' ? selectedButtonBg : inactiveButtonBg}`}
              onPress={() => {
                setSelectedLanguage('en');
                import('../i18n').then(({ default: i18n }) => {
                  i18n.changeLanguage('en');
                });
              }}
            >
              <Text className={`${selectedLanguage === 'en' ? selectedButtonText : primaryText}`}>{t('profile.menu.settings.language_en')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className={`${selectedButtonBg} py-3 rounded-lg items-center`}
            onPress={() => setShowSettingsModal(false)}
          >
            <Text className={`${selectedButtonText} font-bold`}>{t('profile.menu.settings.save_button')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </AppContainer>
  );
}