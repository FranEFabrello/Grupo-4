import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const containerClass = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const loginBtnClass = isDark ? 'bg-blue-700' : 'bg-blue-600';
  const registerBtnClass = isDark ? 'bg-blue-900' : 'bg-blue-800';
  const cardBgClass = isDark ? 'bg-gray-800' : 'bg-white';

  return (
    <View className={`flex-1 ${containerClass} justify-center items-center p-6`}>
      {/* Contenedor central destacado */}
      <View className={`w-full rounded-2xl p-6 shadow-xl ${cardBgClass}`}>
        <Text className={`text-3xl font-bold mb-10 text-center ${textColor}`}>
          {t('welcome.title')}
        </Text>

        {/* Botón Login */}
        <TouchableOpacity
          activeOpacity={0.8}
          className={`w-full h-12 rounded-xl justify-center items-center mb-4 shadow-md ${loginBtnClass}`}
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-white font-semibold">
            {t('welcome.login_button')}
          </Text>
        </TouchableOpacity>

        {/* Botón Registro */}
        <TouchableOpacity
          activeOpacity={0.8}
          className={`w-full h-12 rounded-xl justify-center items-center shadow-md ${registerBtnClass}`}
          onPress={() => navigation.navigate('Register')}
        >
          <Text className="text-white font-semibold">
            {t('welcome.register_button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
